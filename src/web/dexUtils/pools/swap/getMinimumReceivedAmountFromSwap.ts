import { PoolInfo } from '@sb/compositions/Pools/index.types'
import {
  getPoolsProgramAddress,
  POOLS_PROGRAM_ADDRESS,
} from '@sb/dexUtils/ProgramsMultiton/utils'
import BN from 'bn.js'

import { PoolBalances } from '../hooks/usePoolBalances'
import { getMinimumReceivedFromProductCurve } from './getMinimumReceivedFromProductCurve'
import { getMinimumReceivedFromStableCurveForSwap } from './getMinimumReceivedFromStableCurve'

export const getMinimumReceivedAmountFromSwap = ({
  swapAmountIn,
  isSwapBaseToQuote,
  pool,
  poolBalances,
}: {
  swapAmountIn: number
  isSwapBaseToQuote: boolean
  pool?: PoolInfo
  poolBalances: PoolBalances
}): number => {
  if (!pool) return 0

  const { curveType } = pool

  let swapAmountOut: number = 0

  if (getPoolsProgramAddress({ curveType }) === POOLS_PROGRAM_ADDRESS) {
    swapAmountOut = getMinimumReceivedFromProductCurve({
      swapAmountIn,
      isSwapBaseToQuote,
      poolBalances,
      pool,
    })
  } else {
    // program v2
    swapAmountOut = getMinimumReceivedFromStableCurveForSwap({
      swapAmountIn,
      isSwapBaseToQuote,
      pool,
      poolBalances,
    })
  }

  return swapAmountOut
}
