import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { PoolBalances } from '../hooks/usePoolBalances'
import { bruteForceSearch } from './bruteForceSearch'
import { reverseBinarySearch } from './reverseBinarySearch'

export interface FindClosestAmountToSwapForDepositParams {
  pool: PoolInfo
  poolBalances: PoolBalances
  userAmountTokenA: number
  userAmountTokenB: number
}

export interface SwapOptions {
  poolRatioAfterSwap: number
  userAmountsRatioAfterSwap: number
  isSwapBaseToQuote: boolean
  swapAmountIn: number
  swapAmountOut: number
}

export interface ClosestAmountsToSwapResult {
  swapOptions: SwapOptions
  userDepositPercentageOfPoolAmounts: number
}

const findClosestAmountToSwapForDeposit = (
  params: FindClosestAmountToSwapForDepositParams
): ClosestAmountsToSwapResult => {
  const { poolBalances, userAmountTokenA, userAmountTokenB } = params

  const {
    baseTokenAmount: poolAmountTokenA,
    quoteTokenAmount: poolAmountTokenB,
  } = poolBalances

  const userDepositTokenAPartOfPool = userAmountTokenA / poolAmountTokenA
  const userDepositTokenBPartOfPool = userAmountTokenB / poolAmountTokenB

  const userDepositPercentageOfPoolAmounts =
    ((userDepositTokenAPartOfPool + userDepositTokenBPartOfPool) / 2) * 100

  console.log({
    userDepositPercentageOfPoolAmounts,
  })

  if (userDepositPercentageOfPoolAmounts >= 1) {
    // calc swap amount via brute force search due to user swap impact on pool ratio
    return {
      swapOptions: bruteForceSearch(params),
      userDepositPercentageOfPoolAmounts,
    }
  } else {
    return {
      swapOptions: reverseBinarySearch(params),
      userDepositPercentageOfPoolAmounts,
    }
  }
}

export { findClosestAmountToSwapForDeposit }
