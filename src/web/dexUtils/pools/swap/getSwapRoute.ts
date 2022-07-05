import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { getMarketsMintsEdges } from '@sb/dexUtils/common/getMarketsMintsEdges'
import { getShortestPaths } from '@sb/dexUtils/common/getShortestPaths'
import { marketsMap } from '@sb/dexUtils/markets'
import { getDecimalCount } from '@sb/dexUtils/utils'

import {
  getMarketForSwap,
  getMinimumReceivedAmountFromSwap,
  getSelectedPoolForSwap,
} from '@core/solana'
import { toBNWithDecimals } from '@core/utils/helpers'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { getPoolsMintsEdges } from '../getPoolsMintsEdges'
import {
  LoadedMarketWithOrderbook,
  LoadedMarketWithOrderbookMap,
} from '../hooks/useAllMarketsOrderbooks'
import { PoolsBalancesMap } from '../hooks/usePoolsBalances'
import { getInputAmountFromOutput } from './getInputAmountFromOutput'
import { getInputAmountFromOutputForOrderbook } from './getInputAmountFromOutputForOrderbook'
import { getMinimumReceivedFromOrderbook } from './getMinimumReceivedFromOrderbook'

type MintSteps = [string, string][]

type CommonSwapStep = {
  isSwapBaseToQuote: boolean
  inputMint: string
  outputMint: string
  swapAmountIn: number
  swapAmountOut: number
  swapAmountInWithSlippage: number
  swapAmountOutWithSlippage: number
}

type AldrinSwapStep = CommonSwapStep & {
  pool: PoolInfo
  ammLabel: 'Aldrin'
}

type SerumSwapStep = CommonSwapStep & {
  market: LoadedMarketWithOrderbook
  ammLabel: 'Serum'
}

export type SwapStep = AldrinSwapStep | SerumSwapStep
export type AmmLabel = SwapStep['ammLabel']

type CreateRouteFromFieldArgs = {
  pools: PoolInfo[]
  amountIn: number
  slippage: number
  mintSteps: MintSteps
  poolsBalancesMap?: PoolsBalancesMap
  marketsWithOrderbookMap?: LoadedMarketWithOrderbookMap
}

export type SwapRoute = SwapStep[]

const EMPTY_ROUTE_RESPONSE: [SwapRoute, number] = [[], 0]

const createRouteFromInputField = ({
  pools,
  amountIn,
  slippage,
  poolsBalancesMap,
  marketsWithOrderbookMap,
  mintSteps,
}: CreateRouteFromFieldArgs): [SwapRoute, number] => {
  const route: SwapRoute = []

  let tempSwapAmountIn = amountIn
  let tempSwapAmountInWithSlippage = amountIn

  let index = 0

  for (const [baseMint, quoteMint] of mintSteps) {
    const incrementedSlippage = slippage * (index + 1)

    const pool = getSelectedPoolForSwap({
      pools,
      baseTokenMintAddress: baseMint,
      quoteTokenMintAddress: quoteMint,
    })

    let isSwapBaseToQuote = null

    let swapAmountOut = 0
    let swapAmountOutWithSlippage = 0

    // if no pool - try to find market
    if (!pool) {
      if (!marketsWithOrderbookMap) {
        return EMPTY_ROUTE_RESPONSE
      }
      const [market, isMarketSwapBaseToQuote]: [
        LoadedMarketWithOrderbook | null,
        boolean | null
      ] = getMarketForSwap({
        marketsMap: marketsWithOrderbookMap,
        baseTokenMintAddress: baseMint,
        quoteTokenMintAddress: quoteMint,
      })

      if (!market || isMarketSwapBaseToQuote === null) {
        return EMPTY_ROUTE_RESPONSE
      }

      isSwapBaseToQuote = isMarketSwapBaseToQuote
      const roundedSwapAmountIn = isSwapBaseToQuote
        ? +stripDigitPlaces(
            tempSwapAmountIn,
            getDecimalCount(market.market?.minOrderSize)
          )
        : tempSwapAmountIn

      const roundedSwapAmountInWithSlippage = isSwapBaseToQuote
        ? +stripDigitPlaces(
            tempSwapAmountInWithSlippage,
            getDecimalCount(market.market?.minOrderSize)
          )
        : tempSwapAmountInWithSlippage

      // if base to quote -> strip input
      swapAmountOut = getMinimumReceivedFromOrderbook({
        market,
        swapAmountIn: roundedSwapAmountIn,
        isSwapBaseToQuote,
      })

      swapAmountOutWithSlippage =
        swapAmountOut - (swapAmountOut / 100) * incrementedSlippage

      if (!isSwapBaseToQuote) {
        const strippedSwapAmountOutWithSlippage = +stripDigitPlaces(
          swapAmountOutWithSlippage,
          getDecimalCount(market.market?.minOrderSize)
        )

        // TODO: remove it by rounding to down
        if (strippedSwapAmountOutWithSlippage >= swapAmountOutWithSlippage) {
          swapAmountOutWithSlippage =
            strippedSwapAmountOutWithSlippage - market.market?.minOrderSize
        } else {
          swapAmountOutWithSlippage = strippedSwapAmountOutWithSlippage
        }
      }

      route.push({
        market,
        ammLabel: 'Serum',
        inputMint: baseMint,
        outputMint: quoteMint,
        swapAmountIn: roundedSwapAmountIn,
        swapAmountOut,
        swapAmountInWithSlippage: roundedSwapAmountInWithSlippage,
        swapAmountOutWithSlippage,
        isSwapBaseToQuote,
      })
    } else {
      let poolBalances = null

      const poolBalancesFromTVL = {
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

      if (!poolsBalancesMap || !poolsBalancesMap.has(pool.swapToken)) {
        poolBalances = poolBalancesFromTVL
      } else {
        poolBalances =
          poolsBalancesMap.get(pool.swapToken) || poolBalancesFromTVL
      }

      isSwapBaseToQuote = pool.tokenA === baseMint
      swapAmountOut = getMinimumReceivedAmountFromSwap({
        pool,
        swapAmountIn: tempSwapAmountIn,
        isSwapBaseToQuote,
        poolBalances,
      })

      swapAmountOutWithSlippage =
        swapAmountOut - (swapAmountOut / 100) * incrementedSlippage

      route.push({
        pool,
        ammLabel: 'Aldrin',
        inputMint: baseMint,
        outputMint: quoteMint,
        swapAmountIn: tempSwapAmountIn,
        swapAmountOut,
        swapAmountInWithSlippage: tempSwapAmountInWithSlippage,
        swapAmountOutWithSlippage,
        isSwapBaseToQuote,
      })
    }

    tempSwapAmountIn = swapAmountOut
    tempSwapAmountInWithSlippage = swapAmountOutWithSlippage

    index += 1
  }

  const totalSwapAmountOut =
    route.length > 0 ? route[index - 1].swapAmountOut : 0

  return [route, totalSwapAmountOut]
}

const createRouteFromOutputField = ({
  pools,
  slippage,
  outputAmount,
  poolsBalancesMap,
  marketsWithOrderbookMap,
  mintSteps,
}: CreateRouteFromFieldArgs): [SwapRoute, number] => {
  const route: SwapRoute = []

  let tempSwapAmountOut = outputAmount

  // we need to find route from output to input
  const reversedMintSteps = mintSteps
    .map((step) => [...step.reverse()])
    .reverse()

  for (const [baseMint, quoteMint] of reversedMintSteps) {
    const pool = getSelectedPoolForSwap({
      pools,
      baseTokenMintAddress: baseMint,
      quoteTokenMintAddress: quoteMint,
    })

    let isSwapBaseToQuote = null
    let swapAmountIn = 0

    // if no pool - try to find market
    if (!pool) {
      if (!marketsWithOrderbookMap) {
        return EMPTY_ROUTE_RESPONSE
      }
      const [market, isMarketSwapBaseToQuote]: [
        LoadedMarketWithOrderbook | null,
        boolean | null
      ] = getMarketForSwap({
        marketsMap: marketsWithOrderbookMap,
        baseTokenMintAddress: baseMint,
        quoteTokenMintAddress: quoteMint,
      })

      if (!market || isMarketSwapBaseToQuote === null) {
        return EMPTY_ROUTE_RESPONSE
      }

      isSwapBaseToQuote = !isMarketSwapBaseToQuote
      // find amount we need to buy/sell for getting tempSwapAmountIn
      swapAmountIn = getInputAmountFromOutputForOrderbook({
        market,
        outputAmount: tempSwapAmountOut,
        outputMint: baseMint,
      })

      route.push({
        market,
        ammLabel: 'Serum',
        inputMint: quoteMint,
        outputMint: baseMint,
        swapAmountIn,
        swapAmountOut: tempSwapAmountOut,
        swapAmountInWithSlippage: swapAmountIn,
        swapAmountOutWithSlippage: tempSwapAmountOut,
        isSwapBaseToQuote,
      })
    } else {
      let poolBalances = null

      const poolBalancesFromTVL = {
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

      if (!poolsBalancesMap || !poolsBalancesMap.has(pool.swapToken)) {
        poolBalances = poolBalancesFromTVL
      } else {
        poolBalances =
          poolsBalancesMap.get(pool.swapToken) || poolBalancesFromTVL
      }

      // reverse due to reversed order (from quote to base)
      isSwapBaseToQuote = !(pool.tokenA === baseMint)

      const result = getInputAmountFromOutput({
        pool,
        poolBalances,
        outputAmount: tempSwapAmountOut,
        isSwapBaseToQuote,
      })

      swapAmountIn = result.swapAmountIn

      route.push({
        pool,
        ammLabel: 'Aldrin',
        inputMint: quoteMint,
        outputMint: baseMint,
        swapAmountIn,
        swapAmountInWithSlippage: swapAmountIn,
        swapAmountOut: tempSwapAmountOut,
        swapAmountOutWithSlippage: tempSwapAmountOut,
        isSwapBaseToQuote,
      })
    }

    tempSwapAmountOut = swapAmountIn
  }

  let tempSwapAmountInWithSlippage = route[route.length - 1].swapAmountIn

  // we want to add slippage here
  const reversedPath = route.reverse().map((swapStep, index) => {
    const incrementedOutputAmountSlippage = slippage * (index + 1)

    let swapAmountOutWithSlippage =
      swapStep.swapAmountOut -
      (swapStep.swapAmountOut / 100) * incrementedOutputAmountSlippage

    if (swapStep.ammLabel === 'Aldrin') {
      const swapStepWithSlippage = {
        ...swapStep,
        swapAmountInWithSlippage: tempSwapAmountInWithSlippage,
        swapAmountOutWithSlippage,
      }

      tempSwapAmountInWithSlippage = swapAmountOutWithSlippage

      return swapStepWithSlippage
    }
    if (swapStep.ammLabel === 'Serum') {
      let strippedSwapAmountOutWithSlippage = !swapStep.isSwapBaseToQuote
        ? // TODO: round down, then remove condition below
          +stripDigitPlaces(
            swapAmountOutWithSlippage,
            getDecimalCount(swapStep.market.market?.minOrderSize)
          )
        : swapAmountOutWithSlippage

      // remove minOrderSize to amountOut due to rounding
      if (
        !swapStep.isSwapBaseToQuote &&
        strippedSwapAmountOutWithSlippage >= swapAmountOutWithSlippage
      ) {
        strippedSwapAmountOutWithSlippage -=
          swapStep.market.market?.minOrderSize
      }

      swapAmountOutWithSlippage = strippedSwapAmountOutWithSlippage

      const swapStepWithSlippage = {
        ...swapStep,
        swapAmountInWithSlippage: tempSwapAmountInWithSlippage,
        swapAmountOutWithSlippage,
      }

      tempSwapAmountInWithSlippage = swapAmountOutWithSlippage

      return swapStepWithSlippage
    }

    return swapStep
  })

  return [reversedPath, tempSwapAmountOut]
}

const getSwapRoute = ({
  pools,
  amountIn,
  field = 'input',
  baseTokenMint,
  quoteTokenMint,
  slippage = 0,
  poolsBalancesMap,
  marketsWithOrderbookMap,
}: {
  pools: PoolInfo[]
  amountIn: number
  field?: 'input' | 'output'
  baseTokenMint: string
  quoteTokenMint: string
  slippage?: number
  poolsBalancesMap?: PoolsBalancesMap
  marketsWithOrderbookMap?: LoadedMarketWithOrderbookMap
}): [SwapRoute, number] => {
  const poolsEdges = getPoolsMintsEdges(pools)
  const marketsEdges = getMarketsMintsEdges([...marketsMap.keys()])

  const shortPaths: string[][] = getShortestPaths({
    edges: [...poolsEdges, ...marketsEdges],
    startNode: baseTokenMint,
    endNode: quoteTokenMint,
  })

  if (shortPaths.length === 0) {
    return EMPTY_ROUTE_RESPONSE
  }

  const swapRoutesMintSteps: MintSteps[] = shortPaths.map((path) => {
    const steps: MintSteps = path.reduce<MintSteps>(
      (acc, mint, index, array) => {
        if (array.length - 1 === index) {
          return acc
        }

        acc.push([mint, array[index + 1]])

        return acc
      },
      []
    )

    return steps
  })

  if (field === 'input') {
    const routes: [SwapRoute, number][] = swapRoutesMintSteps.map(
      (mintSteps) => {
        return createRouteFromInputField({
          mintSteps,
          pools,
          amountIn,
          slippage,
          marketsWithOrderbookMap,
          poolsBalancesMap,
        })
      }
    )

    // for output have another sort - the most similar to amountIn
    const bestRoute = routes.sort((a, b) => {
      const [_routeB, swapAmountOutB] = b
      const [_routeA, swapAmountOutA] = a

      return swapAmountOutB - swapAmountOutA
    })[0]

    return bestRoute
  }

  if (field === 'output') {
    const routes: [SwapRoute, number][] = swapRoutesMintSteps.map(
      (mintSteps) => {
        return createRouteFromOutputField({
          mintSteps,
          pools,
          outputAmount: amountIn,
          slippage,
          marketsWithOrderbookMap,
          poolsBalancesMap,
        })
      }
    )

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

    return bestRoute || EMPTY_ROUTE_RESPONSE
  }

  return EMPTY_ROUTE_RESPONSE
}

export { getSwapRoute }
