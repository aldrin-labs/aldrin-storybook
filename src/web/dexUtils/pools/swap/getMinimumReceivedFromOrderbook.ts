import { getDecimalCount } from '@sb/dexUtils/utils'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { LoadedMarketWithOrderbook } from '../hooks/useAllMarketsOrderbooks'

export const getMinimumReceivedFromOrderbook = ({
  market,
  swapAmountIn,
  isSwapBaseToQuote,
}: {
  market: LoadedMarketWithOrderbook
  swapAmountIn: number
  isSwapBaseToQuote: boolean
}) => {
  // remove fee here
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

  if (!isSwapBaseToQuote) {
    return +stripDigitPlaces(
      swapAmountOut,
      getDecimalCount(market.market?.minOrderSize)
    )
  }

  return swapAmountOut
}
