import { stripByAmount } from '@core/utils/chartPageUtils'

export const getNotificationText = ({
  baseSymbol = 'CCAI',
  quoteSymbol = 'USDC',
  baseUnsettled = 0,
  quoteUnsettled = 0,
  side = 'buy',
  amount = 0,
  price = 0,
  orderType = 'limit',
  operationType,
}: {
  baseSymbol?: string
  quoteSymbol?: string
  baseUnsettled?: number
  quoteUnsettled?: number
  side?: string
  amount?: number
  price?: number
  orderType?: string
  operationType:
    | 'createOrder'
    | 'cancelOrder'
    | 'settleFunds'
    | 'cancelAll'
    | 'settleAllFunds'
}): [string, string] => {
  const baseSettleText = `${stripByAmount(baseUnsettled)} ${baseSymbol}`
  const quoteSettleText = `${stripByAmount(quoteUnsettled)} ${quoteSymbol}`

  const settleTexts = [baseSettleText, quoteSettleText]

  const settleText = [baseUnsettled, quoteUnsettled]
    .map((value, idx) => (value > 0 ? settleTexts[idx] : null))
    .filter((_) => !!_)
    .join(' and ')

  const texts = {
    createOrder: [
      `${orderType.slice(0, 1).toUpperCase()}${orderType.slice(
        1
      )} order placed.`,
      `${baseSymbol}/${quoteSymbol}: ${side} ${amount} ${baseSymbol} order placed${
        orderType === 'market' ? '' : ` at ${price} ${quoteSymbol}`
      }.`,
    ],
    cancelOrder: [
      `Limit Order canceled.`,
      `${baseSymbol}/${quoteSymbol}: ${side} ${amount} ${baseSymbol} order canceled at ${price} ${quoteSymbol}.`,
    ],
    settleFunds: [
      `Funds Settled.`,
      `${settleText} has been successfully settled in your wallet.`,
    ],
    cancelAll: ['Orders canceled.', ``],
    settleAllFunds: ['Funds settled.', ''],
  }

  const [title, text] = texts[operationType]
  return [title, text]
}
