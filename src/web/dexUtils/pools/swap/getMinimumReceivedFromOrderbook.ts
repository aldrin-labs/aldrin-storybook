import { LoadedMarketWithOrderbook } from '../hooks/useAllMarketsOrderbooks'

export const getMinimumReceivedFromOrderbook = ({
  market,
  slippage = 0,
  swapAmountIn,
  isSwapBaseToQuote,
}: {
  market: LoadedMarketWithOrderbook
  slippage?: number
  swapAmountIn: number
  isSwapBaseToQuote: boolean
}) => {
  let tempSwapAmountIn = swapAmountIn
  let swapAmountOut = 0

  const side = isSwapBaseToQuote ? 'bids' : 'asks'
  const orderbookSide = market.orderbook[side]

  // mb reverse for one side
  orderbookSide.forEach((row) => {
    if (tempSwapAmountIn > 0) {
      // sell base (base -> quote), use bids
      // quote amount in row / price => base amount in row
      if (side === 'bids') {
        const [price, rowQuoteAmount] = row
        const rowBaseAmount = rowQuoteAmount / price

        const rowAmountToSwap =
          tempSwapAmountIn >= rowBaseAmount ? rowBaseAmount : tempSwapAmountIn

        tempSwapAmountIn -= rowAmountToSwap
        swapAmountOut += rowAmountToSwap * price
      } else {
        // buy base, (quote -> base), use asks
        // base amount in row * price => quote amount in row
        const [price, rowBaseAmount] = row
        const rowQuoteAmount = rowBaseAmount * price

        const rowAmountToSwap =
          tempSwapAmountIn >= rowQuoteAmount ? rowQuoteAmount : tempSwapAmountIn

        tempSwapAmountIn -= rowAmountToSwap
        swapAmountOut += rowAmountToSwap / price
      }
    }
  })

  // remove slippage part
  swapAmountOut -= (swapAmountOut / 100) * slippage

  return swapAmountOut
}
