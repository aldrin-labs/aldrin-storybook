import React from 'react'
import moment from 'moment'
import { OrderType, TradeType, FundsType } from '@core/types/ChartTypes'
import { TableButton } from './TradingTable.styles'
import { ArrowForward as Arrow } from '@material-ui/icons'

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

import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'
import { addMainSymbol } from '@sb/components'

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

export const getFilledQuantity = (
  filledQuantity: number,
  origQuantity: string
): number =>
  filledQuantity === 0 ? filledQuantity : (filledQuantity / +origQuantity) * 100

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
    .map((el: OrderType, i: number) => {
      const {
        keyId,
        symbol,
        timestamp,
        type,
        side,
        price,
        filled,
        info: { orderId, stopPrice = 0, origQty = '0' },
      } = el

      const triggerConditions = +stopPrice ? stopPrice : '-'
      // const filledQuantityProcessed = getFilledQuantity(filled, origQty)
      const pair = symbol.split('/')

      return {
        id: `${orderId}${timestamp}${origQty}`,
        pair: {
          render: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {pair[0]}
              <Arrow
                color={'inherit'}
                style={{ color: '#2F7619', width: '1.5rem' }}
              />
              {pair[1]}
            </div>
          ),
          contentToSort: symbol,
        },
        // type: type,
        side: {
          render: (
            <div>
              <span
                style={{
                  display: 'block',
                  textTransform: 'uppercase',
                  color: side === 'buy' ? '#2F7619' : '#B93B2B',
                }}
              >
                {side}
              </span>
              <span
                style={{
                  textTransform: 'capitalize',
                  color: '#7284A0',
                  letterSpacing: '1px',
                }}
              >
                {type}
              </span>
            </div>
          ),
          style: {
            color: isBuyTypeOrder(side)
              ? theme.customPalette.green.main
              : theme.customPalette.red.main,
          },
        },
        price: {
          render: `${price} ${pair[1]}`,
          style: { textAlign: 'left', whiteSpace: 'nowrap' },
          contentToSort: price,
        },
        quantity: {
          render: (
            <div>
              <span
                style={{
                  color: '#2F7619',
                  fontSize: '1.3rem',
                  display: 'block',
                  whiteSpace: 'nowrap',
                }}
              >{`${+origQty} ${pair[0]}`}</span>
              <span
                style={{ color: '#7284A0', fontSize: '.9rem' }}
              >{`${+origQty} ${pair[0]}`}</span>
            </div>
          ),
          contentToSort: +origQty,
        },
        // filled: {
        //   render: `${filledQuantityProcessed} %`,
        //
        //   contentToSort: filledQuantityProcessed,
        // },
        // TODO: We should change "total" to total param from backend when it will be ready
        total: {
          // render: `${total} ${getCurrentCurrencySymbol(symbol, side)}`,
          render: '-',
          contentToSort: 0,
        },
        // TODO: Not sure about triggerConditions
        triggerConditions: {
          render: triggerConditions,
          contentToSort: +stopPrice,
        },
        date: {
          render: (
            <div>
              <span style={{ display: 'block' }}>
                {String(moment(timestamp).format('DD-MM-YYYY')).replace(
                  /-/g,
                  '.'
                )}
              </span>
              <span style={{ color: '#7284A0' }}>
                {moment(timestamp).format('LT')}
              </span>
            </div>
          ),
          style: { whiteSpace: 'nowrap' },
          contentToSort: timestamp,
        },
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

  const processedOrderHistoryData = orderData.map((el: OrderType, i) => {
    const {
      symbol,
      timestamp,
      type,
      side,
      price,
      status,
      filled,
      average,
      info: { orderId, stopPrice = 0, origQty = '0' },
    } = el

    const triggerConditions = +stopPrice ? stopPrice : '-'
    // const filledQuantityProcessed = getFilledQuantity(filled, origQty)
    const pair = symbol.split('/')

    return {
      id: `${orderId}${timestamp}${origQty}`,
      pair: {
        render: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {pair[0]}
            <Arrow
              color={'inherit'}
              style={{ color: '#2F7619', width: '1.5rem' }}
            />
            {pair[1]}
          </div>
        ),
        contentToSort: symbol,
      },
      // type: type,
      side: {
        render: (
          <div>
            <span
              style={{
                display: 'block',
                textTransform: 'uppercase',
                color: side === 'buy' ? '#2F7619' : '#B93B2B',
              }}
            >
              {side}
            </span>
            <span
              style={{
                textTransform: 'capitalize',
                color: '#7284A0',
                letterSpacing: '1px',
              }}
            >
              {type}
            </span>
          </div>
        ),
        style: {
          color: isBuyTypeOrder(side)
            ? theme.customPalette.green.main
            : theme.customPalette.red.main,
        },
        contentToSort: side,
      },
      // average: {
      //   render: average || '-',
      //
      //   contentToSort: +average,
      // },
      price: {
        render: `${price} ${pair[1]}`,
        style: { textAlign: 'left', whiteSpace: 'nowrap' },
        contentToSort: price,
      },
      // filled: {
      //   render: `${filledQuantityProcessed} %`,
      //
      //   contentToSort: filledQuantityProcessed,
      // },
      quantity: {
        render: (
          <div>
            <span
              style={{
                color: '#2F7619',
                fontSize: '1.3rem',
                display: 'block',
                whiteSpace: 'nowrap',
              }}
            >{`${+origQty} ${pair[0]}`}</span>
            <span style={{ color: '#7284A0', fontSize: '.9rem' }}>{`${+(
              origQty * price
            ).toFixed(8)} ${pair[1]}`}</span>
          </div>
        ),
        contentToSort: +origQty,
      },
      // TODO: We should change "total" to total param from backend when it will be ready
      total: {
        // render: `${total} ${getCurrentCurrencySymbol(symbol, side)}`,
        render: '-',

        contentToSort: 0,
      },
      // TODO: Not sure about triggerConditions
      triggerConditions: {
        render: triggerConditions,

        contentToSort: +stopPrice,
      },
      status: {
        render: status ? (
          <span style={{ color: '#2F7619', textTransform: 'uppercase' }}>
            {status.replace(/_/g, ' ')}
          </span>
        ) : (
          '-'
        ),
        contentToSort: status,
      },
      date: {
        render: (
          <div>
            <span style={{ display: 'block' }}>
              {String(moment(timestamp).format('DD-MM-YYYY')).replace(
                /-/g,
                '.'
              )}
            </span>
            <span style={{ color: '#7284A0' }}>
              {moment(timestamp).format('LT')}
            </span>
          </div>
        ),
        style: { whiteSpace: 'nowrap' },
        contentToSort: timestamp,
      },
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

  const processedTradeHistoryData = tradeData.map((el: TradeType) => {
    const { id, timestamp, symbol, side, price, amount } = el

    const fee = el.fee ? el.fee : { cost: 0, currency: ' ' }
    const { cost, currency } = fee
    const pair = symbol.split('/')

    return {
      id: id,
      pair: {
        render: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {pair[0]}
            <Arrow
              color={'inherit'}
              style={{ color: '#2F7619', width: '1.5rem' }}
            />
            {pair[1]}
          </div>
        ),
        contentToSort: symbol,
      },
      type: {
        render: (
          <div>
            <span
              style={{
                display: 'block',
                textTransform: 'uppercase',
                color: side === 'buy' ? '#2F7619' : '#B93B2B',
              }}
            >
              {side}
            </span>
            {/* <span
              style={{
                textTransform: 'capitalize',
                color: '#7284A0',
                letterSpacing: '1px',
              }}
            >
              {type}
            </span> */}
          </div>
        ),
        contentToSort: side,
      },
      price: {
        render: `${price} ${pair[1]}`,
        style: { textAlign: 'left', whiteSpace: 'nowrap' },
        contentToSort: price,
      },
      quantity: {
        render: (
          <div>
            <span
              style={{
                color: '#2F7619',
                fontSize: '1.3rem',
                display: 'block',
                whiteSpace: 'nowrap',
              }}
            >{`${+amount} ${pair[0]}`}</span>
            <span style={{ color: '#7284A0', fontSize: '.9rem' }}>{`${+(
              amount * price
            ).toFixed(8)} ${pair[1]}`}</span>
          </div>
        ),

        contentToSort: amount,
      },
      // TODO: We should change "total" to total param from backend when it will be ready
      total: {
        // render: `${total} ${getCurrentCurrencySymbol(symbol, side)}`,
        render: '-',

        contentToSort: 0,
      },
      fee: {
        render: `${cost} ${currency}`,

        contentToSort: cost,
      },
      status: {
        render: (
          <span style={{ color: '#2F7619', textTransform: 'uppercase' }}>
            succesful
          </span>
        ),

        contentToSort: 0,
      },
      date: {
        render: (
          <div>
            <span style={{ display: 'block' }}>
              {String(moment(timestamp).format('DD-MM-YYYY')).replace(
                /-/g,
                '.'
              )}
            </span>
            <span style={{ color: '#7284A0' }}>
              {moment(timestamp).format('LT')}
            </span>
          </div>
        ),
        style: { whiteSpace: 'nowrap' },
        contentToSort: timestamp,
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
      asset: { symbol, priceBTC, priceUSD },
    } = el

    const btcValue = addMainSymbol(
      roundAndFormatNumber(quantity * priceBTC, 8, false),
      false
    )

    return {
      id: symbol,
      coin: symbol || 'unknown',
      totalBalance: {
        render:
          addMainSymbol(
            roundAndFormatNumber(quantity * priceUSD, 8, true),
            true
          ) || '-',
        style: { textAlign: 'left' },
        contentToSort: +quantity * priceUSD,
      },
      totalQuantity: {
        render: quantity || '-',
        style: { textAlign: 'left' },
        contentToSort: +quantity,
      },
      availableBalance: {
        render:
          addMainSymbol(roundAndFormatNumber(free * priceUSD, 8, true), true) ||
          '-',
        style: { textAlign: 'left' },
        contentToSort: +free * priceUSD,
      },
      availableQuantity: {
        render: free || '-',
        style: { textAlign: 'left' },
        contentToSort: +free,
      },
      inOrder: {
        render: locked || '-',
        style: { textAlign: 'left' },
        contentToSort: +locked,
      },
      btcValue: {
        render: btcValue || '-',
        style: { textAlign: 'left' },
        contentToSort: quantity * priceBTC,
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
    (el: OrderType) =>
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

  console.log('isEmptySubscription', isEmptySubscription)  
  if (isEmptySubscription) {
    return prev
  }

  const openOrderHasTheSameOrderIndex = prev.getOrderHistory.findIndex(
    (el: OrderType) =>
      el.info.orderId === subscriptionData.data.listenOrderHistory.info.orderId
  )
  const openOrderAlreadyExists = openOrderHasTheSameOrderIndex !== -1

  console.log('openOrderAlreadyExists', openOrderAlreadyExists)
  console.log('subscriptionData.data.listenOrderHistory', subscriptionData.data.listenOrderHistory)
  let result

  if (openOrderAlreadyExists) {
    const oldDataElement = prev.getOrderHistory[openOrderHasTheSameOrderIndex]
    const newDataElement = subscriptionData.data.listenOrderHistory

    if (newDataElement.status !== 'open' && !(newDataElement.status === 'partially_filled' && oldDataElement.status === 'filled')) { // here we handling wrong order of subscribtion events
      prev.getOrderHistory[openOrderHasTheSameOrderIndex] = {
        ...prev.getOrderHistory[openOrderHasTheSameOrderIndex],
        ...subscriptionData.data.listenOrderHistory,
      }
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

  const tradeHasTheSameIndex = prev.getTradeHistory.findIndex(
    (el: TradeType) => el.id === subscriptionData.data.listenTradeHistory.id
  )
  const tradeAlreadyExists = tradeHasTheSameIndex !== -1

  let result

  if (tradeAlreadyExists) {
    prev.getTradeHistory[tradeHasTheSameIndex] = {
      ...prev.getTradeHistory[tradeHasTheSameIndex],
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
