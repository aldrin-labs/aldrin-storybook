import { client } from '@core/graphql/apolloClient'
import { MarketData, PoolInfo } from '../Rebalance.types'
import { getPoolsInfo as getPoolsInfoQuery } from '@core/graphql/queries/pools/getPoolsInfo'

import { ALL_TOKENS_MINTS_MAP } from '@sb/dexUtils/markets'
import { MOCKED_MINTS_MAP } from '@sb/compositions/Rebalance/Rebalance.mock'
import { getPricesForTokens } from './getPricesForTokens'
import { REBALANCE_CONFIG } from '../Rebalance.config'
import { Graph } from '@core/utils/graph/Graph'

export const getMarketsData = (
  allMarketsMap: Map<string, { name: string }>
): MarketData[] => {
  // const getPoolsInfoQueryData = await client.query({
  //   query: getPoolsInfoQuery,
  //   fetchPolicy: 'network-only',
  // })

  // const { data: { getPoolsInfo } = { getPoolsInfo: [] } } =
  //   getPoolsInfoQueryData || {
  //     data: {
  //       getPoolsInfo: [],
  //     },
  //   }

  // TODO: Replace it with handling dupes in:
  // 1. Pools with the same base_quote and picking the most by tvl (tokenA & tokenB)
  // 2. Pools with reverted (SRM_SOL & SOL_SRM)

  const marketsDataArray = [...allMarketsMap.values()].map((el) => {
    const [base, quote] = el.name.split('_')

    return { ...el, tokenA: base, tokenB: quote }
  })
  // console.log('poolsWithoutRevertedDupes: ', poolsWithoutRevertedDupes)

  // // tvl USD calculations
  // const availablePoolsTokens: { symbol: string, mint: string }[] = Object.entries(poolsWithoutRevertedDupes.reduce((acc: any, el) => {

  //   acc[el.tokenA] = ALL_TOKENS_MINTS_MAP[el.tokenA] || MOCKED_MINTS_MAP[el.tokenA] || el.tokenA
  //   acc[el.tokenB] = ALL_TOKENS_MINTS_MAP[el.tokenB] || MOCKED_MINTS_MAP[el.tokenB] || el.tokenB

  //   return acc
  // }, {})).map(el => ({ symbol: el[1], mint: el[0] }))

  // const poolTokensWithPrices = await getPricesForTokens(availablePoolsTokens)

  // console.log('poolTokensWithPrices: ', poolTokensWithPrices)

  // Here we are filtering pool tokens without prices & etc. AND filtering SOL (not supported for Rebalance currently)
  // const filtredPoolsWithoutPrices = poolTokensWithPrices.filter(el => !!el.price && el.symbol !== 'SOL')

  // const poolTokensWithPricesMap: { [key: string]: { symbol: string, mint: string, price: number }} = filtredPoolsWithoutPrices.reduce((acc: any, el) => {
  //   acc[el.mint] = el

  //   return acc
  // }, {})

  // console.log('totalUserWalletUSDValue: ', totalUserWalletUSDValue)

  // Exact pools filtering
  // const filtredPools = JSON.parse(JSON.stringify(poolsWithoutRevertedDupes))
  // .map(el => {
  //   const priceTokenA = poolTokensWithPricesMap[el.tokenA]?.price
  //   const priceTokenB = poolTokensWithPricesMap[el.tokenB]?.price

  //   if (!(priceTokenA && priceTokenB)) {
  //     return { ...el, disabled: true, tvl: { ...el.tvl, USD: 0 } }
  //   }

  //   const tvlUSD = el.tvl.tokenA * priceTokenA + el.tvl.tokenB * priceTokenB

  //   if (totalUserWalletUSDValue > tvlUSD / REBALANCE_CONFIG.MULTIPLIER_FOR_ENOUGH_LIQUIDITY) {
  //     return { ...el, disabled: true, tvl: { ...el.tvl, USD: tvlUSD } }
  //   }

  //   return { ...el, disabled: false, tvl: { ...el.tvl, USD: tvlUSD } }
  // })
  // .filter(el => !el.disabled)

  // Here we are finding biggest connected component in graph to pick only pools related to it
  const graph = new Graph()
  marketsDataArray.forEach((el) => {
    const [base, quote] = el.name.split('_')

    graph.addEdge(base, quote)
    graph.addEdge(quote, base)
  })

  // TODO: Maybe in the future with might pick MOST RELATED TO TOKENS OF USER's wallet, instead of just picking the biggest connected component
  const biggestConnectedComponent = graph.getBiggestGraphConnectedComponent()
  // console.log('biggestConnectedComponent: ', biggestConnectedComponent)

  const filtredMarketsByBiggestConnectedComponent = marketsDataArray.filter(
    (el) => {
      const [base, quote] = el.name.split('_')

      return (
        biggestConnectedComponent.includes(base) &&
        biggestConnectedComponent.includes(quote)
      )
    }
  )
  // console.log('filtredPoolsByBiggestConnectedComponent: ', filtredPoolsByBiggestConnectedComponent)

  return filtredMarketsByBiggestConnectedComponent
}
