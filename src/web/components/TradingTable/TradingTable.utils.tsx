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
    ? 'You have no order history.'
    : tab === 'tradeHistory'
    ? 'You have no trades.'
    : tab === 'funds'
    ? 'You have no Funds.'
    : []

export const combineOpenOrdersTable = (
  openOrdersData: OrderType[],
  cancelOrderFunc: (keyId: string, orderId: string) => Promise<any>
) => {
  if (!openOrdersData && !Array.isArray(openOrdersData)) {
    console.log(
      'inside combineOpenOrdersTable',
      !openOrdersData,
      Array.isArray(openOrdersData)
    )

    return []
  }

  console.log('outside combineOpenOrdersTable')

  const processedOpenOrdersData = openOrdersData.map(
    (el: OrderType, i: number) => {
      const {
        keyId,
        symbol,
        timestamp,
        type,
        side,
        price,
        info: { orderId, stopPrice = 0, origQty = 0, executedQty = 0 },
      } = el

      return {
        id: orderId,
        date: moment(timestamp).format('MM-DD-YYYY h:mm:ss A'),
        pair: symbol,
        type: type,
        side: side,
        // TODO: We should change average "price" to average param from backend when it will be ready
        price: { render: price, isNumber: true },
        amount: { render: origQty, isNumber: true },
        filled: { render: executedQty, isNumber: true },
        // TODO: We should change "total" to total param from backend when it will be ready
        total: { render: price, isNumber: true },
        // TODO: Not sure about triggerConditions
        triggerConditions: { render: stopPrice, isNumber: true },
        // TODO: We should update cancelOrderFunc param
        cancel: {
          render: (
            <TableButton
              key={i}
              variant="outlined"
              size={`small`}
              onClick={() => cancelOrderFunc(keyId, orderId)}
            >
              Cancel
            </TableButton>
          ),
        },
      }
    }
  )

  console.log('processedOpenOrdersData in utils', processedOpenOrdersData)

  return processedOpenOrdersData
}

export const combineOrderHistoryTable = (orderData: OrderType[]) => {
  if (!orderData && !Array.isArray(orderData)) {
    console.log(
      'inside condition combineOrderHistoryTable',
      !orderData,
      Array.isArray(orderData)
    )

    return []
  }

  const processedOrderHistoryData = orderData.map((el: OrderType) => {
    const {
      symbol,
      timestamp,
      type,
      side,
      price,
      status,
      info: { orderId, stopPrice = 0, origQty = 0, executedQty = 0 },
    } = el

    return {
      id: orderId,
      date: moment(timestamp).format('MM-DD-YYYY h:mm:ss A'),
      pair: symbol,
      type: type,
      side: side,
      // TODO: We should change average "price" to average param from backend when it will be ready
      average: { render: price, isNumber: true },
      price: { render: price, isNumber: true },
      filled: { render: executedQty, isNumber: true },
      amount: { render: origQty, isNumber: true },
      // TODO: We should change "total" to total param from backend when it will be ready
      total: { render: price, isNumber: true },
      // TODO: Not sure about triggerConditions
      triggerConditions: { render: stopPrice, isNumber: true },
      status: status,
    }
  })

  return processedOrderHistoryData
}

export const combineTradeHistoryTable = (tradeData: TradeType[]) => {
  if (!tradeData && !Array.isArray(tradeData)) {
    console.log(
      'inside condition combineTradeHistoryTable',
      !tradeData,
      Array.isArray(tradeData)
    )

    return []
  }

  console.log('outside combineTradeHistoryTable')
  console.log('tradeData', tradeData)

  const processedTradeHistoryData = tradeData.map((el: TradeType) => {
    const { id, timestamp, symbol, side, price, amount } = el

    const fee = el.fee ? el.fee : { cost: 0, currency: 'unknown' }
    const { cost, currency } = fee

    return {
      id: id,
      time: moment(timestamp).format('MM-DD-YYYY h:mm:ss A'),
      pair: symbol,
      type: side,
      price: { render: price, isNumber: true },
      filled: { render: amount, isNumber: true },
      fee: { render: `${cost} ${currency}`, isNumber: true },
      // TODO: We should change "total" to total param from backend when it will be ready
      total: { render: 0, isNumber: true },
    }
  })

  return processedTradeHistoryData
}

// TODO: WIP, IN PROGRESS.
// export const combineFundsTable = (fundsData: FundsType[]) => {
//   const processedFundsDaata = fundsData.map((el: FundsType) => {
//     const {} = el
//
//     return {
//       coin: `${String.fromCharCode(getRandomInt(65, 80)) +
//         String.fromCharCode(getRandomInt(65, 80)) +
//         String.fromCharCode(getRandomInt(65, 80))}`,
//       totalBalance: getRandomInt(100, 300000),
//       availableBalance: getRandomInt(100, 3000),
//       inOrder: getRandomInt(1, 100),
//       btcValue: getRandomInt(1, 10000),
//     }
//   })
// }

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
