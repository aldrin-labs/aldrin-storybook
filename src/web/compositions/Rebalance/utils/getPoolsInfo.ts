import { client } from '@core/graphql/apolloClient'
import { getPoolsInfo as getPoolsInfoQuery } from '@core/graphql/queries/pools/getPoolsInfo'

import { ALL_TOKENS_MINTS_MAP } from '@sb/dexUtils/markets'
import { MOCKED_MINTS_MAP } from '@sb/compositions/Rebalance/Rebalance.mock'
import { Graph } from '@core/utils/graph/Graph'
import { getPricesForTokens } from './getPricesForTokens'
import { REBALANCE_CONFIG } from '../Rebalance.config'
import { PoolInfo } from '../Rebalance.types'

export const getPoolsInfo = async (
  totalUserWalletUSDValue: number
): Promise<PoolInfo[]> => {
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
  const poolsWithoutDuplicatesMap: { [key: string]: PoolInfo } =
    getPoolsInfo.reduce((acc: { [key: string]: PoolInfo }, el: PoolInfo) => {
      acc[el.name] = el

      return acc
    }, {})

  for (const el in poolsWithoutDuplicatesMap) {
    const revertedPoolName: string = poolsWithoutDuplicatesMap[el].name
      .split('_')
      .reverse()
      .join('_')

    if (poolsWithoutDuplicatesMap[revertedPoolName]) {
      delete poolsWithoutDuplicatesMap[revertedPoolName]
    }
  }

  const poolsWithoutRevertedDupes = Object.values(poolsWithoutDuplicatesMap)
  // console.log('poolsWithoutRevertedDupes: ', poolsWithoutRevertedDupes)

  // // tvl USD calculations
  const availablePoolsTokens: { symbol: string; mint: string }[] =
    Object.entries(
      poolsWithoutRevertedDupes.reduce((acc: any, el) => {
        acc[el.tokenA] =
          ALL_TOKENS_MINTS_MAP[el.tokenA] ||
          MOCKED_MINTS_MAP[el.tokenA] ||
          el.tokenA
        acc[el.tokenB] =
          ALL_TOKENS_MINTS_MAP[el.tokenB] ||
          MOCKED_MINTS_MAP[el.tokenB] ||
          el.tokenB

        return acc
      }, {})
    ).map((el) => ({ symbol: el[1], mint: el[0] }))

  const poolTokensWithPrices = await getPricesForTokens(availablePoolsTokens)

  // console.log('poolTokensWithPrices: ', poolTokensWithPrices)

  // Here we are filtering pool tokens without prices & etc. AND filtering SOL (not supported for Rebalance currently)
  const filtredPoolsWithoutPrices = poolTokensWithPrices.filter(
    (el) => !!el.price && el.symbol !== 'SOL'
  )

  const poolTokensWithPricesMap: {
    [key: string]: { symbol: string; mint: string; price: number }
  } = filtredPoolsWithoutPrices.reduce((acc: any, el) => {
    acc[el.mint] = el

    return acc
  }, {})

  // console.log('totalUserWalletUSDValue: ', totalUserWalletUSDValue)

  // Exact pools filtering
  const filtredPools = JSON.parse(JSON.stringify(poolsWithoutRevertedDupes))
    .map((el) => {
      const priceTokenA = poolTokensWithPricesMap[el.tokenA]?.price
      const priceTokenB = poolTokensWithPricesMap[el.tokenB]?.price

      if (!(priceTokenA && priceTokenB)) {
        return { ...el, disabled: true, tvl: { ...el.tvl, USD: 0 } }
      }

      const tvlUSD = el.tvl.tokenA * priceTokenA + el.tvl.tokenB * priceTokenB

      if (
        totalUserWalletUSDValue >
        tvlUSD / REBALANCE_CONFIG.MULTIPLIER_FOR_ENOUGH_LIQUIDITY
      ) {
        return { ...el, disabled: true, tvl: { ...el.tvl, USD: tvlUSD } }
      }

      return { ...el, disabled: false, tvl: { ...el.tvl, USD: tvlUSD } }
    })
    .filter((el) => !el.disabled)

  // Here we are finding biggest connected component in graph to pick only pools related to it
  const graph = new Graph()
  filtredPools.forEach((el) => {
    graph.addEdge(el.tokenA, el.tokenB)
    graph.addEdge(el.tokenB, el.tokenA)
  })

  // TODO: Maybe in the future with might pick MOST RELATED TO TOKENS OF USER's wallet, instead of just picking the biggest connected component
  const biggestConnectedComponent = graph.getBiggestGraphConnectedComponent()
  // console.log('biggestConnectedComponent: ', biggestConnectedComponent)

  const filtredPoolsByBiggestConnectedComponent = filtredPools.filter(
    (el) =>
      biggestConnectedComponent.includes(el.tokenA) &&
      biggestConnectedComponent.includes(el.tokenB)
  )
  // console.log('filtredPoolsByBiggestConnectedComponent: ', filtredPoolsByBiggestConnectedComponent)

  return filtredPoolsByBiggestConnectedComponent
}
