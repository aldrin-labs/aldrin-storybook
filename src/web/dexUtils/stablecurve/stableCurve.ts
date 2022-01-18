import { computeOutputAmount } from '@orca-so/stablecurve'
import { u64 } from '@solana/spl-token'
import { BN } from 'bn.js'

import { PoolFees } from '@sb/compositions/Pools/index.types'

export function computeOutputAmountWithoutFee(
  inputAmount: u64,
  inputPoolAmount: u64,
  outputPoolAmount: u64,
  poolFees: PoolFees,
  amp: u64
): u64 {
  const {
    tradeFeeDenominator,
    ownerTradeFeeDenominator,
    tradeFeeNumerator,
    ownerTradeFeeNumerator,
  } = poolFees

  const outputAmount = computeOutputAmount(
    inputAmount,
    inputPoolAmount,
    outputPoolAmount,
    amp.muln(2)
  )
  const outputAmountFee = outputAmount
    .mul(new BN(tradeFeeNumerator))
    .div(new BN(tradeFeeDenominator))
    .add(
      outputAmount
        .mul(new BN(ownerTradeFeeNumerator))
        .div(new BN(ownerTradeFeeDenominator))
    )

  const outputAmountWithoutFee = outputAmount.sub(outputAmountFee)

  return outputAmountWithoutFee
}
