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
import { getInputAmountFromOutput } from './getInputAmountFromOutput'
import { getMinimumReceivedAmountFromSwap } from './getMinimumReceivedAmountFromSwap'
import { getMinimumReceivedFromOrderbook } from './getMinimumReceivedFromOrderbook'

type SwapStep = {
  pool: PoolInfo
  isSwapBaseToQuote: boolean
  swapAmountIn: number
  swapAmountOut: number
}

export type SwapRoute = SwapStep[]

const EMPTY_ROUTE_RESPONSE: [SwapRoute, number] = [[], 0]

const createRouteFromInputField = ({
  pools,
  amountIn,
  poolsBalancesMap,
  marketsWithOrderbookMap,
  path,
}): [SwapRoute, number] => {
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

      if (!market || isSwapBaseToQuote === null) {
        return EMPTY_ROUTE_RESPONSE
      }

      isSwapBaseToQuote = isMarketSwapBaseToQuote
      swapAmountOut = getMinimumReceivedFromOrderbook({
        market,
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
}

const createRouteFromOutputField = ({
  pools,
  amountIn,
  poolsBalancesMap,
  marketsWithOrderbookMap,
  path,
}): [SwapRoute, number] => {
  const route: SwapRoute = []

  let baseMint = ''
  let quoteMint = ''

  let tempSwapAmountIn = amountIn
  let multiSwapAmountOut = 0

  let index = 0

  // we need to find route from output to input, using
  const reversedPath = path.reverse()

  for (const mint of reversedPath) {
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

      if (!market || isSwapBaseToQuote === null) {
        return EMPTY_ROUTE_RESPONSE
      }

      isSwapBaseToQuote = isMarketSwapBaseToQuote
      swapAmountOut = getMinimumReceivedFromOrderbook({
        market,
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

      const result = getInputAmountFromOutput({
        pool,
        poolBalances,
        outputAmount: tempSwapAmountIn,
        isSwapBaseToQuote: !isSwapBaseToQuote,
      })

      console.log('getInputAmountFromOutput', {
        result,
        path,
        pool,
      })

      swapAmountOut = result.swapAmountIn
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

  const reversedRoute = route.reverse().map((step) => ({
    pool: step.pool,
    swapAmountOut: step.swapAmountIn,
    swapAmountIn: step.swapAmountOut,
    isSwapBaseToQuote: !step.isSwapBaseToQuote,
  }))

  return [reversedRoute, tempSwapAmountIn]
}

const getSwapRoute = ({
  pools,
  allMarketsMap,
  amountIn,
  field = 'input',
  baseTokenMint,
  quoteTokenMint,
  slippage,
  poolsBalancesMap,
  marketsWithOrderbookMap,
}: {
  pools: PoolInfo[]
  allMarketsMap?: MarketsMap
  amountIn: number
  field?: 'input' | 'output'
  baseTokenMint: string
  quoteTokenMint: string
  slippage?: number
  poolsBalancesMap?: Map<string, PoolBalances>
  marketsWithOrderbookMap?: LoadedMarketWithOrderbookMap
}): [SwapRoute, number] => {
  const poolsEdges = getPoolsMintsEdges(pools)
  const marketsEdges = allMarketsMap
    ? getMarketsMintsEdges([...allMarketsMap.keys()])
    : []

  // if no path with 3 length, use
  const shortPaths = getShortestPaths({
    edges: [...poolsEdges, ...marketsEdges],
    startNode: baseTokenMint,
    endNode: quoteTokenMint,
  })

  if (shortPaths.length === 0) {
    return EMPTY_ROUTE_RESPONSE
  }

  if (field === 'input') {
    const routes: [SwapRoute, number][] = shortPaths.map((path) => {
      return createRouteFromInputField({
        path,
        pools,
        amountIn,
        marketsWithOrderbookMap,
        poolsBalancesMap,
      })
    })

    // for output have another sort - the most similar to amountIn
    const bestRoute = routes.sort((a, b) => {
      const [_routeB, swapAmountOutB] = b
      const [_routeA, swapAmountOutA] = a

      return swapAmountOutB - swapAmountOutA
    })[0]

    return bestRoute
  }

  if (field === 'output') {
    const routes: [SwapRoute, number][] = shortPaths.map((path) => {
      return createRouteFromOutputField({
        path,
        pools,
        amountIn,
        marketsWithOrderbookMap,
        poolsBalancesMap,
      })
    })

    console.log('swapResults routes', routes)

    const bestRoute = routes
      .filter(([route]) => {
        if (amountIn > 0) {
          return route.length > 0 && route[0].swapAmountIn > 0
        }

        return true
      })
      .sort((a, b) => {
        const [routeB] = b
        const [routeA] = a

        return routeA[0].swapAmountIn - routeB[0].swapAmountIn
      })[0]

    return bestRoute
  }

  return EMPTY_ROUTE_RESPONSE
}

export { getSwapRoute }
