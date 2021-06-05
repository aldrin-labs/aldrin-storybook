import { client } from '@core/graphql/apolloClient'
import { PoolInfo } from '../Rebalance.types'
import { getPoolsInfo as getPoolsInfoQuery } from '@core/graphql/queries/pools/getPoolsInfo'

export const getPoolsInfo = async (): Promise<PoolInfo[]> => {
  const getPoolsInfoQueryData = await client.query({
    query: getPoolsInfoQuery,
    fetchPolicy: 'network-only',
  })

  const { data: { getPoolsInfo } = { getPoolsInfo: [] } } =
    getPoolsInfoQueryData || {
      data: {
        getPoolsInfo: [],
      },
    }

  // TODO: Replace it with handling dupes in:
  // 1. Pools with the same base_quote and picking the most by tvl (tokenA & tokenB)
  // 2. Pools with reverted (SRM_SOL & SOL_SRM)
  const poolsWithoutDuplicatesMap: {[key: string]: PoolInfo} = getPoolsInfo.reduce((acc: {[key: string]: PoolInfo}, el: PoolInfo) => {
      acc[el.name] = el

      return acc
    }, {})

  for (const el in poolsWithoutDuplicatesMap) {
    const revertedPoolName: string = poolsWithoutDuplicatesMap[el].name.split('_').reverse().join('_')

    if (poolsWithoutDuplicatesMap[revertedPoolName]) {
      delete poolsWithoutDuplicatesMap[revertedPoolName]
    }
  }

  const poolsWithoutRevertedDupes = Object.values(poolsWithoutDuplicatesMap)
  console.log('poolsWithoutRevertedDupes: ', poolsWithoutRevertedDupes)

  return poolsWithoutRevertedDupes
}
