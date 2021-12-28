import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { PoolBalances } from '../hooks/usePoolBalances'
import { CURVE } from '../types'
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
  if (!pool || swapAmountIn === 0) return 0

  const { curveType = CURVE.PRODUCT } = pool

  let swapAmountOut: number = 0

  if (curveType === CURVE.STABLE) {
    // program v2 stable pool
    swapAmountOut = getMinimumReceivedFromStableCurveForSwap({
      swapAmountIn,
      isSwapBaseToQuote,
      pool,
      poolBalances,
    })
  } else {
    swapAmountOut = getMinimumReceivedFromProductCurve({
      pool,
      swapAmountIn,
      isSwapBaseToQuote,
      poolBalances,
    })
  }

  return swapAmountOut
}
