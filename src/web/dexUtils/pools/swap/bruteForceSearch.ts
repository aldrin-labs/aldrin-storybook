import { SLIPPAGE_PERCENTAGE } from '@sb/compositions/Swap/config'

import {
  FindClosestAmountToSwapForDepositParams,
  SwapOptions,
} from './findClosestAmountToSwapForDeposit'
import { getMinimumReceivedAmountFromSwap } from './getMinimumReceivedAmountFromSwap'
import {
  getPoolRatioAfterSwap,
  getUserRatioAfterSwap,
} from './getRatioAfterSwap'

type BruteForceSearchParams = FindClosestAmountToSwapForDepositParams | {}

type CreateSwapOptionsParams =
  | FindClosestAmountToSwapForDepositParams
  | {
      isSwapBaseToQuote: boolean
    }

type CreateSwapOptionsResult = SwapOptions[]

const NUMBER_OF_STEPS = 100000

const createSwapOptions = (
  params: CreateSwapOptionsParams
): CreateSwapOptionsResult => {
  const {
    pool,
    poolBalances,
    userAmountTokenA,
    userAmountTokenB,
    isSwapBaseToQuote,
  } = params

  const {
    baseTokenAmount: poolAmountTokenA,
    quoteTokenAmount: poolAmountTokenB,
  } = poolBalances

  const swap = (swapAmountIn: number) =>
    getMinimumReceivedAmountFromSwap({
      swapAmountIn,
      isSwapBaseToQuote,
      pool,
      poolBalances,
      slippage: SLIPPAGE_PERCENTAGE,
    })

  // determine step size
  const userAmountToSwap = isSwapBaseToQuote
    ? userAmountTokenA
    : userAmountTokenB

  const stepSize = userAmountToSwap / NUMBER_OF_STEPS

  // go in cycle and add it every time to create array 10000
  const swapOptions = Array.from(Array(NUMBER_OF_STEPS).keys())
    .map((v) => v + 1)
    .map((iteration) => {
      const swapAmountIn = stepSize * iteration
      const swapAmountOut = swap(swapAmountIn)

      const poolRatioAfterSwap = getPoolRatioAfterSwap({
        amountTokenA: poolAmountTokenA,
        amountTokenB: poolAmountTokenB,
        swapAmountIn,
        swapAmountOut,
        isSwapBaseToQuote,
      })

      const userAmountsRatioAfterSwap = getUserRatioAfterSwap({
        amountTokenA: userAmountTokenA,
        amountTokenB: userAmountTokenB,
        swapAmountIn,
        swapAmountOut,
        isSwapBaseToQuote,
      })

      return {
        isSwapBaseToQuote,
        swapAmountIn,
        swapAmountOut,
        poolRatioAfterSwap,
        userAmountsRatioAfterSwap,
      }
    })

  return swapOptions
}

const bruteForceSearch = (params: BruteForceSearchParams): SwapOptions => {
  const { pool, poolBalances, userAmountTokenA, userAmountTokenB } = params

  // create array of results swapping tokenA-tokenB and tokenB-tokenA
  const swapBaseToQuoteResults = createSwapOptions({
    pool,
    poolBalances,
    userAmountTokenA,
    userAmountTokenB,
    isSwapBaseToQuote: true,
  })

  const swapQuoteToBaseResults = createSwapOptions({
    pool,
    poolBalances,
    userAmountTokenA,
    userAmountTokenB,
    isSwapBaseToQuote: false,
  })

  // take the closes one to pool amount ratio - user amount ratio
  const swapAmounts = [
    ...swapBaseToQuoteResults,
    ...swapQuoteToBaseResults,
  ].reduce((savedRatios, ratios) => {
    const { poolRatioAfterSwap, userAmountsRatioAfterSwap } = ratios

    const ratiosDiff = Math.abs(poolRatioAfterSwap - userAmountsRatioAfterSwap)
    const savedRatiosDiff = Math.abs(
      savedRatios.poolRatioAfterSwap - savedRatios.userAmountsRatioAfterSwap
    )

    // save if diff is smaller
    if (ratiosDiff < savedRatiosDiff) {
      return ratios
    }

    return savedRatios
  })

  return swapAmounts
}

export { bruteForceSearch }
