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
      numberOfSteps?: number
      isSwapBaseToQuote: boolean
      minAmount?: number
    }

type CreateSwapOptionsResult = SwapOptions[]

const NUMBER_OF_STEPS = 100_000

const createSwapOptions = (
  params: CreateSwapOptionsParams
): CreateSwapOptionsResult => {
  const {
    pool,
    slippage = SLIPPAGE_PERCENTAGE,
    poolBalances,
    userAmountTokenA,
    userAmountTokenB,
    isSwapBaseToQuote,
    minAmount = 0,
    numberOfSteps = NUMBER_OF_STEPS,
  } = params

  console.log('createSwapOptions: ', userAmountTokenA, userAmountTokenB)
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
      slippage,
    })

  // determine step size
  const userAmountToSwap = isSwapBaseToQuote
    ? userAmountTokenA
    : userAmountTokenB

  const stepSize = (userAmountToSwap - minAmount) / numberOfSteps

  // go in cycle and add it every time to create array 10000
  const swapOptions = Array.from(Array(numberOfSteps).keys())
    .map((v) => v + 1)
    .map((iteration) => {
      const swapAmountIn = minAmount + stepSize * iteration
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

  console.log('bruteForceSearch', userAmountTokenA)
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

export { bruteForceSearch, createSwapOptions }
