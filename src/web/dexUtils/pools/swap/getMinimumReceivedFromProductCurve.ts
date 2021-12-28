import { PoolBalances } from '../hooks/usePoolBalances'

export const getMinimumReceivedFromProductCurve = ({
  swapAmountIn,
  isSwapBaseToQuote,
  poolBalances,
}: {
  swapAmountIn: number
  isSwapBaseToQuote: boolean
  poolBalances: PoolBalances
}) => {
  const {
    baseTokenAmount: baseTokenAmountInPool,
    quoteTokenAmount: quoteTokenAmountInPool,
  } = poolBalances

  const diffBetweenAmountInPool = isSwapBaseToQuote
    ? baseTokenAmountInPool / swapAmountIn
    : quoteTokenAmountInPool / swapAmountIn

  const priceImpact = 100 / (diffBetweenAmountInPool + 1)
  const swapAmountOut = isSwapBaseToQuote
    ? swapAmountIn * (quoteTokenAmountInPool / baseTokenAmountInPool)
    : swapAmountIn * (baseTokenAmountInPool / quoteTokenAmountInPool)

  const swapAmountOutWithPriceImpact =
    swapAmountOut - (swapAmountOut / 100) * priceImpact

  return swapAmountOutWithPriceImpact
}
