import { PoolInfo } from '@sb/compositions/Pools/index.types'

import { createSwapOptions, SwapOptions } from '@core/solana'

import { PoolBalances } from '../hooks'

interface SearchParams {
  pool: PoolInfo
  poolBalances: PoolBalances
  outputAmount: number
  isSwapBaseToQuote: boolean
}

interface FindOptionParams extends SearchParams {
  appproxInputAmount: number
  minAmountMultiplier?: number
  maxAmountMultiplier?: number
}

const findBestOption = (params: FindOptionParams) => {
  const {
    pool,
    poolBalances,
    outputAmount,
    isSwapBaseToQuote,
    appproxInputAmount,
    minAmountMultiplier = 0,
    maxAmountMultiplier = 2,
  } = params

  // console.log('findBest: ', appproxInputAmount)
  // create array of results swapping tokenA-tokenB and tokenB-tokenA
  const swapResults = createSwapOptions({
    pool,
    poolBalances,
    slippage: 0,
    userAmountTokenA: isSwapBaseToQuote
      ? appproxInputAmount * maxAmountMultiplier
      : 0, // outputAmount * ratio * 2, to find the closest inputAmount to get outputAmount
    userAmountTokenB: isSwapBaseToQuote
      ? 0
      : appproxInputAmount * maxAmountMultiplier,
    isSwapBaseToQuote,
    minAmount: appproxInputAmount * minAmountMultiplier,
    numberOfSteps: 3_000,
  })

  // take the closes one to pool amount ratio - user amount ratio
  const swapAmounts = swapResults
    .map((ratios) => {
      const { swapAmountOut } = ratios

      const swapAmountOutDiff = Math.abs(swapAmountOut - outputAmount)
      return { ...ratios, swapAmountOutDiff }
    })
    .sort(
      (ratioA, ratioB) => ratioA.swapAmountOutDiff - ratioB.swapAmountOutDiff
    )

  // console.log('swapResults1', swapAmounts)

  return swapAmounts[0]
}

const getInputAmountFromOutput = (params: SearchParams): SwapOptions => {
  const { pool, poolBalances, outputAmount, isSwapBaseToQuote } = params

  // console.log('poolBalances', poolBalances)

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
  const appproxInputAmount = isSwapBaseToQuote
    ? (poolBalances.baseTokenAmount / poolBalances.quoteTokenAmount) *
      outputAmount
    : (poolBalances.quoteTokenAmount / poolBalances.baseTokenAmount) *
      outputAmount

  // console.log('swapResults2', {
  //   userAmountTokenA: isSwapBaseToQuote ? appproxInputAmount * 2 : 0, // outputAmount * ratio * 2, to find the closest inputAmount to get outputAmount
  //   userAmountTokenB: isSwapBaseToQuote ? 0 : appproxInputAmount * 2,
  //   isSwapBaseToQuote,
  // })

  const step1 = findBestOption({
    ...params,
    appproxInputAmount,
  })

  const step2 = findBestOption({
    ...params,
    appproxInputAmount: step1.swapAmountIn,
    minAmountMultiplier: 0.95,
    maxAmountMultiplier: 1.05,
  })
  return step2
}

export { getInputAmountFromOutput }
