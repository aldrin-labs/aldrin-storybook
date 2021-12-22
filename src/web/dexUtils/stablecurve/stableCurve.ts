import { computeOutputAmount } from "@orca-so/stablecurve";
import {u64} from "@solana/spl-token";

const AMP = new u64(85 * 2)
const FEE_NUMERATOR = new u64(38)
const FEE_DENOMINATOR = new u64(100000)

export function computeOutputAmountWithoutFee(
  inputAmount: u64,
  inputPoolAmount: u64,
  outputPoolAmount: u64,
): u64 {
  const outputAmount = computeOutputAmount(inputAmount, inputPoolAmount, outputPoolAmount, AMP)

  const outputAmountWithoutFee = outputAmount.sub(outputAmount.mul(FEE_NUMERATOR).div(FEE_DENOMINATOR))

  return outputAmountWithoutFee
}