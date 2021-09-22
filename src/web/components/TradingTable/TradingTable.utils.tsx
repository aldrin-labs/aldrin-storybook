import React, { useState } from 'react'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(localizedFormat)

import { Key, OrderType, TradeType } from '@core/types/ChartTypes'
import { StyledTitle, TableButton } from './TradingTable.styles'

import { Loading } from '@sb/components/index'
import stableCoins from '@core/config/stableCoins'
import { cloneDeep } from 'lodash-es'

export const CloseButton = ({
  i,
  onClick,
  showLoader,
}: {
  i: number
  onClick: () => void
  showLoader: boolean
}) => {
  const [isCancelled, cancelOrder] = useState(false)

  return (
    <TableButton
      key={i}
      variant="outlined"
      size={`small`}
      disabled={isCancelled}
      style={{
        color: isCancelled ? 'grey' : '#F69894',
      }}
      onClick={async () => {
        cancelOrder(true)

        try {
          await onClick()
          // await cancelOrder(false)
        } catch (e) {
          cancelOrder(false)
        }
      }}
    >
      {isCancelled || showLoader ? (
        <div>
          <Loading size={16} style={{ height: '16px' }} />
        </div>
      ) : (
        'Cancel'
      )}
    </TableButton>
  )
}

import {
  balancesColumnNames,
  openOrdersColumnNames,
  orderHistoryColumnNames,
  tradeHistoryColumnNames,
  feeTiersColumnNames,
  feeDiscountsColumnNames,
  strategiesHistoryColumnNames,
  fundsBody,
  positionsBody,
  openOrdersBody,
  orderHistoryBody,
  tradeHistoryBody,
} from '@sb/components/TradingTable/TradingTable.mocks'
import { getPrecisionItem } from '@core/utils/getPrecisionItem'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { Theme } from '@sb/types/materialUI'

export const getTableBody = (tab: string) =>
  tab === 'openOrders'
    ? openOrdersBody
    : tab === 'orderHistory'
    ? orderHistoryBody
    : tab === 'tradeHistory'
    ? tradeHistoryBody
    : tab === 'funds'
    ? fundsBody
    : tab === 'positions'
    ? positionsBody
    : []

export const getTableHead = (
  tab: string,
  marketType: number = 0,
  showSettle: boolean = true
): any[] =>
  tab === 'openOrders'
    ? openOrdersColumnNames(marketType)
    : tab === 'orderHistory'
    ? orderHistoryColumnNames(marketType)
    : tab === 'tradeHistory'
    ? tradeHistoryColumnNames(marketType)
    : tab === 'balances'
    ? balancesColumnNames(showSettle)
    : tab === 'feeTiers'
    ? feeTiersColumnNames
    : tab === 'feeDiscounts'
    ? feeDiscountsColumnNames
    : tab === 'strategiesHistory'
    ? strategiesHistoryColumnNames
    : []

export const getStartDate = (stringDate: string): number =>
  stringDate === '1Day'
    ? dayjs()
        .startOf('day')
        .valueOf()
    : stringDate === '1Week'
    ? dayjs()
        .startOf('day')
        .subtract(1, 'week')
        .valueOf()
    : stringDate === '2Weeks'
    ? dayjs()
        .startOf('day')
        .subtract(2, 'week')
        .valueOf()
    : stringDate === '1Month'
    ? dayjs()
        .startOf('day')
        .subtract(1, 'month')
        .valueOf()
    : stringDate === '3Month'
    ? dayjs()
        .startOf('day')
        .subtract(3, 'month')
        .valueOf()
    : dayjs()
        .startOf('day')
        .subtract(6, 'month')
        .valueOf()

export const getEmptyTextPlaceholder = (tab: string): string =>
  tab === 'openOrders'
    ? 'You have no open orders.'
    : tab === 'orderHistory'
    ? 'You have no order history.'
    : tab === 'tradeHistory'
    ? 'You have no trades.'
    : tab === 'balances'
    ? 'You have no Funds.'
    : tab === 'feeTiers'
    ? 'You have no fee tiers'
    : tab === 'feeDiscounts'
    ? 'You have no (M)SRM accounts'
    : tab === 'strategiesHistory'
    ? 'You have no smart trades'
    : 'You have no assets'

export const isBuyTypeOrder = (orderStringType: string): boolean =>
  /buy/gi.test(orderStringType.toLowerCase())

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
  const splittedSymbolPair = symbolPair.split('_')
  const [quote, base] = splittedSymbolPair

  return isBuyTypeOrder(tradeType) ? quote : base
}

export const isDataForThisMarket = (
  marketType: number,
  arrayOfMarketIds: string[],
  elementMarketId: string
) => {
  return marketType === 1
    ? arrayOfMarketIds.includes(elementMarketId)
    : !arrayOfMarketIds.includes(elementMarketId)
}

export const getNumberOfPrecisionDigitsForSymbol = (symbol: string) => {
  return stableCoins.includes(symbol) ? 2 : 8
}

export const getPnlFromState = ({ state, amount, side, leverage }) => {
  if (state && state.entryPrice && state.exitPrice) {
    const profitPercentage =
      ((state.exitPrice / state.entryPrice) * 100 - 100) *
      leverage *
      (side === 'buy' ? 1 : -1)

    const profitAmount =
      (amount / leverage) * state.entryPrice * (profitPercentage / 100)

    return [profitAmount, profitPercentage]
  }

  return [0, 0]
}

type IStatus = {
  state: { state: string }
  profitPercentage: number
}

const getActiveOrderStatus = ({
  theme,
  strategy,
  state,
  profitPercentage,
}: IStatus): [
  'Trailing entry' | 'In Profit' | 'In Loss' | 'Preparing' | 'Timeout',
  string
] => {
  if (strategy.conditions.isTemplate) {
    if (strategy.conditions.templateStatus === 'enabled') {
      return ['Waiting alert', theme.palette.green.main]
    }
    if (strategy.conditions.templateStatus === 'paused') {
      return ['On pause', theme.palette.blue.background]
    }
  }

  if (
    strategy.conditions.hedging &&
    strategy.conditions.hedgeStrategyId === null
  ) {
    return ['Waiting hedge', theme.palette.green.main]
  }

  if (state && state.state && state.state !== 'WaitForEntry') {
    const { state: status } = state

    if (status === 'TrailingEntry') {
      return ['Trailing entry', theme.palette.green.main]
    }

    if (status === 'Timeout') {
      return ['Timeout', theme.palette.green.main]
    }

    // if (status === 'InEntry') {
    //   return ['Active', theme.palette.green.main]
    // }

    if (profitPercentage > 0) {
      return ['In Profit', theme.palette.green.main]
    } else {
      return ['In Loss', theme.palette.red.main]
    }
  } else {
    return ['Preparing', theme.palette.blue.background]
  }
}

export const filterOpenOrders = ({
  order,
  canceledOrders,
}: {
  order: OrderType
  canceledOrders: string[]
}) => {
  const { type = '', status = '', info = { orderId: '' } } = order || {
    type: '',
    status: '',
    info: { orderId: '' },
  }

  const { orderId = '' } = info || { orderId: '' }

  return (
    !canceledOrders.includes(orderId) &&
    // sometimes we don't have order.type, also we want to filter market orders
    (!type || (type && type !== 'market'))
  )
}

export const filterPositions = ({ position, canceledPositions }) => {
  return position.positionAmt !== 0 && !canceledPositions.includes(position._id)
}

export const combineOpenOrdersTable = (
  openOrdersData: OrderType[],
  cancelOrderFunc: (
    keyId: string,
    orderId: string,
    pair: string,
    type: string
  ) => Promise<any>,
  theme: Theme,
  arrayOfMarketIds: string[],
  marketType: 0 | 1,
  canceledOrders: string[],
  keys: Key[],
  handlePairChange: (pair: string) => void
) => {
  if (!openOrdersData && !Array.isArray(openOrdersData)) {
    return []
  }

  const processedOpenOrdersData = openOrdersData
    .filter((el) =>
      filterOpenOrders({
        order: el,
        canceledOrders,
      })
    )
    .map((el: OrderType, i: number) => {
      const {
        orderId = 0,
        size = '',
        side = '',
        price = 0,
        marketName = '',
      } = el || {
        orderId: 0,
        size: 0,
        side: '',
        price: 0,
        marketName: '',
      }
      const orderSymbol = marketName.split('/').join('_') || ''
      const orderSide = side || ''

      // const keyName = keys ? keys[keyId] : ''

      const needOpacity = false
      const pair = orderSymbol.split('_')

      let type = 'limit'
      const isMakerOnlyOrder = type === 'maker-only'

      type = type.toLowerCase().replace(/-/g, '_')

      // const rawStopPrice = (el.info && +el.info.stopPrice) || +el.stopPrice
      // const triggerConditions = +rawStopPrice ? rawStopPrice : '-'
      // const triggerConditionsFormatted =
      //   triggerConditions === '-'
      //     ? '-'
      //     : (!isBuyTypeOrder(orderSide) && type === 'limit') ||
      //       (isBuyTypeOrder(orderSide) && type === 'stop_market') ||
      //       (isBuyTypeOrder(orderSide) && type === 'stop_limit') ||
      //       (isBuyTypeOrder(orderSide) && type === 'stop_loss_limit') ||
      //       (isBuyTypeOrder(orderSide) && type === 'stop') ||
      //       (isBuyTypeOrder(orderSide) && type === 'stop_loss_market') ||
      //       (!isBuyTypeOrder(orderSide) && type === 'take_profit_market') ||
      //       (!isBuyTypeOrder(orderSide) && type === 'take_profit_limit') ||
      //       (!isBuyTypeOrder(orderSide) && type === 'take_profit')
      //       ? `>= ${triggerConditions}`
      //       : `<= ${triggerConditions}`

      const isMarketOrMakerOrder =
        price === 0 && (!!type.match(/market/) || isMakerOnlyOrder)

      const { pricePrecision, quantityPrecision } = getPrecisionItem({
        marketType,
        symbol: marketName,
      })

      return {
        id: `${orderId}${size}${price}`,
        columnForMobile: {
          render: (
            <RowContainer height="20rem" padding={'0 2rem'}>
              <RowContainer style={{ width: '65%' }} direction={'column'}>
                <RowContainer justify={'space-between'}>
                  <StyledTitle color={'#fbf2f2'}>
                    {pair[0]}/{pair[1]}
                  </StyledTitle>
                  <StyledTitle
                    style={{
                      textTransform: 'capitalize',
                      color:
                        side === 'buy'
                          ? theme.palette.green.main
                          : theme.palette.red.main,
                    }}
                  >
                    {side}
                  </StyledTitle>
                </RowContainer>
                <RowContainer justify={'space-between'}>
                  <StyledTitle>Price(USDC)</StyledTitle>{' '}
                  <StyledTitle color={'#fbf2f2'}>{`${stripDigitPlaces(
                    price,
                    pricePrecision
                  )}`}</StyledTitle>
                </RowContainer>
                <RowContainer justify={'space-between'}>
                  <StyledTitle>Amount (CCAI)</StyledTitle>
                  <StyledTitle color={'#fbf2f2'}>
                    {stripDigitPlaces(size, quantityPrecision)}
                  </StyledTitle>
                </RowContainer>
                <RowContainer justify={'space-between'}>
                  <StyledTitle>Total (USDC)</StyledTitle>
                  <StyledTitle color={'#fbf2f2'}>
                    {stripDigitPlaces(size * price, quantityPrecision)}
                  </StyledTitle>
                </RowContainer>
              </RowContainer>
              <RowContainer style={{ width: '35%', padding: '0 0 0 4rem' }}>
                <CloseButton
                  i={i}
                  onClick={() => {
                    cancelOrderFunc(el)
                  }}
                >
                  Cancel
                </CloseButton>
              </RowContainer>
            </RowContainer>
          ),
          showOnMobile: true,
        },
        pair: {
          render: (
            <div
              onClick={() => handlePairChange(orderSymbol)}
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              {pair[0]}/{pair[1]}
            </div>
          ),
          contentToSort: orderSymbol,
          showOnMobile: false,
        },
        // type: type,
        side: {
          render: (
            <div>
              <span
                style={{
                  display: 'block',
                  textTransform: 'uppercase',
                  color: isBuyTypeOrder(orderSide)
                    ? theme.palette.green.main
                    : theme.palette.red.main,
                }}
              >
                {orderSide}
              </span>
              <span
                style={{
                  textTransform: 'capitalize',
                  color: theme.palette.grey.light,
                  letterSpacing: '1px',
                }}
              >
                {'limit'}
              </span>
            </div>
          ),
          style: {
            color: isBuyTypeOrder(orderSide)
              ? theme.customPalette.green.main
              : theme.customPalette.red.main,
            opacity: needOpacity ? 0.75 : 1,
          },
          showOnMobile: false,
        },
        price: {
          render: isMarketOrMakerOrder
            ? 'market'
            : !+price
            ? price
            : `${stripDigitPlaces(price, pricePrecision)} ${pair[1]}`,
          style: {
            textAlign: 'left',
            whiteSpace: 'nowrap',
            opacity: needOpacity ? 0.75 : 1,
          },
          contentToSort: price,
          showOnMobile: false,
        },
        // filled: {
        //   render: `${filledQuantityProcessed} %`,
        //
        //   contentToSort: filledQuantityProcessed,
        // },
        // TODO: We should change "total" to total param from backend when it will be ready
        quantity: {
          render: `${stripDigitPlaces(size, quantityPrecision)} ${pair[0]}`,
          contentToSort: +size,
          style: { opacity: needOpacity ? 0.75 : 1 },
          showOnMobile: false,
        },
        // TODO: We should change "total" to total param from backend when it will be ready
        ...(marketType === 0
          ? {
              amount: {
                // render: `${total} ${getCurrentCurrencySymbol(symbol, side)}`,
                render: !+price
                  ? '-'
                  : `${stripDigitPlaces(+size * price, quantityPrecision)} ${
                      pair[1]
                    }`,
                contentToSort: +size * price,
                style: { opacity: needOpacity ? 0.75 : 1 },
                showOnMobile: false,
              },
            }
          : {}),
        // TODO: Not sure about triggerConditions
        // triggerConditions: {
        //   render: triggerConditionsFormatted,
        //   contentToSort: +rawStopPrice,
        //   style: { opacity: needOpacity ? 0.75 : 1 },
        // },
        // ...(marketType === 1
        //   ? {
        //     reduceOnly: {
        //       // render: `${total} ${getCurrentCurrencySymbol(symbol, side)}`,
        //       render: reduceOnly ? (
        //         <div
        //           style={{
        //             width: '.6rem',
        //             height: '.6rem',
        //             background: theme.palette.blue.background,
        //             borderRadius: '50%',
        //           }}
        //         />
        //       ) : (
        //           '-'
        //         ),
        //       contentToSort: reduceOnly,
        //     },
        //   }
        //   : {}),
        // date: {
        //   render: (
        //     <div>
        //       <span
        //         style={{ display: 'block', color: theme.palette.dark.main }}
        //       >
        //         {String(dayjs(timestamp).format('ll'))}
        //       </span>
        //       <span style={{ color: theme.palette.grey.light }}>
        //         {dayjs(timestamp).format('LT')}
        //       </span>
        //     </div>
        //   ),
        //   style: {
        //     whiteSpace: 'nowrap',
        //     opacity: needOpacity ? 0.75 : 1,
        //     textAlign: 'right',
        //   },
        //   contentToSort: timestamp,
        // },
        cancel: {
          render: needOpacity ? (
            '-'
          ) : (
            <CloseButton
              i={i}
              onClick={() => {
                cancelOrderFunc(el)

                // filterCacheData({
                //   data: null,
                //   name: 'getOpenOrderHistory',
                //   subName: 'orders',
                //   query: getOpenOrderHistory,
                //   variables: {
                //     openOrderInput: {
                //       // activeExchangeKey: keyId,
                //       marketType,
                //     },
                //   },
                //   filterData: (order) => order.info.orderId != orderId,
                // })
              }}
            >
              Cancel
            </CloseButton>
          ),
          showOnMobile: false,
        },
        // tooltipTitle: keyName,
      }
    })

  return processedOpenOrdersData
}

export const combineOrderHistoryTable = (
  orderData: OrderType[],
  theme: Theme,
  arrayOfMarketIds: string[],
  marketType: 0 | 1,
  keys,
  handlePairChange: (pair: string) => void
) => {
  if (!orderData || !orderData) {
    return []
  }

  const processedOrderHistoryData = orderData
    .filter((order) => !!order && order.side)
    .map((el: OrderType, i) => {
      const {
        _id,
        keyId,
        symbol,
        timestamp,
        type: orderType,
        side,
        price = 0,
        reduceOnly,
        status,
        filled,
        average,
        info,
      } = el

      const { pricePrecision, quantityPrecision } = getPrecisionItem({
        marketType,
        symbol,
      })

      // const filledQuantityProcessed = getFilledQuantity(filled, origQty)
      const pair = symbol.split('_')
      const isMakerOnlyOrder = orderType === 'maker-only'
      const type = (orderType || 'type').toLowerCase().replace('-', '_')

      const { orderId = 'id', stopPrice = 0, origQty = '0' } = info
        ? info
        : { orderId: 'id', stopPrice: 0, origQty: 0 }

      const keyName = keys ? keys[keyId] : ''

      const rawStopPrice = (el.info && +el.info.stopPrice) || +el.stopPrice
      const triggerConditions = +rawStopPrice ? rawStopPrice : '-'
      const triggerConditionsFormatted =
        triggerConditions === '-'
          ? '-'
          : (isBuyTypeOrder(side) && type === 'stop_market') ||
            (isBuyTypeOrder(side) && type === 'stop_limit') ||
            (!isBuyTypeOrder(side) && type === 'take_profit_market') ||
            (!isBuyTypeOrder(side) && type === 'take_profit_limit') ||
            (!isBuyTypeOrder(side) && type === 'take_profit')
          ? `>= ${triggerConditions}`
          : `<= ${triggerConditions}`

      const isMarketOrMakerOrder =
        (!!type.match(/market/) && price === 0) || isMakerOnlyOrder

      const qty = !!origQty ? origQty : filled

      return {
        id: `${isMakerOnlyOrder ? _id : orderId}_${timestamp}_${qty}`,
        pair: {
          render: (
            <div
              onClick={() => handlePairChange(symbol)}
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              {pair[0]}/{pair[1]}
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
                  color: isBuyTypeOrder(side)
                    ? theme.palette.green.main
                    : theme.palette.red.main,
                }}
              >
                {side}
              </span>
              <span
                style={{
                  textTransform: 'capitalize',
                  color: theme.palette.grey.light,
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
          render: isMarketOrMakerOrder
            ? !!average
              ? `${stripDigitPlaces(average, pricePrecision)} ${pair[1]}`
              : 'market'
            : `${stripDigitPlaces(price, pricePrecision)} ${pair[1]}`,
          style: { textAlign: 'left', whiteSpace: 'nowrap' },
          contentToSort: price,
        },
        // filled: {
        //   render: `${filledQuantityProcessed} %`,
        //
        //   contentToSort: filledQuantityProcessed,
        // },
        quantity: {
          render: `${stripDigitPlaces(qty, quantityPrecision)} ${pair[0]}`,
          contentToSort: +qty,
        },
        // TODO: We should change "total" to total param from backend when it will be ready
        ...(marketType === 0
          ? {
              amount: {
                // render: `${total} ${getCurrentCurrencySymbol(symbol, side)}`,
                render: `${stripDigitPlaces(
                  isMarketOrMakerOrder ? qty * average : qty * price,
                  quantityPrecision
                )} ${pair[1]}`,
                contentToSort: isMarketOrMakerOrder
                  ? qty * average
                  : qty * price,
              },
            }
          : {}),
        // TODO: Not sure about triggerConditions
        triggerConditions: {
          render: triggerConditionsFormatted,
          contentToSort: +rawStopPrice,
        },
        ...(marketType === 1
          ? {
              reduceOnly: {
                // render: `${total} ${getCurrentCurrencySymbol(symbol, side)}`,
                render: reduceOnly ? (
                  <div
                    style={{
                      width: '.6rem',
                      height: '.6rem',
                      background: theme.palette.blue.background,
                      borderRadius: '50%',
                    }}
                  />
                ) : (
                  '-'
                ),
                contentToSort: reduceOnly,
              },
            }
          : {}),
        status: {
          render: status ? (
            <span
              style={{
                color:
                  status === 'canceled'
                    ? theme.palette.red.main
                    : theme.palette.green.main,
                textTransform: 'uppercase',
              }}
            >
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
              <span
                style={{ display: 'block', color: theme.palette.dark.main }}
              >
                {String(dayjs(timestamp).format('ll'))}
              </span>
              <span style={{ color: theme.palette.grey.light }}>
                {dayjs(timestamp).format('LT')}
              </span>
            </div>
          ),
          style: { whiteSpace: 'nowrap', textAlign: 'right' },
          contentToSort: timestamp,
        },
        tooltipTitle: keyName,
      }
    })

  return processedOrderHistoryData
}

export const combineTradeHistoryTable = (
  tradeData: TradeType[],
  theme: Theme,
  arrayOfMarketIds: string[],
  marketType: 0 | 1,
  keys,
  handlePairChange: (pair: string) => void
) => {
  if (!tradeData && !Array.isArray(tradeData)) {
    return []
  }

  const processedTradeHistoryData = tradeData
    .filter((el) =>
      isDataForThisMarket(marketType, arrayOfMarketIds, el.marketId)
    )
    .map((el: TradeType) => {
      const {
        marketName = '',
        side = '',
        size = 0,
        price = 0,
        orderId = 0,
        liquidity = '',
        feeCost = 0,
      } = el

      const { pricePrecision, quantityPrecision } = getPrecisionItem({
        marketType,
        symbol: marketName,
      })

      const pair = marketName
        .split('/')
        .join('_')
        .split('_')
      // const isSmallProfit = Math.abs(realizedPnl) < 0.01 && realizedPnl !== 0

      return {
        id: `${orderId}_${size}_${price}`,
        columnForMobile: {
          render: (
            <RowContainer
              padding={'0 2rem'}
              direction={'column'}
              height="20rem"
            >
              <RowContainer justify={'space-between'}>
                <StyledTitle color={'#fbf2f2'}>
                  {pair[0]}/{pair[1]}
                </StyledTitle>
                <StyledTitle
                  style={{
                    textTransform: 'capitalize',
                    color:
                      side === 'buy'
                        ? theme.palette.green.main
                        : theme.palette.red.main,
                  }}
                >
                  {side}
                </StyledTitle>
              </RowContainer>
              <RowContainer justify={'space-between'}>
                <StyledTitle>Price(USDC)</StyledTitle>{' '}
                <StyledTitle color={'#fbf2f2'}>{`${stripDigitPlaces(
                  price,
                  pricePrecision
                )}`}</StyledTitle>
              </RowContainer>
              <RowContainer justify={'space-between'}>
                <StyledTitle>Amount (CCAI)</StyledTitle>
                <StyledTitle color={'#fbf2f2'}>
                  {stripDigitPlaces(size, quantityPrecision)}
                </StyledTitle>
              </RowContainer>
              <RowContainer justify={'space-between'}>
                <StyledTitle>Total (USDC)</StyledTitle>
                <StyledTitle color={'#fbf2f2'}>
                  {stripDigitPlaces(size * price, quantityPrecision)}
                </StyledTitle>
              </RowContainer>
            </RowContainer>
          ),
          showOnMobile: true,
        },
        pair: {
          render: (
            <div
              onClick={(e) => {
                handlePairChange(marketName)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              {pair[0]}/{pair[1]}
            </div>
          ),
          contentToSort: marketName,
          showOnMobile: false,
        },
        type: {
          render: (
            <span
              style={{
                display: 'block',
                textTransform: 'uppercase',
                color:
                  side === 'buy'
                    ? theme.palette.green.main
                    : theme.palette.red.main,
              }}
            >
              {side}
            </span>
          ),
          contentToSort: side,
          showOnMobile: false,
        },
        price: {
          render: `${stripDigitPlaces(price, pricePrecision)} ${pair[1]}`,
          style: { textAlign: 'left', whiteSpace: 'nowrap' },
          contentToSort: price,
          showOnMobile: false,
        },
        quantity: {
          render: `${stripDigitPlaces(size, quantityPrecision)} ${pair[0]}`,
          contentToSort: +size,
          showOnMobile: false,
        },
        // TODO: We should change "total" to total param from backend when it will be ready
        ...(marketType === 0
          ? {
              amount: {
                // render: `${total} ${getCurrentCurrencySymbol(symbol, side)}`,
                render: `${stripDigitPlaces(size * price, quantityPrecision)} ${
                  pair[1]
                }`,
                contentToSort: size * price,
                showOnMobile: false,
              },
            }
          : {}),
        // ...(marketType === 1
        //   ? {
        //     realizedPnl: {
        //       render: (
        //         <span
        //           style={{
        //             color:
        //               realizedPnl > 0
        //                 ? theme.palette.green.main
        //                 : realizedPnl < 0
        //                   ? theme.palette.red.main
        //                   : '',
        //           }}
        //         >
        //           {`${isSmallProfit ? '< ' : ''}${typeof realizedPnl === 'number' && realizedPnl < 0
        //             ? '-'
        //             : ''
        //             }${isSmallProfit && realizedPnl !== 0
        //               ? '0.01'
        //               : realizedPnl || realizedPnl === 0
        //                 ? stripDigitPlaces(Math.abs(realizedPnl), 2)
        //                 : '-'
        //             } ${realizedPnl || realizedPnl === 0 ? pair[1] : ''}`}
        //         </span>
        //       ),
        //       contentToSort: realizedPnl,
        //     },
        //   }
        //   : {}),
        liquidity: {
          render: liquidity,
          contentToSort: liquidity,
          showOnMobile: false,
        },
        fee: {
          render: `${stripDigitPlaces(feeCost, quantityPrecision)} ${pair[1]}`,
          contentToSort: feeCost,
          showOnMobile: false,
        },
        // status: {
        //   render: (
        //     <span
        //       style={{
        //         color: theme.palette.green.main,
        //         textTransform: 'uppercase',
        //       }}
        //     >
        //       succesful
        //     </span>
        //   ),

        //   contentToSort: 0,
        // },
        //   date: {
        //     render: (
        //       <div>
        //         <span
        //           style={{ display: 'block', color: theme.palette.dark.main }}
        //         >
        //           {String(dayjs(timestamp).format('ll'))}
        //         </span>
        //         <span style={{ color: theme.palette.grey.light }}>
        //           {dayjs(timestamp).format('LT')}
        //         </span>
        //       </div>
        //     ),
        //     style: { whiteSpace: 'nowrap', textAlign: 'right' },
        //     contentToSort: timestamp,
        //   },
        //   tooltipTitle: keyName,
        // }
      }
    })

  return processedTradeHistoryData
}

export const combineBalancesTable = (
  fundsData: FundsType[],
  onSettleFunds,
  theme,
  showSettle
) => {
  if (!fundsData && !Array.isArray(fundsData)) {
    return []
  }

  const filtredFundsData = fundsData

  const processedFundsData = filtredFundsData.map((el: FundsType) => {
    const {
      marketName,
      coin,
      wallet,
      orders,
      unsettled,
      market,
      openOrders,
    } = el

    return {
      id: `${coin}${wallet}`,
      coin: { render: coin || 'unknown', showOnMobile: false },
      columnForMobile: {
        render: (
          <RowContainer height={'20rem'} padding={'0 2rem'}>
            <RowContainer
              style={{ width: showSettle ? '40%' : '100%' }}
              direction={'column'}
            >
              <RowContainer justify={'flex-start'}>
                <StyledTitle color={'#fbf2f2'}>{coin}</StyledTitle>
              </RowContainer>
              <RowContainer justify={'space-between'}>
                <StyledTitle>Wallet</StyledTitle>
                <StyledTitle color={'#fbf2f2'}>
                  {roundAndFormatNumber(wallet, 8, true) || '-'}
                </StyledTitle>
              </RowContainer>
              <RowContainer justify={'space-between'}>
                <StyledTitle>Unsettled</StyledTitle>
                <StyledTitle color={'#fbf2f2'}>
                  {roundAndFormatNumber(unsettled, 8, true) || '-'}
                </StyledTitle>
              </RowContainer>
            </RowContainer>
            {showSettle ? (
              <RowContainer style={{ width: '60%' }} justify={'flex-end'}>
                <BtnCustom
                  btnWidth={'50%'}
                  height="auto"
                  fontSize="1.6rem"
                  textTransform={'none'}
                  padding=".5rem 1rem .4rem 1rem"
                  borderRadius="1.4rem"
                  btnColor={theme.palette.dark.main}
                  borderColor={theme.palette.blue.serum}
                  backgroundColor={theme.palette.blue.serum}
                  transition={'all .4s ease-out'}
                  margin={'0 0 0 2rem'}
                  onClick={() => onSettleFunds(market, openOrders)}
                >
                  Settle
                </BtnCustom>
              </RowContainer>
            ) : null}
          </RowContainer>
        ),
        showOnMobile: true,
      },
      wallet: {
        render: roundAndFormatNumber(wallet, 8, true) || '-',
        style: { textAlign: 'left' },
        contentToSort: +wallet,
        showOnMobile: false,
      },
      orders: {
        render: roundAndFormatNumber(orders, 8, true) || '-',
        style: { textAlign: 'left' },
        contentToSort: +orders,
        showOnMobile: false,
      },
      unsettled: {
        render: roundAndFormatNumber(unsettled, 8, true) || '-',
        style: { textAlign: 'left' },
        contentToSort: +unsettled,
        showOnMobile: false,
      },
      ...(showSettle
        ? {
            settle: {
              render: (
                <BtnCustom
                  type="text"
                  size="large"
                  onClick={() => onSettleFunds(market, openOrders)}
                  btnColor={theme.palette.blue.serum}
                  btnWidth={'14rem'}
                  height={'100%'}
                >
                  Settle
                </BtnCustom>
              ),
              showOnMobile: false,
            },
          }
        : {}),
    }
  })

  return processedFundsData.filter((el) => !!el)
}

// Update queries functions ->>
// TODO: Make it one function

export const updateActiveStrategiesQuerryFunction = (
  previous,
  { subscriptionData }
) => {
  console.log(
    'updateActiveStrategiesQuerryFunction subscriptionData',
    subscriptionData
  )

  const isEmptySubscription =
    !subscriptionData.data || !subscriptionData.data.listenActiveStrategies

  if (isEmptySubscription) {
    return previous
  }

  const prev = cloneDeep(previous)

  console.log('prev cloneDeep', prev)

  const strategyHasTheSameIndex = prev.getActiveStrategies.strategies.findIndex(
    (el: TradeType) =>
      el._id === subscriptionData.data.listenActiveStrategies._id
  )
  const tradeAlreadyExists = strategyHasTheSameIndex !== -1

  let result

  if (tradeAlreadyExists) {
    prev.getActiveStrategies.strategies[strategyHasTheSameIndex] = {
      ...prev.getActiveStrategies.strategies[strategyHasTheSameIndex],
      ...subscriptionData.data.listenActiveStrategies,
    }

    if (subscriptionData.data.listenActiveStrategies.enabled) {
      result = { ...prev }
    } else {
      result = {
        getActiveStrategies: {
          ...prev.getActiveStrategies,
          // count: prev.getActiveStrategies.count - 1,
        },
      }
    }
  } else {
    prev.getActiveStrategies.strategies = [
      { ...subscriptionData.data.listenActiveStrategies },
      ...prev.getActiveStrategies.strategies,
    ]

    result = {
      getActiveStrategies: {
        ...prev.getActiveStrategies,
        // count: prev.getActiveStrategies.count + 1,
      },
    }
  }

  console.log('result: ', result)
  return result
}

export const updateStrategiesHistoryQuerryFunction = (
  previous,
  { subscriptionData }
) => {
  // console.log(
  //   'updateStrategiesHistoryQuerryFunction subscriptionData',
  //   subscriptionData
  // )

  const isEmptySubscription =
    !subscriptionData.data || !subscriptionData.data.listenActiveStrategies

  if (isEmptySubscription) {
    return previous
  }

  const prev = cloneDeep(previous)

  const strategyHasTheSameIndex = prev.getStrategiesHistory.strategies.findIndex(
    (el: TradeType) =>
      el._id === subscriptionData.data.listenActiveStrategies._id
  )
  const tradeAlreadyExists = strategyHasTheSameIndex !== -1

  let result

  if (tradeAlreadyExists) {
    prev.getStrategiesHistory.strategies[strategyHasTheSameIndex] = {
      ...prev.getStrategiesHistory.strategies[strategyHasTheSameIndex],
      ...subscriptionData.data.listenActiveStrategies,
    }

    result = { ...prev }
  } else {
    prev.getStrategiesHistory.strategies = [
      { ...subscriptionData.data.listenActiveStrategies },
      ...prev.getStrategiesHistory.strategies,
    ]

    result = { ...prev }
  }

  return result
}
