interface GetRatioAfterSwapParams {
  amountTokenA: number
  amountTokenB: number
  swapAmountIn: number
  swapAmountOut: number
  isSwapBaseToQuote: boolean
}

const getPoolRatioAfterSwap = ({
  amountTokenA,
  amountTokenB,
  swapAmountIn,
  swapAmountOut,
  isSwapBaseToQuote,
}: GetRatioAfterSwapParams) => {
  return isSwapBaseToQuote
    ? (amountTokenA + swapAmountIn) / (amountTokenB - swapAmountOut)
    : (amountTokenA - swapAmountOut) / (amountTokenB + swapAmountIn)
}

const getUserRatioAfterSwap = ({
  amountTokenA,
  amountTokenB,
  swapAmountIn,
  swapAmountOut,
  isSwapBaseToQuote,
}: GetRatioAfterSwapParams) => {
  return isSwapBaseToQuote
    ? (amountTokenA - swapAmountIn) / (amountTokenB + swapAmountOut)
    : (amountTokenA + swapAmountOut) / (amountTokenB - swapAmountIn)
}

export { getPoolRatioAfterSwap, getUserRatioAfterSwap }
