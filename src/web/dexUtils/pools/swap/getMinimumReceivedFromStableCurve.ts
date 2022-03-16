import BN from 'bn.js'

import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { computeOutputAmountWithoutFee } from '@sb/dexUtils/stablecurve/stableCurve'

import { PoolBalances } from '../hooks/usePoolBalances'

export const getMinimumReceivedFromStableCurveForSwap = ({
  swapAmountIn,
  isSwapBaseToQuote,
  pool,
  poolBalances,
}: {
  swapAmountIn: number
  isSwapBaseToQuote: boolean
  pool: PoolInfo
  poolBalances: PoolBalances
}) => {
  const { amp, tokenADecimals, tokenBDecimals, fees } = pool

  const {
    baseTokenAmountBN: poolAmountTokenA,
    quoteTokenAmountBN: poolAmountTokenB,
  } = poolBalances

  if (swapAmountIn === 0 || !amp) {
    return 0
  }

  const [baseTokenDecimals, quoteTokenDecimals] = isSwapBaseToQuote
    ? [tokenADecimals, tokenBDecimals]
    : [tokenBDecimals, tokenADecimals]

  const [inputPoolAmount, outputPoolAmount] = isSwapBaseToQuote
    ? [poolAmountTokenA, poolAmountTokenB]
    : [poolAmountTokenB, poolAmountTokenA]

  const swapAmountOut = computeOutputAmountWithoutFee(
    new BN(swapAmountIn * 10 ** baseTokenDecimals),
    inputPoolAmount,
    outputPoolAmount,
    fees,
    new BN(amp)
  )

  const swapAmountOutWithoutDecimals =
    +swapAmountOut.toString() / 10 ** quoteTokenDecimals

  return swapAmountOutWithoutDecimals
}
