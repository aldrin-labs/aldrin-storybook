import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { PoolBalances } from '../hooks/usePoolBalances'

// TODO: update to math using BN.js
export const getMinimumReceivedFromProductCurve = ({
  swapAmountIn,
  isSwapBaseToQuote,
  poolBalances,
  pool,
}: {
  swapAmountIn: number
  isSwapBaseToQuote: boolean
  poolBalances: PoolBalances
  pool: PoolInfo
}) => {
  const {
    tradeFeeNumerator,
    tradeFeeDenominator,
    ownerTradeFeeNumerator,
    ownerTradeFeeDenominator,
  } = pool.fees

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

  const swapAmountOutFee =
    (swapAmountOut * tradeFeeNumerator) / tradeFeeDenominator +
    (swapAmountOut * ownerTradeFeeNumerator) / ownerTradeFeeDenominator

  const swapAmountOutWithoutFee =
    swapAmountOutWithPriceImpact - swapAmountOutFee

  return swapAmountOutWithoutFee
}
