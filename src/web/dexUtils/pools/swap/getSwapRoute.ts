import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { getMarketsMintsEdges } from '@sb/dexUtils/common/getMarketsMintsEdges'
import { getShortestPaths } from '@sb/dexUtils/common/getShortestPaths'
import { MarketsMap } from '@sb/dexUtils/markets'

import { toBNWithDecimals } from '@core/utils/helpers'

import { getMarketForSwap, getSelectedPoolForSwap } from '.'
import { getPoolsMintsEdges } from '../getPoolsMintsEdges'
import { PoolBalances } from '../hooks'
import {
  LoadedMarketWithOrderbook,
  LoadedMarketWithOrderbookMap,
} from '../hooks/useAllMarketsOrderbooks'
import { getMinimumReceivedAmountFromSwap } from './getMinimumReceivedAmountFromSwap'
import { getMinimumReceivedFromOrderbook } from './getMinimumReceivedFromOrderbook'

type SwapStep = {
  pool: PoolInfo
  isSwapBaseToQuote: boolean
  swapAmountIn: number
  swapAmountOut: number
}

export type SwapRoute = SwapStep[]

const getSwapRoute = ({
  pools,
  allMarketsMap,
  amountIn,
  baseTokenMint,
  quoteTokenMint,
  slippage,
  poolsBalancesMap,
  marketsWithOrderbookMap,
}: {
  pools: PoolInfo[]
  allMarketsMap?: MarketsMap
  amountIn: number
  baseTokenMint: string
  quoteTokenMint: string
  slippage?: number
  poolsBalancesMap?: Map<string, PoolBalances>
  marketsWithOrderbookMap?: LoadedMarketWithOrderbookMap
}): [SwapRoute, number] => {
  const EMPTY_ROUTE_RESPONSE: [SwapRoute, number] = [[], 0]

  const poolsEdges = getPoolsMintsEdges(pools)
  const marketsEdges = allMarketsMap
    ? getMarketsMintsEdges([...allMarketsMap.keys()])
    : []

  const shortPaths = getShortestPaths({
    edges: [...poolsEdges, ...marketsEdges],
    startNode: baseTokenMint,
    endNode: quoteTokenMint,
  })

  if (shortPaths.length === 0) {
    return EMPTY_ROUTE_RESPONSE
  }

  const routes: [SwapRoute, number][] = shortPaths.map((path) => {
    const route: SwapRoute = []

    let baseMint = ''
    let quoteMint = ''

    let tempSwapAmountIn = amountIn
    let multiSwapAmountOut = 0

    let index = 0

    for (const mint of path) {
      // determine pool & side
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

      let isSwapBaseToQuote = null
      let swapAmountOut = 0

      // if no pool - try to find market
      if (!pool && marketsWithOrderbookMap) {
        const [market, isMarketSwapBaseToQuote]: [
          LoadedMarketWithOrderbook | null,
          boolean | null
        ] = getMarketForSwap({
          marketsMap: marketsWithOrderbookMap,
          baseTokenMintAddress: baseMint,
          quoteTokenMintAddress: quoteMint,
        })

        console.log({
          market,
          isMarketSwapBaseToQuote,
        })

        if (!market || isSwapBaseToQuote === null) {
          return EMPTY_ROUTE_RESPONSE
        }

        isSwapBaseToQuote = isMarketSwapBaseToQuote
        swapAmountOut = getMinimumReceivedFromOrderbook({
          market,
          slippage,
          swapAmountIn: tempSwapAmountIn,
          isSwapBaseToQuote,
        })
      } else {
        let poolBalances = null

        if (!poolsBalancesMap || !poolsBalancesMap.has(pool.swapToken)) {
          poolBalances = {
            baseTokenAmount: pool.tvl.tokenA,
            quoteTokenAmount: pool.tvl.tokenB,
            baseTokenAmountBN: toBNWithDecimals(
              pool.tvl.tokenA,
              pool.tokenADecimals
            ),
            quoteTokenAmountBN: toBNWithDecimals(
              pool.tvl.tokenB,
              pool.tokenBDecimals
            ),
          }
        } else {
          poolBalances = poolsBalancesMap.get(pool.swapToken)
        }

        isSwapBaseToQuote = pool.tokenA === baseMint
        swapAmountOut = getMinimumReceivedAmountFromSwap({
          pool,
          slippage,
          swapAmountIn: tempSwapAmountIn,
          isSwapBaseToQuote,
          poolBalances,
        })
      }

      // calculate market swap amount out, write func which will calc using OB data

      // add field like programName = 'Aldrin' || 'Serum', isSwapThroughPool etc
      route.push({
        pool,
        swapAmountIn: tempSwapAmountIn,
        swapAmountOut,
        isSwapBaseToQuote,
      })

      tempSwapAmountIn = swapAmountOut
      multiSwapAmountOut = swapAmountOut

      index += 1
    }

    return [route, multiSwapAmountOut]
  })

  const bestRoute = routes.sort((a, b) => {
    const [routeB, swapAmountOutB] = b
    const [routeA, swapAmountOutA] = a

    return swapAmountOutB - swapAmountOutA
  })[0]

  return bestRoute
}

export { getSwapRoute }
