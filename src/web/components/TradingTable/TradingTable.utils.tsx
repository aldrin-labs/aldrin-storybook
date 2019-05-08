import moment from 'moment'
import { OrderType, TradeType, FundsType } from '@core/types/ChartTypes'
import { TableButton } from './TradingTable.styles'
import {
  fundsColumnNames,
  openOrdersColumnNames,
  orderHistoryColumnNames,
  tradeHistoryColumnNames,
  fundsBody,
  openOrdersBody,
  orderHistoryBody,
  tradeHistoryBody,
} from '@sb/components/TradingTable/TradingTable.mocks'
import { Theme } from '@material-ui/core'
import { TRADING_CONFIG } from '@sb/components/TradingTable/TradingTable.config'

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

export const getTableHead = (tab: string): any[] =>
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

export const getEmptyTextPlaceholder = (tab: string): string =>
  tab === 'openOrders'
    ? 'You have no open orders.'
    : tab === 'orderHistory'
    ? 'You have no order history.'
    : tab === 'tradeHistory'
    ? 'You have no trades.'
    : tab === 'funds'
    ? 'You have no Funds.'
    : 'You have no assets'

export const isBuyTypeOrder = (orderStringType: string): boolean =>
  /buy/i.test(orderStringType)

// order.filled / order.info.origQty

export const getCurrentCurrencySymbol = (
  symbolPair: string,
  tradeType: string
): string => {
  const splittedSymbolPair = symbolPair.split('/')
  const [quote, base] = splittedSymbolPair

  return isBuyTypeOrder(tradeType) ? quote : base
}

export const combineOpenOrdersTable = (
  openOrdersData: OrderType[],
  cancelOrderFunc: (
    keyId: string,
    orderId: string,
    pair: string
  ) => Promise<any>,
  theme: Theme
) => {
  if (!openOrdersData && !Array.isArray(openOrdersData)) {
    return []
  }

  const processedOpenOrdersData = openOrdersData
    .filter((el) => el.status === 'open')
    .sort((a, b) => b.timestamp - a.timestamp)
    .map((el: OrderType, i: number) => {
      const {
        keyId,
        symbol,
        timestamp,
        type,
        side,
        price,
        filled,
        info: { orderId, stopPrice = 0, origQty = 0, executedQty = 0 },
      } = el

      const triggerConditions = +stopPrice ? stopPrice : '-'

      return {
        id: orderId,
        date: {
          render: moment(timestamp).format('MM-DD-YYYY h:mm:ss A'),
          style: { whiteSpace: 'nowrap' },
          contentToSort: timestamp,
        },
        pair: symbol,
        type: type,
        // TODO: fix side
        side: {
          render: side,
          style: {
            color: isBuyTypeOrder(side)
              ? theme.customPalette.green.main
              : theme.customPalette.red.main,
          },
        },
        // TODO: We should change average "price" to average param from backend when it will be ready
        price: { render: price, isNumber: true, contentToSort: price },
        amount: { render: origQty, isNumber: true, contentToSort: origQty },
        filled: {
          render: `${filled} %`,
          isNumber: true,
          contentToSort: filled,
        },
        // TODO: We should change "total" to total param from backend when it will be ready
        total: {
          render: `${price} ${getCurrentCurrencySymbol(symbol, side)}`,
          isNumber: true,
          contentToSort: price,
        },
        // TODO: Not sure about triggerConditions
        triggerConditions: {
          render: triggerConditions,
          isNumber: true,
          contentToSort: +stopPrice,
        },
        // TODO: We should update cancelOrderFunc param
        cancel: {
          render: (
            <TableButton
              key={i}
              variant="outlined"
              size={`small`}
              onClick={() => cancelOrderFunc(keyId, orderId, symbol)}
            >
              Cancel
            </TableButton>
          ),
        },
      }
    })

  return processedOpenOrdersData
}

export const combineOrderHistoryTable = (
  orderData: OrderType[],
  theme: Theme
) => {
  if (!orderData && !Array.isArray(orderData)) {
    return []
  }

  const processedOrderHistoryData = orderData
    .sort((a, b) => b.timestamp - a.timestamp)
    .map((el: OrderType) => {
      const {
        symbol,
        timestamp,
        type,
        side,
        price,
        status,
        filled,
        info: { orderId, stopPrice = 0, origQty = 0, executedQty = 0 },
      } = el

      const triggerConditions = +stopPrice ? stopPrice : '-'

      return {
        id: orderId,
        date: {
          render: moment(timestamp).format('MM-DD-YYYY h:mm:ss A'),
          style: { whiteSpace: 'nowrap' },
          contentToSort: timestamp,
        },
        pair: symbol,
        type: type,
        // TODO: fix side
        side: {
          render: side,
          style: {
            color: isBuyTypeOrder(side)
              ? theme.customPalette.green.main
              : theme.customPalette.red.main,
          },
        },
        // TODO: We should change average "price" to average param from backend when it will be ready
        average: { render: price, isNumber: true, contentToSort: price },
        price: { render: price, isNumber: true, contentToSort: price },
        filled: {
          render: `${filled} %`,
          isNumber: true,
          contentToSort: filled,
        },
        amount: { render: origQty, isNumber: true, contentToSort: origQty },
        // TODO: We should change "total" to total param from backend when it will be ready
        total: {
          render: `${price} ${getCurrentCurrencySymbol(symbol, side)}`,
          isNumber: true,
          contentToSort: price,
        },
        // TODO: Not sure about triggerConditions
        triggerConditions: {
          render: triggerConditions,
          isNumber: true,
          contentToSort: +stopPrice,
        },
        status: status || '-',
      }
    })

  return processedOrderHistoryData
}

export const combineTradeHistoryTable = (
  tradeData: TradeType[],
  theme: Theme
) => {
  if (!tradeData && !Array.isArray(tradeData)) {
    return []
  }

  const processedTradeHistoryData = tradeData
    .sort((a, b) => b.timestamp - a.timestamp)
    .map((el: TradeType) => {
      const { id, timestamp, symbol, side, price, amount } = el

      const fee = el.fee ? el.fee : { cost: 0, currency: 'unknown' }
      const { cost, currency } = fee

      return {
        id: id,
        time: {
          render: moment(timestamp).format('MM-DD-YYYY h:mm:ss A'),
          contentToSort: timestamp,
        },
        pair: symbol,
        type: {
          render: side,
          style: {
            color: isBuyTypeOrder(side)
              ? theme.customPalette.green.main
              : theme.customPalette.red.main,
          },
        },
        price: { render: price, isNumber: true },
        filled: {
          render: `${amount} %`,
          isNumber: true,
          contentToSort: +amount,
        },
        fee: {
          render: `${cost} ${currency}`,
          isNumber: true,
          contentToSort: cost,
        },
        // TODO: We should change "total" to total param from backend when it will be ready
        total: {
          render: `${price} ${getCurrentCurrencySymbol(symbol, side)}`,
          isNumber: true,
          contentToSort: price,
        },
      }
    })

  return processedTradeHistoryData
}

export const combineFundsTable = (
  fundsData: FundsType[],
  hideSmallAssets: boolean
) => {
  const filtredFundsData = hideSmallAssets
    ? fundsData.filter(
        (el: FundsType) => el.asset.priceBTC >= TRADING_CONFIG.smallAssetAmount
      )
    : fundsData

  const processedFundsData = filtredFundsData.map((el: FundsType) => {
    const {
      quantity,
      locked,
      free,
      asset: { symbol, priceBTC },
    } = el

    return {
      id: symbol,
      coin: symbol || 'unknown',
      totalBalance: {
        render: quantity || '-',
        isNumber: true,
        contentToSort: +quantity,
      },
      availableBalance: {
        render: free || '-',
        isNumber: true,
        contentToSort: +free,
      },
      inOrder: {
        render: locked || '-',
        isNumber: true,
        contentToSort: +locked,
      },
      btcValue: {
        render: priceBTC || '-',
        isNumber: true,
        contentToSort: +priceBTC,
      },
    }
  })

  return processedFundsData
}

// Update queries functions ->>
// TODO: Make it one function

export const updateOpenOrderHistoryQuerryFunction = (
  prev,
  { subscriptionData }
) => {
  const isEmptySubscription =
    !subscriptionData.data || !subscriptionData.data.listenOpenOrders

  if (isEmptySubscription) {
    return prev
  }

  const openOrderHasTheSameOrderIndex = prev.getOpenOrderHistory.findIndex(
    (el) =>
      el.info.orderId === subscriptionData.data.listenOpenOrders.info.orderId
  )
  const openOrderAlreadyExists = openOrderHasTheSameOrderIndex !== -1

  let result

  if (openOrderAlreadyExists) {
    prev.getOpenOrderHistory[openOrderHasTheSameOrderIndex] = {
      ...prev.getOpenOrderHistory[openOrderHasTheSameOrderIndex],
      ...subscriptionData.data.listenOpenOrders,
    }

    result = { ...prev }
  } else {
    prev.getOpenOrderHistory = [
      { ...subscriptionData.data.listenOpenOrders },
      ...prev.getOpenOrderHistory,
    ]

    result = { ...prev }
  }

  return result
}

export const updateOrderHistoryQuerryFunction = (
  prev,
  { subscriptionData }
) => {
  const isEmptySubscription =
    !subscriptionData.data || !subscriptionData.data.listenOrderHistory

  if (isEmptySubscription) {
    return prev
  }

  const openOrderHasTheSameOrderIndex = prev.getOrderHistory.findIndex(
    (el) =>
      el.info.orderId === subscriptionData.data.listenOrderHistory.info.orderId
  )
  const openOrderAlreadyExists = openOrderHasTheSameOrderIndex !== -1

  let result

  if (openOrderAlreadyExists) {
    prev.getOrderHistory[openOrderHasTheSameOrderIndex] = {
      ...prev.getOrderHistory[openOrderHasTheSameOrderIndex],
      ...subscriptionData.data.listenOrderHistory,
    }

    result = { ...prev }
  } else {
    prev.getOrderHistory = [
      { ...subscriptionData.data.listenOrderHistory },
      ...prev.getOrderHistory,
    ]

    result = { ...prev }
  }

  return result
}

export const updateTradeHistoryQuerryFunction = (
  prev,
  { subscriptionData }
) => {
  const isEmptySubscription =
    !subscriptionData.data || !subscriptionData.data.listenTradeHistory

  if (isEmptySubscription) {
    return prev
  }

  const openOrderHasTheSameOrderIndex = prev.getTradeHistory.findIndex(
    (el) =>
      el.info.orderId === subscriptionData.data.listenTradeHistory.info.orderId
  )
  const openOrderAlreadyExists = openOrderHasTheSameOrderIndex !== -1

  let result

  if (openOrderAlreadyExists) {
    prev.getTradeHistory[openOrderHasTheSameOrderIndex] = {
      ...prev.getTradeHistory[openOrderHasTheSameOrderIndex],
      ...subscriptionData.data.listenTradeHistory,
    }

    result = { ...prev }
  } else {
    prev.getTradeHistory = [
      { ...subscriptionData.data.listenTradeHistory },
      ...prev.getTradeHistory,
    ]

    result = { ...prev }
  }

  return result
}

export const updateFundsQuerryFunction = (prev, { subscriptionData }) => {
  const isEmptySubscription =
    !subscriptionData.data || !subscriptionData.data.listenFunds

  if (isEmptySubscription) {
    return prev
  }

  const fundHasTheSameIndex = prev.getFunds.findIndex(
    (el) => el.asset.symbol === subscriptionData.data.listenFunds.asset.symbol
  )
  const fundAlreadyExists = fundHasTheSameIndex !== -1

  let result

  if (fundAlreadyExists) {
    prev.getFunds[fundHasTheSameIndex] = {
      ...prev.getFunds[fundHasTheSameIndex],
      ...subscriptionData.data.listenFunds,
    }

    result = { ...prev }
  } else {
    prev.getFunds = [{ ...subscriptionData.data.listenFunds }, ...prev.getFunds]

    result = { ...prev }
  }

  return result
}
