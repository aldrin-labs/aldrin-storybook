import { PoolInfo } from '@sb/compositions/Pools/index.types'

import { PoolBalances } from '../hooks'
import { createSwapOptions } from './bruteForceSearch'
import { SwapOptions } from './findClosestAmountToSwapForDeposit'

const getInputAmountFromOutput = (params: {
  pool: PoolInfo
  poolBalances: PoolBalances
  outputAmount: number
  isSwapBaseToQuote: boolean
}): SwapOptions => {
  const { pool, poolBalances, outputAmount, isSwapBaseToQuote } = params

  console.log('poolBalances', poolBalances)

  if (
    poolBalances.baseTokenAmountBN.eqn(0) ||
    poolBalances.quoteTokenAmountBN.eqn(0)
  ) {
    return {
      swapAmountIn: outputAmount,
      swapAmountOut: 0,
      isSwapBaseToQuote,
      poolRatioAfterSwap: 0,
      userAmountsRatioAfterSwap: 0,
    }
  }

  console.log('swapResults', { pool, poolBalances, outputAmount })

  const appproxInputAmount = isSwapBaseToQuote
    ? (poolBalances.baseTokenAmount / poolBalances.quoteTokenAmount) *
      outputAmount
    : (poolBalances.quoteTokenAmount / poolBalances.baseTokenAmount) *
      outputAmount

  console.log('swapResults', {
    userAmountTokenA: isSwapBaseToQuote ? appproxInputAmount * 2 : 0, // outputAmount * ratio * 2, to find the closest inputAmount to get outputAmount
    userAmountTokenB: isSwapBaseToQuote ? 0 : appproxInputAmount * 2,
    isSwapBaseToQuote,
  })

  // create array of results swapping tokenA-tokenB and tokenB-tokenA
  const swapResults = createSwapOptions({
    pool,
    poolBalances,
    slippage: 0,
    userAmountTokenA: isSwapBaseToQuote ? appproxInputAmount * 2 : 0, // outputAmount * ratio * 2, to find the closest inputAmount to get outputAmount
    userAmountTokenB: isSwapBaseToQuote ? 0 : appproxInputAmount * 2,
    isSwapBaseToQuote,
  })

  // take the closes one to pool amount ratio - user amount ratio
  const swapAmounts = swapResults.reduce((savedRatios, ratios) => {
    const { swapAmountOut } = ratios

    const swapAmountOutDiff = Math.abs(swapAmountOut - outputAmount)
    const savedSwapAmountOutDiff = Math.abs(
      savedRatios.swapAmountOut - outputAmount
    )

    // save if diff is smaller
    if (swapAmountOutDiff < savedSwapAmountOutDiff) {
      return ratios
    }

    return savedRatios
  })

  console.log('swapResults', swapAmounts)

  return swapAmounts
}

export { getInputAmountFromOutput }
