import { Graph } from '@core/utils/graph/Graph'
import { PublicKey } from '@solana/web3.js'
import { MarketData } from '../Rebalance.types'

export const getMarketsData = (
  allMarketsMap: Map<
    string,
    {
      name: string
      address: PublicKey
      programId: PublicKey
      deprecated: boolean
    }
  >
): MarketData[] => {
  const marketsDataArray = [...allMarketsMap.values()].map((el) => {
    const [base, quote] = el.name.split('_')

    return { ...el, tokenA: base, tokenB: quote }
  })

  // Here we are finding biggest connected component in graph to pick only pools related to it
  const graph = new Graph()
  marketsDataArray.forEach((el) => {
    const [base, quote] = el.name.split('_')

    graph.addEdge(base, quote)
    graph.addEdge(quote, base)
  })

  // TODO: Maybe in the future with might pick MOST RELATED TO TOKENS OF USER's wallet, instead of just picking the biggest connected component
  const biggestConnectedComponent = graph.getBiggestGraphConnectedComponent()

  const filtredMarketsByBiggestConnectedComponent = marketsDataArray.filter(
    (el) => {
      const [base, quote] = el.name.split('_')

      return (
        biggestConnectedComponent.includes(base) &&
        biggestConnectedComponent.includes(quote)
      )
    }
  )

  return filtredMarketsByBiggestConnectedComponent
}
