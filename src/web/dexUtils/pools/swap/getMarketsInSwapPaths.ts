import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { getMarketsMintsEdges } from '@sb/dexUtils/common/getMarketsMintsEdges'
import { getShortestPaths } from '@sb/dexUtils/common/getShortestPaths'
import { getTokenNameByMintAddress, MarketsMap } from '@sb/dexUtils/markets'

import { getSelectedPoolForSwap } from '.'
import { getPoolsMintsEdges } from '../getPoolsMintsEdges'

export const getMarketsInSwapPaths = ({
  pools,
  allMarketsMap,
  startNode,
  endNode,
}: {
  pools: PoolInfo[]
  allMarketsMap: MarketsMap
  startNode: string
  endNode: string
}): string[] => {
  console.log('getMarketsInSwapPaths')
  const poolsEdges = getPoolsMintsEdges(pools)

  const pathsViaPools = getShortestPaths({
    edges: poolsEdges,
    startNode,
    endNode,
  })

  if (pathsViaPools.length > 0) {
    return []
  }

  const marketsEdges = getMarketsMintsEdges([...allMarketsMap.keys()])

  const edges = [...poolsEdges, ...marketsEdges]

  let paths = getShortestPaths({
    edges,
    startNode,
    endNode,
    maxPathLength: 3,
  })

  if (paths.length === 0) {
    // no short paths, trying a bit longer
    paths = getShortestPaths({
      edges,
      startNode,
      endNode,
      maxPathLength: 4,
    })

    if (paths.length === 0) {
      // no sense to try longer paths
      return []
    }
  }

  const marketsInSwapPaths: string[] = []

  paths.forEach((path) => {
    let baseMint = ''
    let quoteMint = ''

    let index = 0

    // duplicate in getSwapRoute - refactore somehow? - check on review
    for (const mint of path) {
      if (index === 0) {
        baseMint = mint
        index += 1
        // eslint-disable-next-line no-continue
        continue
      }

      if (index === 1) {
        quoteMint = mint
      } else {
        baseMint = quoteMint
        quoteMint = mint
      }

      const pool = getSelectedPoolForSwap({
        pools,
        baseTokenMintAddress: baseMint,
        quoteTokenMintAddress: quoteMint,
      })

      const baseSymbol = getTokenNameByMintAddress(baseMint)
      const quoteSymbol = getTokenNameByMintAddress(quoteMint)

      if (!pool) {
        const marketName = `${baseSymbol}_${quoteSymbol}`
        const reversedMarketName = `${quoteSymbol}_${baseSymbol}`

        if (allMarketsMap.has(marketName)) {
          marketsInSwapPaths.push(marketName)
        } else if (allMarketsMap.has(reversedMarketName)) {
          marketsInSwapPaths.push(reversedMarketName)
        }
      }

      index += 1
    }
  })

  return [...new Set(marketsInSwapPaths)]
}
