import { getDecimalCount } from '@sb/dexUtils/utils'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { LoadedMarketWithOrderbook } from '../hooks/useAllMarketsOrderbooks'

// we want to receive exact output amount from swap
// for it we need to determine input amount

// BTC - ask

// USDT - bid

export const getInputAmountFromOutputForOrderbook = ({
  market,
  outputAmount,
  outputMint,
}: {
  market: LoadedMarketWithOrderbook
  outputAmount: number
  outputMint: string
}) => {
  // remove fee here
  let tempSwapAmountIn = 0
  let tempSwapAmountOut = outputAmount

  const isBuySide = market.market?.quoteMintAddress.toString() === outputMint
  const side = isBuySide ? 'bids' : 'asks'
  const orderbookSide = market.orderbook[side]

  console.log('OB: outputAmount', {
    outputAmount,
    side,
    isBuySide,
    outputMint,
    market,
  })

  // mb reverse for one side
  orderbookSide.forEach((row) => {
    if (tempSwapAmountOut > 0) {
      // we want to swap quote token into base, total in amountOut, amount in amountIn
      if (side === 'bids') {
        const [price, rowQuoteAmount] = row
        const rowBaseTotal = rowQuoteAmount * price

        const rowTotalToSwap =
          tempSwapAmountOut >= rowBaseTotal ? rowBaseTotal : tempSwapAmountOut

        tempSwapAmountOut -= rowTotalToSwap
        tempSwapAmountIn += rowTotalToSwap / price
      } else {
        // we want to swap base into quote, amount in amountOut, total in amountIn
        const [price, rowBaseAmount] = row
        const rowQuoteAmount = rowBaseAmount / price

        const rowAmountToSwap =
          tempSwapAmountOut >= rowQuoteAmount
            ? rowQuoteAmount
            : tempSwapAmountOut

        tempSwapAmountOut -= rowAmountToSwap
        tempSwapAmountIn += rowAmountToSwap * price
      }
    }
  })

  if (isBuySide) {
    const strippedAmountIn = +stripDigitPlaces(
      tempSwapAmountIn,
      getDecimalCount(market.market?.minOrderSize)
    )

    return strippedAmountIn
  }

  return tempSwapAmountIn
}
