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

interface ReverseBinarySearchParams
  extends FindClosestAmountToSwapForDepositParams {}

const reverseBinarySearch = (
  params: ReverseBinarySearchParams
): SwapOptions => {
  const { pool, poolBalances, userAmountTokenA, userAmountTokenB } = params

  const {
    baseTokenAmount: poolAmountTokenA,
    quoteTokenAmount: poolAmountTokenB,
  } = poolBalances

  const poolRatioForTokenA = poolAmountTokenB / poolAmountTokenA

  // determine which user amount is bigger using pool ratio
  const userAmountTokenAInTokenB = poolRatioForTokenA * userAmountTokenA
  const userAmountsDiffInTokenB = userAmountTokenAInTokenB - userAmountTokenB

  const tokenToSwap = userAmountsDiffInTokenB > 0 ? 'tokenA' : 'tokenB'
  const isSwapBaseToQuote = tokenToSwap === 'tokenA'

  const swap = (swapAmountIn: number) =>
    getMinimumReceivedAmountFromSwap({
      swapAmountIn,
      isSwapBaseToQuote,
      pool,
      poolBalances,
      slippage: SLIPPAGE_PERCENTAGE,
    })

  // determine min and max amount to swap
  let minSwapAmountIn = 0
  let maxSwapAmountIn = isSwapBaseToQuote ? userAmountTokenA : userAmountTokenB

  let iteration = 0

  while (true) {
    // determine amount to swap
    const swapAmountIn = (minSwapAmountIn + maxSwapAmountIn) / 2
    const swapAmountOut = swap(swapAmountIn)

    // determine pool and user amounts ratio with swapped amounts
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

    // check is new ratio close enough to ratio of user tokenA/B after swap
    const isUserAmountsRatioCloseEnoughToPool =
      Math.abs(poolRatioAfterSwap - userAmountsRatioAfterSwap) <=
      poolRatioAfterSwap / 10000

    if (isUserAmountsRatioCloseEnoughToPool || iteration >= 100) {
      break
    }

    // determine side we need to move to continue searching
    const doWeNeedMoreTokenA =
      poolRatioAfterSwap - userAmountsRatioAfterSwap > 0

    // change min/max to half value

    // if pool ratio > user, we need to have more tokenA (
    //  if swap base to quote -> give less tokenA,
    //  if swap quote to base -> give more tokenB
    // )

    if (
      (doWeNeedMoreTokenA && isSwapBaseToQuote) ||
      (!doWeNeedMoreTokenA && !isSwapBaseToQuote)
    ) {
      maxSwapAmountIn = swapAmountIn
    } else {
      // we need to give less tokenA
      minSwapAmountIn = swapAmountIn
    }

    iteration++
  }

  const swapAmountIn = (minSwapAmountIn + maxSwapAmountIn) / 2
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
    swapAmountIn,
    swapAmountOut,
    isSwapBaseToQuote,
    poolRatioAfterSwap,
    userAmountsRatioAfterSwap,
  }
}

export { reverseBinarySearch }
