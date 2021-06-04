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

  return getPoolsInfo
}
