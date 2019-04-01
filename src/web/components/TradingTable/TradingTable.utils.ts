import moment from 'moment'
import { OrderType, TradeType } from '@core/types/ChartTypes'
export const getEndDate = (stringDate: string) =>
  stringDate === '1Day'
    ? moment().subtract(1, 'days')
    : stringDate === '1Week'
    ? moment().subtract(1, 'weeks')
    : stringDate === '1Month'
    ? moment().subtract(1, 'months')
    : moment().subtract(3, 'months')

export const getEmptyTextPlaceholder = (tab: string) =>
  tab === 'openOrders'
    ? 'You have no open orders.'
    : tab === 'orderHistory'
    ? 'You have no order history'
    : tab === 'tradeHistory'
    ? 'You have no trades.'
    : tab === 'funds'
    ? 'You have no Funds'
    : []

export const combineOrderHistoryTable = (orderData: OrderType[]) => {

  const processedOrderHistoryData = orderData.map((el: OrderType) => {
    const { symbol, orderId, timestamp, type, side, price, stopPrice, status, origQty, executedQty } = el

    return {
      id: orderId,
      date: moment(timestamp).format('MM-DD-YYYY h:mm:ss A'),
      pair: symbol,
      type: type,
      side: side,
      // TODO: We should change average "price" to average param from backend when it will be ready
      average: price,
      price: price,
      filled: { render: executedQty, isNumber: true },
      amount: origQty,
      // TODO: We should change "total" to total param from backend when it will be ready
      total: executedQty * price,
      triggerConditions: stopPrice || '-',
      status: status,
    }
  })

  return processedOrderHistoryData
}

export const combineTradeHistoryTable = (tradeData: TradeType[]) => {

  const processedTradeHistoryData = tradeData.map((el: TradeType) => {

    const { id, timestamp, symbol, side, price, amount, fee: { cost, currency } } = el

    return {
      id: id,
      time: moment(timestamp).format('MM-DD-YYYY h:mm:ss A'),
      pair: symbol,
      type: side,
      price: price,
      filled: amount,
      fee: { render: `${cost} ${currency}`, isNumber: true },
      // TODO: We should change "total" to total param from backend when it will be ready
      total: 0,
    }

  })

  return processedTradeHistoryData

}
