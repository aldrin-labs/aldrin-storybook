import moment from 'moment'
import { OrderType, TradeType } from '@core/types/ChartTypes'
import { TableButton } from './TradingTable.styles'
import {
  fundsColumnNames,
  openOrdersColumnNames,
  orderHistoryColumnNames,
  tradeHistoryColumnNames,
} from '@sb/components/TradingTable/TradingTable.mocks'
import {
  fundsBody,
  openOrdersBody,
  orderHistoryBody,
  tradeHistoryBody,
} from '@sb/components/TradingTable/TradingTable.mocks'

export const getTableBody = (tab: string) =>
  tab === 'openOrders'
    ? openOrdersBody
    : tab === 'orderHistory'
    ? orderHistoryBody
    : tab === 'tradeHistory'
    ? tradeHistoryBody
    : tab === 'funds'
    ? fundsBody
    : []

export const getTableHead = (tab: string) =>
  tab === 'openOrders'
    ? openOrdersColumnNames
    : tab === 'orderHistory'
    ? orderHistoryColumnNames
    : tab === 'tradeHistory'
    ? tradeHistoryColumnNames
    : tab === 'funds'
    ? fundsColumnNames
    : []

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

export const combineOpenOrdersTable = (
  openOrdersData: OrderType[],
  cancelOrderFunc: () => Promise<any>
) => {
  const processedOpenOrdersData = openOrdersData
    .filter((el) => el.status === 'open')
    .map((el: OrderType, i: number) => {
      const {
        symbol,
        orderId,
        timestamp,
        type,
        side,
        price,
        stopPrice,
        origQty,
        executedQty,
      } = el

      return {
        id: orderId,
        date: moment(timestamp).format('MM-DD-YYYY h:mm:ss A'),
        pair: symbol,
        type: type,
        side: side,
        // TODO: We should change average "price" to average param from backend when it will be ready
        price: price,
        amount: origQty,
        filled: executedQty,
        // TODO: We should change "total" to total param from backend when it will be ready
        total: executedQty * price,
        // TODO: Not sure about triggerConditions
        triggerConditions: stopPrice || '-',
        // TODO: We should update cancelOrderFunc param
        cancel: {
          render: (
            <TableButton
              key={i}
              variant="outlined"
              size={`small`}
              onClick={() => cancelOrderFunc()}
            >
              Cancel
            </TableButton>
          ),
        },
      }
    })

  return processedOpenOrdersData
}

export const combineOrderHistoryTable = (orderData: OrderType[]) => {
  const processedOrderHistoryData = orderData.map((el: OrderType) => {
    const {
      symbol,
      orderId,
      timestamp,
      type,
      side,
      price,
      stopPrice,
      status,
      origQty,
      executedQty,
    } = el

    return {
      id: orderId,
      date: moment(timestamp).format('MM-DD-YYYY h:mm:ss A'),
      pair: symbol,
      type: type,
      side: side,
      // TODO: We should change average "price" to average param from backend when it will be ready
      average: price,
      price: price,
      filled: executedQty,
      amount: origQty,
      // TODO: We should change "total" to total param from backend when it will be ready
      total: executedQty * price,
      // TODO: Not sure about triggerConditions
      triggerConditions: stopPrice || '-',
      status: status,
    }
  })

  return processedOrderHistoryData
}

export const combineTradeHistoryTable = (tradeData: TradeType[]) => {
  const processedTradeHistoryData = tradeData.map((el: TradeType) => {
    const {
      id,
      timestamp,
      symbol,
      side,
      price,
      amount,
      fee: { cost, currency },
    } = el

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

// TODO: WIP, IN PROGRESS.
export const combineFundsTable = (fundsData: FundsType[]) => {
  const processedFundsDaata = fundsData.map((el: FundsType) => {
    const {} = el

    return {
      coin: `${String.fromCharCode(getRandomInt(65, 80)) +
        String.fromCharCode(getRandomInt(65, 80)) +
        String.fromCharCode(getRandomInt(65, 80))}`,
      totalBalance: getRandomInt(100, 300000),
      availableBalance: getRandomInt(100, 3000),
      inOrder: getRandomInt(1, 100),
      btcValue: getRandomInt(1, 10000),
    }
  })
}

// Update queries functions ->>

export const updateOpenOrderHistoryQuerryFunction = (
  prev,
  { subscriptionData }
) => {
  if (!subscriptionData.data) {
    return prev
  }

  const newOrder = JSON.parse(subscriptionData.data.listenMarketOrders)
  let obj = Object.assign({}, prev, {
    marketOrders: [newOrder],
  })

  return obj
}

export const updateOrderHistoryQuerryFunction = (
  prev,
  { subscriptionData }
) => {
  if (!subscriptionData.data) {
    return prev
  }

  const newOrder = JSON.parse(subscriptionData.data.listenMarketOrders)
  let obj = Object.assign({}, prev, {
    marketOrders: [newOrder],
  })

  return obj
}

export const updateTradeHistoryQuerryFunction = (
  prev,
  { subscriptionData }
) => {
  if (!subscriptionData.data) {
    return prev
  }

  const newOrder = JSON.parse(subscriptionData.data.listenMarketOrders)
  let obj = Object.assign({}, prev, {
    marketOrders: [newOrder],
  })

  return obj
}
