import React, { useState } from 'react'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(localizedFormat)

import { OrderType, TradeType, FundsType, Key } from '@core/types/ChartTypes'
import ErrorIcon from '@material-ui/icons/Error'

import { Position } from './PositionsTable/PositionsTable.types'
import { TableButton, TableCell, TableRow } from './TradingTable.styles'
import { getOpenOrderHistory } from '@core/graphql/queries/chart/getOpenOrderHistory'
import { Metrics } from '@core/utils/metrics'

import {
  filterCacheData,
  modifyCacheData,
} from '@core/utils/TradingTable.utils'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Loading } from '@sb/components/index'
import { cloneDeep } from 'lodash-es'
import { CHANGE_CURRENCY_PAIR } from '@core/graphql/mutations/chart/changeCurrencyPair'
import AdlComponent from './AdlComponent/AdlComponent'

import { getPrecisionItem } from '@core/utils/getPrecisionItem'
import { getStrategyFields } from './ActiveTrades/ActiveTrades.utils'

import MarkPriceBlock from '@sb/components/TradingTable/PriceBlocks/PositionsPriceBlock'

export const activeExchange = { symbol: 'binance' }

export const CloseButton = ({
  i,
  onClick,
}: {
  i: number
  onClick: () => void
}) => {
  const [isCancelled, cancelOrder] = useState(false)

  return (
    <TableButton
      key={i}
      variant="outlined"
      size={`small`}
      disabled={isCancelled}
      style={{
        color: '#fff',
        backgroundColor: isCancelled ? 'grey' : theme.palette.red.main,
        border: 'none',
        margin: '0.5rem auto 0.5rem 0',
        borderRadius: '0.5rem',
        height: '2.7rem',
        fontFamily: 'Avenir Next Demi',
        width: '9rem',
      }}
      onClick={() => {
        onClick()
        cancelOrder(true)
      }}
    >
      {isCancelled ? (
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
  fundsColumnNames,
  openOrdersColumnNames,
  orderHistoryColumnNames,
  tradeHistoryColumnNames,
  positionsColumnNames,
  activeTradesColumnNames,
  strategiesHistoryColumnNames,
  fundsBody,
  positionsBody,
  openOrdersBody,
  orderHistoryBody,
  tradeHistoryBody,
} from '@sb/components/TradingTable/TradingTable.mocks'

import SubRow from './PositionsTable/SubRow'

import { Theme } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import { TRADING_CONFIG } from '@sb/components/TradingTable/TradingTable.config'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { SubColumnValue } from './ActiveTrades/Columns'
import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'
import { addMainSymbol } from '@sb/components'
import TooltipCustom from '../TooltipCustom/TooltipCustom'
import PnlBlock from './PriceBlocks/PositionsPnlBlock'
import { SmartOrder } from './ActiveTrades/ActiveTrades.types'

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

export const getTableHead = ({
  tab,
  marketType = 0,
  refetch,
  updatePositionsHandler,
  positionsRefetchInProcess,
  onCancelAllOrders,
  isDefaultOnlyTables,
  filteredOpenOrders,
  theme,
  enqueueSnackbar,
}: {
  tab: string
  marketType: number
  refetch?: () => void
  updatePositionsHandler?: () => void
  positionsRefetchInProcess?: boolean
  onCancelAllOrders?: () => void
  isDefaultOnlyTables?: boolean
  theme: Theme
}): any[] =>
  tab === 'openOrders'
    ? openOrdersColumnNames(
        marketType,
        onCancelAllOrders,
        filteredOpenOrders,
        theme
      )
    : tab === 'orderHistory'
    ? orderHistoryColumnNames(marketType)
    : tab === 'tradeHistory'
    ? tradeHistoryColumnNames(marketType)
    : tab === 'funds'
    ? fundsColumnNames
    : tab === 'positions'
    ? positionsColumnNames(
        refetch,
        updatePositionsHandler,
        positionsRefetchInProcess,
        isDefaultOnlyTables
      )
    : tab === 'activeTrades'
    ? activeTradesColumnNames
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
    : tab === 'funds'
    ? 'You have no Funds.'
    : tab === 'positions'
    ? 'You have no open positions'
    : tab === 'activeTrades'
    ? 'You don’t have active trades now.'
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

export const filterOpenOrders = ({
  order,
  canceledOrders,
}: {
  order: OrderType
  canceledOrders: string[]
}) => {
  const { type = '', status = '', id, info = { orderId: '' } } = order || {
    type: '',
    status: '',
    info: { orderId: '' },
  }

  const { orderId = '' } = info || { orderId: '' }

  return (
    !canceledOrders.includes(orderId) &&
    // sometimes we don't have order.type, also we want to filter market orders
    (!type || (type && type !== 'market')) &&
    (status === 'open' || status === 'placing') &&
    orderId
  )
}

export const filterPositions = ({ position, canceledPositions }) => {
  return position.positionAmt !== 0 && !canceledPositions.includes(position._id)
}

export const combinePositionsTable = ({
  data,
  createOrderWithStatus,
  theme,
  pair,
  keyId,
  keys,
  isDefaultOnlyTables,
  canceledPositions,
  priceFromOrderbook,
  toogleEditMarginPopup,
  handlePairChange,
  enqueueSnackbar,
  minFuturesStep,
}: // pricePrecision,
// quantityPrecision
{
  data: Position[]
  createOrderWithStatus: (variables: any, positionId: any) => Promise<void>
  theme: Theme
  pair: string
  keyId: string
  canceledPositions: string[]
  minFuturesStep: number
  priceFromOrderbook: number | string
  keys: Key[]
  toogleEditMarginPopup: (position: Position) => void
  handlePairChange: (pair: string) => void
  enqueueSnackbar: (message: string, { variant: string }) => void
  // pricePrecision: number
  // quantityPrecision: number
}) => {
  if (!data && !Array.isArray(data)) {
    return []
  }

  const {
    green,
    red,
  }: { green: { new: string }; red: { new: string } } = theme.palette
  let positions: any = []

  const processedPositionsData = data
    .filter((el) => filterPositions({ position: el, canceledPositions }))
    .map((el: OrderType, i: number) => {
      const {
        symbol,
        entryPrice,
        positionAmt,
        leverage = 1,
        keyId,
        marginType,
        isolatedMargin,
        liquidationPrice,
      } = el

      const { pricePrecision, quantityPrecision } = getPrecisionItem({
        marketType: 1,
        symbol,
      })

      const needOpacity = el._id === '0'

      const keyName = keys[keyId]

      const getVariables = (type: String, price: Number, amount: Number) => {
        const calculatedAmount = Math.abs((positionAmt / 100) * amount)

        const calcAmount =
          amount === 0
            ? Math.abs(positionAmt)
            : calculatedAmount === 0
            ? 0
            : stripDigitPlaces(calculatedAmount, quantityPrecision)

        return {
          keyId: el.keyId,
          keyParams: {
            symbol,
            side: positionAmt < 0 ? 'buy' : 'sell',
            marketType: 1,
            type,
            reduceOnly: true,
            ...(type === 'limit' ? { price, timeInForce: 'GTC' } : {}),
            amount: +calcAmount,
            leverage,
            params: {
              type,
            },
          },
        }
      }

      const side = positionAmt < 0 ? 'sell short' : 'buy long'
      const pair = symbol.split('_')
      return [
        {
          index: {
            render: i + 1,
            rowspan: 1,
            color: theme.palette.grey.light,
          },
          id: el._id,
          pair: {
            render: (
              <div
                onClick={(e) => {
                  handlePairChange(symbol)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                  cursor: 'pointer',
                }}
              >
                <span>
                  {pair[0]}/{pair[1]}
                </span>
                <span
                  style={{
                    display: 'block',
                    textTransform: 'uppercase',
                    color: side === 'buy long' ? green.main : red.main,
                  }}
                >
                  {side}
                </span>
              </div>
            ),
            contentToSort: symbol,
            style: { opacity: needOpacity ? 0.5 : 1 },
          },
          size: {
            render: `${positionAmt} ${pair[0]}`,
            contentToSort: positionAmt,
            style: { opacity: needOpacity ? 0.5 : 1, textAlign: 'right' },
          },
          margin: {
            render: (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  if (marginType === 'isolated') {
                    toogleEditMarginPopup(el)
                  }
                }}
              >
                <span>
                  {marginType === 'isolated'
                    ? stripDigitPlaces(isolatedMargin, 2)
                    : stripDigitPlaces(
                        (positionAmt / leverage) *
                          entryPrice *
                          (side === 'buy long' ? 1 : -1),
                        2
                      )}{' '}
                  {pair[1]}
                </span>
                {marginType === 'isolated' && (
                  <EditIcon
                    style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      marginLeft: '.5rem',
                      fill: theme.palette.blue.main,
                    }}
                  />
                )}
              </div>
            ),
          },
          leverage: {
            render: `X${leverage}`,
            contentToSort: leverage,
            style: { opacity: needOpacity ? 0.5 : 1 },
          },
          entryPrice: {
            render: `${entryPrice} ${pair[1]}`,
            style: {
              textAlign: 'left',
              opacity: needOpacity ? 0.5 : 1,
            },
            contentToSort: entryPrice,
          },
          lastPrice: {
            render: (
              <div>
                <MarkPriceBlock
                  symbol={symbol}
                  exchange={activeExchange}
                  marketType={1}
                  pricePrecision={pricePrecision}
                  theme={theme}
                />{' '}
                {pair[1]}
              </div>
            ),
            style: {
              textAlign: 'left',
              opacity: needOpacity ? 0.5 : 1,
              maxWidth: '70px',
            },
          },
          adl: {
            render: (
              <AdlComponent
                symbol={symbol}
                theme={theme}
                keyId={keyId}
                side={side}
              />
            ),
          },
          liqPrice: {
            render: `${
              liquidationPrice == 0
                ? '-'
                : stripDigitPlaces(liquidationPrice, pricePrecision)
            } ${liquidationPrice == 0 ? '' : pair[1]}`,
            style: {
              textAlign: 'left',
              opacity: needOpacity ? 0.5 : 1,
            },
            contentToSort: liquidationPrice,
          },

          pnlRoe: {
            render: (
              <PnlBlock
                symbol={symbol}
                isDefaultOnlyTables={isDefaultOnlyTables}
                exchange={activeExchange}
                marketType={1}
                pricePrecision={pricePrecision}
                theme={theme}
                pair={pair}
                entryPrice={entryPrice}
                leverage={leverage}
                side={side}
                positionAmt={positionAmt}
              />
            ),
            style: {
              opacity: needOpacity ? 0.5 : 1,
              maxWidth: '100px',
              whiteSpace: 'normal',
            },
            colspan: 2,
          },

          action: {
            render: isDefaultOnlyTables && (
              <div>
                <SubRow
                  theme={theme}
                  positionId={el._id}
                  enqueueSnackbar={enqueueSnackbar}
                  getVariables={getVariables}
                  priceFromOrderbook={priceFromOrderbook}
                  createOrderWithStatus={createOrderWithStatus}
                  minFuturesStep={minFuturesStep}
                />
              </div>
            ),
          },
          ...(isDefaultOnlyTables ? { refetch: '' } : {}),
          tooltipTitle: keyName,
        },
        // show only for basic mode
        ...(!isDefaultOnlyTables
          ? [
              {
                index: {
                  render: (
                    <div>
                      <SubRow
                        theme={theme}
                        positionId={el._id}
                        enqueueSnackbar={enqueueSnackbar}
                        getVariables={getVariables}
                        priceFromOrderbook={priceFromOrderbook}
                        createOrderWithStatus={createOrderWithStatus}
                        minFuturesStep={minFuturesStep}
                      />
                    </div>
                  ),
                  colspan: 12,
                  style: {
                    opacity: needOpacity ? 0.5 : 1,
                    visibility: needOpacity ? 'hidden' : 'visible',
                  },
                },
              },
            ]
          : []),
      ]
    })

  processedPositionsData.forEach((position) => {
    position.forEach((obj) => positions.push(obj))
  })

  return positions
}

export const combineStrategiesHistoryTable = ({
  data,
  theme,
  marketType,
  keys,
  handlePairChange,
}: // pricePrecision,
// quantityPrecision
{
  data: SmartOrder[]
  theme: Theme
  marketType: number
  keys: Key[]
  handlePairChange: any
  // pricePrecision: number
  // quantityPrecision: number
}) => {
  if (!data && !Array.isArray(data)) {
    return []
  }

  const processedStrategiesHistoryData = data
    .filter((el) => el.conditions.marketType === marketType)
    .map((el: SmartOrder, i: number) => {
      const {
        createdAt,
        enabled,
        accountId,
        conditions: {
          pair,
          leverage,
          marketType,
          entryOrder: {
            side,
            orderType,
            amount,
            entryDeviation,
            price,
            activatePrice,
          },
          exitLevels,
          stopLoss,
          isTemplate,
          templatePnl,
          templateStatus,
        } = {
          pair: '-',
          marketType: 0,
          entryOrder: {
            side: '-',
            orderType: '-',
            amount: '-',
          },
          exitLevels: [],
          entryLevels: [],
          stopLoss: '-',
          stopLossType: '-',
          forcedLoss: false,
          trailingExit: false,
          timeoutIfProfitable: '-',
          timeoutWhenLoss: '-',
          timeoutLoss: '-',
          timeoutWhenProfit: '-',
          isTemplate: false,
          templatePnl: 0,
          templateStatus: '-',
        },
      } = el

      const {
        entryPrice,
        exitPrice,
        state,
        msg,
        receivedProfitAmount,
        receivedProfitPercentage,
      } = el.state || {
        entryPrice: 0,
        state: '',
        msg: null,
        exitPrice: 0,
        receivedProfitAmount: 0,
        receivedProfitPercentage: 0,
      }

      const keyName = keys[accountId]

      const pairArr = pair.split('_')
      const needOpacity = el._id === '-1'
      const date = isNaN(dayjs(+createdAt).unix()) ? createdAt : +createdAt
      let orderState = state ? state : enabled ? 'Waiting' : 'Closed'
      let isErrorInOrder = !!msg

      const entryOrderPrice =
        !entryDeviation && orderType === 'limit' && !entryPrice
          ? price
          : entryPrice

      const { pricePrecision, quantityPrecision } = getPrecisionItem({
        marketType,
        symbol: pair,
      })

      const [profitAmount, profitPercentage] = getPnlFromState({
        state: el.state,
        side,
        amount,
        leverage,
      })

      const positionWasPlaced =
        !!state && state !== 'TrailingEntry' && state !== 'WaitForEntry'

      if (isErrorInOrder && profitAmount !== 0) {
        orderState = 'Closed'
        isErrorInOrder = false
      }

      if (isTemplate) {
        if (templateStatus === 'enabled') {
          orderState = 'Waiting alert'
        }
        if (templateStatus === 'disabled') {
          orderState = 'Closed'
        }
        if (templateStatus === 'paused') {
          orderState = 'On pause'
        }
      }

      if (!enabled && positionWasPlaced) {
        orderState = 'Closed'
      }

      if (profitAmount === 0 && !exitPrice && !enabled && !positionWasPlaced) {
        orderState = 'Canceled'
      }

      if (orderState === 'End') orderState = 'Closed'

      if (isTemplate) orderState = 'Template'

      return {
        id: `${el._id}_${accountId}`,
        ...getStrategyFields({
          el,
          theme,
          keyName,
          pairArr,
          pricePrecision,
          entryOrderPrice,
          handlePairChange,
          quantityPrecision,
          isActiveTable: false,
        }),
        profit: {
          render: (
            <SubColumnValue
              theme={theme}
              color={
                receivedProfitPercentage === 0 && !templatePnl
                  ? ''
                  : receivedProfitPercentage > 0 ||
                    (!!templatePnl && templatePnl > 0)
                  ? theme.palette.green.main
                  : theme.palette.red.main
              }
            >
              {!!templatePnl
                ? `${stripDigitPlaces(templatePnl, 3)} ${pairArr[1]}`
                : `${stripDigitPlaces(receivedProfitAmount, 3)} ${
                    pairArr[1]
                  } / ${stripDigitPlaces(receivedProfitPercentage, 2)}%`}
            </SubColumnValue>
          ),
          style: {
            opacity: needOpacity ? 0.6 : 1,
          },
          contentToSort: profitAmount,
        },
        status: {
          render: (
            <SubColumnValue
              theme={theme}
              style={{
                display: 'flex',
                textTransform: 'none',
                alignItems: 'center',
              }}
              color={
                state || isTemplate
                  ? !isErrorInOrder && orderState !== 'Canceled'
                    ? theme.palette.green.main
                    : theme.palette.red.main
                  : theme.palette.red.main
              }
            >
              {isErrorInOrder ? 'Error' : orderState}
              {isErrorInOrder ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <TooltipCustom
                    title={msg}
                    component={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <ErrorIcon
                          style={{
                            height: '1.5rem',
                            width: '1.5rem',
                            color: theme.palette.red.main,
                            marginLeft: '.5rem',
                          }}
                        />{' '}
                      </div>
                    }
                  />
                  <a className={'errorMsg'}>{msg}</a>
                </div>
              ) : null}
            </SubColumnValue>
          ),
          style: {
            opacity: needOpacity ? 0.6 : 1,
          },
          contentToSort: profitPercentage,
        },
        date: {
          render: (
            <div>
              <span
                style={{ display: 'block', color: theme.palette.dark.main }}
              >
                {String(dayjs(date).format('ll'))}
              </span>
              <span style={{ color: theme.palette.grey.light }}>
                {dayjs(date).format('LT')}
              </span>
            </div>
          ),
          style: {
            opacity: needOpacity ? 0.6 : 1,
            textAlign: 'right',
          },
          contentToSort: createdAt ? +new Date(createdAt) : -1,
        },
        tooltipTitle: keyName,
        //   expandableContent: [
        //     {
        //       row: {
        //         render: (
        //           <div style={{ position: 'relative' }}>
        //             <EntryOrderColumn
        //               theme={theme}
        //               haveEdit={false}
        //               enableEdit={!!entryPrice}
        //               entryLevels={entryLevels}
        //               pair={`${pairArr[0]}/${pairArr[1]}`}
        //               side={side}
        //               price={entryOrderPrice}
        //               order={orderType}
        //               amount={amount.toFixed(quantityPrecision)}
        //               total={entryOrderPrice * amount}
        //               trailing={
        //                 entryDeviation
        //                   ? stripDigitPlaces(entryDeviation / leverage, 3)
        //                   : false
        //               }
        //               activatePrice={activatePrice}
        //               red={red.main}
        //               green={green.main}
        //               blue={blue}
        //             />
        //             <TakeProfitColumn
        //               theme={theme}
        //               haveEdit={false}
        //               price={exitLevels.length > 0 && exitLevels[0].price}
        //               order={exitLevels.length > 0 && exitLevels[0].orderType}
        //               targets={exitLevels ? exitLevels : []}
        //               timeoutProfit={timeoutWhenProfit}
        //               timeoutProfitable={timeoutIfProfitable}
        //               trailing={trailingExit}
        //               red={red.main}
        //               green={green.main}
        //               blue={blue}
        //             />
        //             <StopLossColumn
        //               theme={theme}
        //               haveEdit={false}
        //               price={stopLoss}
        //               order={stopLossType}
        //               forced={forcedLoss}
        //               timeoutWhenLoss={timeoutWhenLoss}
        //               timeoutLoss={timeoutLoss}
        //               red={red.main}
        //               green={green.main}
        //               blue={blue}
        //             />
        //           </div>
        //         ),
        //         colspan: 9,
        //       },
        //     },
        //   ],
      }
    })

  return processedStrategiesHistoryData
}

export const combineOpenOrdersTable = ({
  data: openOrdersData,
  cancelOrderFunc,
  theme,
  arrayOfMarketIds,
  marketType,
  canceledOrders,
  keys,
  handlePairChange,
}: // pricePrecision,
// quantityPrecision
{
  data: OrderType[]
  cancelOrderFunc: (
    keyId: string,
    orderId: string,
    pair: string,
    type: string
  ) => Promise<any>
  theme: Theme
  arrayOfMarketIds: string[]
  marketType: 0 | 1
  canceledOrders: string[]
  keys: Key[]
  handlePairChange: (pair: string) => void
  // pricePrecision: number
  // quantityPrecision: number
}) => {
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
        _id = '',
        keyId = '',
        symbol = '',
        type: orderType = '',
        side = '',
        price = 0,
        reduceOnly = false,
        timestamp: orderTimestamp = 0,
        updateTime = 0,
        marketId = '',
        status = '',
        info = { orderId: '', origQty: '', stopPrice: '' },
      } = el || {
        _id: '',
        keyId: '',
        symbol: '',
        type: '',
        side: '',
        price: 0,
        reduceOnly: false,
        timestamp: 0,
        updateTime: 0,
        marketId: '',
        status: '',
        info: { orderId: '', origQty: '', stopPrice: '' },
      }
      const orderSymbol = symbol || ''
      const orderSide = side || ''
      const { orderId = '', origQty = '', stopPrice = '' } = info || {
        orderId: '',
        origQty: '',
        stopPrice: '',
      }

      const { pricePrecision, quantityPrecision } = getPrecisionItem({
        marketType,
        symbol,
      })

      const timestamp = orderTimestamp || updateTime
      const keyName = keys ? keys[keyId] : ''

      const needOpacity = marketId === '0' && status === 'placing'
      const pair = orderSymbol.split('_')

      let type = !!orderType ? orderType : 'type'
      const isMakerOnlyOrder = type === 'maker-only'

      type = type.toLowerCase().replace(/-/g, '_')

      const rawStopPrice = (el.info && +el.info.stopPrice) || +el.stopPrice
      const triggerConditions = +rawStopPrice ? rawStopPrice : '-'
      const triggerConditionsFormatted =
        triggerConditions === '-'
          ? '-'
          : (!isBuyTypeOrder(orderSide) && type === 'limit') ||
            (isBuyTypeOrder(orderSide) && type === 'stop_market') ||
            (isBuyTypeOrder(orderSide) && type === 'stop_limit') ||
            (isBuyTypeOrder(orderSide) && type === 'stop_loss_limit') ||
            (isBuyTypeOrder(orderSide) && type === 'stop') ||
            (isBuyTypeOrder(orderSide) && type === 'stop_loss_market') ||
            (!isBuyTypeOrder(orderSide) && type === 'take_profit_market') ||
            (!isBuyTypeOrder(orderSide) && type === 'take_profit_limit') ||
            (!isBuyTypeOrder(orderSide) && type === 'take_profit')
          ? `>= ${triggerConditions}`
          : `<= ${triggerConditions}`

      const isMarketOrMakerOrder =
        price === 0 && (!!type.match(/market/) || isMakerOnlyOrder)

      return {
        id: `${orderId}_${keyId}${timestamp}${origQty}${marketId}`,
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
                {type}
              </span>
            </div>
          ),
          style: {
            color: isBuyTypeOrder(orderSide)
              ? theme.customPalette.green.main
              : theme.customPalette.red.main,
            opacity: needOpacity ? 0.75 : 1,
          },
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
        },
        // filled: {
        //   render: `${filledQuantityProcessed} %`,
        //
        //   contentToSort: filledQuantityProcessed,
        // },
        // TODO: We should change "total" to total param from backend when it will be ready
        quantity: {
          render: `${stripDigitPlaces(origQty, quantityPrecision)} ${pair[0]}`,
          contentToSort: +origQty,
          style: { opacity: needOpacity ? 0.75 : 1 },
        },
        // TODO: We should change "total" to total param from backend when it will be ready
        ...(marketType === 0
          ? {
              amount: {
                // render: `${total} ${getCurrentCurrencySymbol(symbol, side)}`,
                render: !+price
                  ? '-'
                  : `${stripDigitPlaces(+origQty * price, quantityPrecision)} ${
                      pair[1]
                    }`,
                contentToSort: +origQty * price,
                style: { opacity: needOpacity ? 0.75 : 1 },
              },
            }
          : {}),
        // TODO: Not sure about triggerConditions
        triggerConditions: {
          render: triggerConditionsFormatted,
          contentToSort: +rawStopPrice,
          style: { opacity: needOpacity ? 0.75 : 1 },
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
          style: {
            whiteSpace: 'nowrap',
            opacity: needOpacity ? 0.75 : 1,
            textAlign: 'right',
          },
          contentToSort: timestamp,
        },
        cancelSpace: {
          colspan: 1,
        },
        cancel: {
          render: needOpacity ? (
            '-'
          ) : (
            <CloseButton
              i={i}
              onClick={() => {
                cancelOrderFunc(
                  keyId,
                  orderType === 'maker-only' ? _id : orderId,
                  orderSymbol,
                  orderType
                )
                filterCacheData({
                  data: null,
                  name: 'getOpenOrderHistory',
                  subName: 'orders',
                  query: getOpenOrderHistory,
                  variables: {
                    openOrderInput: {
                      activeExchangeKey: keyId,
                      marketType,
                    },
                  },
                  filterData: (order) => order.info.orderId != orderId,
                })
              }}
            >
              Cancel
            </CloseButton>
          ),
          style: {
            width: '15rem',
          },
        },
        tooltipTitle: keyName,
      }
    })

  return processedOpenOrdersData
}

export const combineOrderHistoryTable = ({
  data: orderData,
  theme,
  marketType,
  keys,
  handlePairChange,
}: // pricePrecision,
// quantityPrecision
{
  data: OrderType[]
  theme: Theme
  marketType: 0 | 1
  keys
  handlePairChange: (pair: string) => void
  // pricePrecision: number
  // quantityPrecision: number
}) => {
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
        id: `${isMakerOnlyOrder ? _id : orderId}_${keyId}_${timestamp}_${qty}`,
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

export const combineTradeHistoryTable = ({
  data: tradeData,
  theme,
  arrayOfMarketIds,
  marketType,
  keys,
  handlePairChange,
}: // pricePrecision,
// quantityPrecision
{
  tradeData: TradeType[]
  theme: Theme
  arrayOfMarketIds: string[]
  marketType: 0 | 1
  keys
  handlePairChange: (pair: string) => void
  // pricePrecision: number
  // quantityPrecision: number
}) => {
  if (!tradeData && !Array.isArray(tradeData)) {
    return []
  }

  const processedTradeHistoryData = tradeData
    .filter((el) =>
      isDataForThisMarket(marketType, arrayOfMarketIds, el.marketId)
    )
    .map((el: TradeType) => {
      const {
        id,
        keyId,
        timestamp,
        symbol,
        side,
        price,
        amount,
        realizedPnl,
      } = el

      const { pricePrecision, quantityPrecision } = getPrecisionItem({
        marketType,
        symbol,
      })

      const keyName = keys ? keys[keyId] : ''

      const fee = el.fee ? el.fee : { cost: 0, currency: ' ' }
      const { cost, currency } = fee
      const pair = symbol.split('_')
      const isSmallProfit = Math.abs(realizedPnl) < 0.01 && realizedPnl !== 0

      return {
        id: `${id}_${keyId}_${timestamp}_${amount}`,
        pair: {
          render: (
            <div
              onClick={(e) => {
                handlePairChange(symbol)
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
          contentToSort: symbol,
        },
        type: {
          render: (
            <div>
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
            </div>
          ),
          contentToSort: side,
        },
        price: {
          render: `${stripDigitPlaces(price, pricePrecision)} ${pair[1]}`,
          style: { textAlign: 'left', whiteSpace: 'nowrap' },
          contentToSort: price,
        },
        quantity: {
          render: `${stripDigitPlaces(amount, quantityPrecision)} ${pair[0]}`,
          contentToSort: +amount,
        },
        // TODO: We should change "total" to total param from backend when it will be ready
        ...(marketType === 0
          ? {
              amount: {
                // render: `${total} ${getCurrentCurrencySymbol(symbol, side)}`,
                render: `${stripDigitPlaces(
                  amount * price,
                  quantityPrecision
                )} ${pair[1]}`,
                contentToSort: amount * price,
              },
            }
          : {}),
        ...(marketType === 1
          ? {
              realizedPnl: {
                render: (
                  <span
                    style={{
                      color:
                        realizedPnl > 0
                          ? theme.palette.green.main
                          : realizedPnl < 0
                          ? theme.palette.red.main
                          : '',
                    }}
                  >
                    {`${isSmallProfit ? '< ' : ''}${
                      typeof realizedPnl === 'number' && realizedPnl < 0
                        ? '-'
                        : ''
                    }${
                      isSmallProfit && realizedPnl !== 0
                        ? '0.01'
                        : realizedPnl || realizedPnl === 0
                        ? stripDigitPlaces(Math.abs(realizedPnl), 2)
                        : '-'
                    } ${realizedPnl || realizedPnl === 0 ? pair[1] : ''}`}
                  </span>
                ),
                contentToSort: realizedPnl,
              },
            }
          : {}),
        fee: {
          render: `${stripDigitPlaces(cost, 8)} ${currency}`,

          contentToSort: cost,
        },
        status: {
          render: (
            <span
              style={{
                color: theme.palette.green.main,
                textTransform: 'uppercase',
              }}
            >
              succesful
            </span>
          ),

          contentToSort: 0,
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

  return processedTradeHistoryData
}

export const combineFundsTable = ({
  data: fundsData,
  hideSmallAssets,
  marketType,
}: {
  data: FundsType[]
  hideSmallAssets: boolean
  marketType: 0 | 1
}) => {
  if (!fundsData && !Array.isArray(fundsData)) {
    return []
  }

  const filtredFundsData = hideSmallAssets
    ? fundsData.filter(
        (el: FundsType) => el.asset.priceBTC >= TRADING_CONFIG.smallAssetAmount
      )
    : fundsData

  const processedFundsData = filtredFundsData
    .filter((el) => el.assetType === marketType || el.asset.symbol === 'BNB')
    .map((el: FundsType) => {
      const {
        quantity,
        locked,
        free,
        asset: { symbol, priceBTC, priceUSD },
      } = el

      if (!quantity || quantity === 0) {
        return
      }

      const btcValue = addMainSymbol(
        roundAndFormatNumber(quantity * priceBTC, 8, false),
        false
      )

      return {
        id: `${symbol}${quantity}`,
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
          render: roundAndFormatNumber(quantity, 8, true) || '-',
          style: { textAlign: 'left' },
          contentToSort: +quantity,
        },
        availableBalance: {
          render:
            addMainSymbol(
              roundAndFormatNumber(free * priceUSD, 8, true),
              true
            ) || '-',
          style: { textAlign: 'left' },
          contentToSort: +free * priceUSD,
        },
        availableQuantity: {
          render: roundAndFormatNumber(free, 8, true) || '-',
          style: { textAlign: 'left' },
          contentToSort: +free,
        },
        inOrder: {
          render: roundAndFormatNumber(locked, 8, true) || '-',
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

export const updateActivePositionsQuerryFunction = (
  previous,
  { subscriptionData }
) => {
  // console.log(
  //   'updateActivePositionsQuerryFunction subscriptionData',
  //   subscriptionData
  // )
  const isEmptySubscription =
    !subscriptionData.data || !subscriptionData.data.listenFuturesPositions

  if (isEmptySubscription) {
    return previous
  }

  // metrics
  const timestamp = Date.now()
  const { positions } = Metrics
  // getting data from order
  const {
    keyId,
    symbol,
    positionSide,
  } = subscriptionData.data.listenFuturesPositions
  const key = `${keyId}_${symbol}_${positionSide}`

  if (positions[key]) {
    const prevTimestamp = positions[key]
    const diff = timestamp - prevTimestamp
    console.log(
      `Collecting metrics data (positions) for key: ${key}, diff time is: ${diff}`
    )
    delete positions[key]

    Metrics.sendMetrics({
      metricName: 'createPosition',
      metricScope: 'Frontend',
      metricTimingData: diff,
    })
  }

  const prev = cloneDeep(previous)

  const positionHasTheSameIndex = prev.getActivePositions.findIndex(
    (el: TradeType) =>
      el._id === subscriptionData.data.listenFuturesPositions._id
  )

  const positionAlreadyExists = positionHasTheSameIndex !== -1

  let result

  if (positionAlreadyExists) {
    prev.getActivePositions[positionHasTheSameIndex] = {
      ...prev.getActivePositions[positionHasTheSameIndex],
      ...subscriptionData.data.listenFuturesPositions,
    }

    result = { ...prev }
  } else {
    prev.getActivePositions = [
      { ...subscriptionData.data.listenFuturesPositions },
      ...prev.getActivePositions,
    ]

    result = { ...prev }
  }

  return result
}

export const updateOpenOrderHistoryQuerryFunction = (
  previous,
  { subscriptionData }
) => {
  const isEmptySubscription =
    !subscriptionData.data || !subscriptionData.data.listenOpenOrders

  if (isEmptySubscription) {
    return previous
  }

  const prev = cloneDeep(previous)

  const openOrderHasTheSameOrder = prev.getOpenOrderHistory.orders.find(
    (el: OrderType) => {
      if (el.info && el.info.orderId) {
        return (
          el.info.orderId ===
          subscriptionData.data.listenOpenOrders.info.orderId
        )
      } else {
        return el._id === subscriptionData.data.listenOpenOrders._id
      }
    }
  )

  const openOrderHasTheSameOrderIndex = prev.getOpenOrderHistory.orders.findIndex(
    (el: OrderType) => {
      if (el.info && el.info.orderId) {
        return (
          el.info.orderId ===
          subscriptionData.data.listenOpenOrders.info.orderId
        )
      } else {
        return el._id === subscriptionData.data.listenOpenOrders._id
      }
    }
  )

  const openOrderAlreadyExists = openOrderHasTheSameOrderIndex !== -1

  let result

  if (openOrderAlreadyExists) {
    prev.getOpenOrderHistory.orders[openOrderHasTheSameOrderIndex] = {
      ...prev.getOpenOrderHistory.orders[openOrderHasTheSameOrderIndex],
      ...subscriptionData.data.listenOpenOrders,
    }

    if (subscriptionData.data.listenOpenOrders.status === 'open') {
      result = { ...prev }
    } else {
      result = {
        getOpenOrderHistory: {
          ...prev.getOpenOrderHistory,
          count:
            openOrderHasTheSameOrder.status === 'open'
              ? prev.getOpenOrderHistory.count - 1
              : prev.getOpenOrderHistory.count,
        },
      }
    }
  } else {
    prev.getOpenOrderHistory = {
      orders: [
        { ...subscriptionData.data.listenOpenOrders },
        ...prev.getOpenOrderHistory.orders,
      ],
      count: prev.getOpenOrderHistory.count + 1,
      __typename: 'getOpenOrderHistory',
    }

    result = { ...prev }
  }

  return result
}

export const updateOrderHistoryQuerryFunction = (
  previous,
  { subscriptionData }
) => {
  // console.log(
  //   'updateOrderHistoryQuerryFunction subscriptionData',
  //   subscriptionData
  // )

  const isEmptySubscription =
    !subscriptionData.data || !subscriptionData.data.listenOrderHistory

  if (isEmptySubscription) {
    return previous
  }

  const prev = cloneDeep(previous)

  const openOrderHasTheSameOrderIndex = prev.getOrderHistory.orders.findIndex(
    (el: OrderType) => {
      if (el.info && el.info.orderId) {
        return (
          el.info.orderId ===
          subscriptionData.data.listenOrderHistory.info.orderId
        )
      } else {
        return el._id === subscriptionData.data.listenOrderHistory._id
      }
    }
  )

  const openOrderAlreadyExists = openOrderHasTheSameOrderIndex !== -1

  let result

  if (openOrderAlreadyExists) {
    const oldDataElement = prev.getOrderHistory[openOrderHasTheSameOrderIndex]
    const newDataElement = subscriptionData.data.listenOrderHistory

    if (
      newDataElement.status !== 'open' &&
      !(
        newDataElement.status === 'partially_filled' &&
        oldDataElement.status === 'filled'
      )
    ) {
      // here we handling wrong order of subscribtion events
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

export const updatePaginatedOrderHistoryQuerryFunction = (
  previous,
  { subscriptionData },
  enqueueSnackbar = (msg: string, obj: { variant: string }) => {}
) => {
  // console.log('updatePaginatedOrderHistoryQuerryFunction subscriptionData', subscriptionData)

  const isEmptySubscription =
    !subscriptionData.data || !subscriptionData.data.listenOrderHistory

  if (isEmptySubscription) {
    return previous
  }

  // metrics
  const timestamp = Date.now()
  const { orders } = Metrics
  // getting data from order
  const { keyId, symbol, side, type } = subscriptionData.data.listenOrderHistory
  const key = `${keyId}_${symbol}_${side.toLowerCase()}_${type.toLowerCase()}`

  if (orders[key]) {
    const prevTimestamp = orders[key]
    const diff = timestamp - prevTimestamp
    console.log(
      `Collecting metrics data (orders) for key: ${key}, diff time is: ${diff}`
    )
    delete orders[key]

    Metrics.sendMetrics({
      metricName: 'createOrder',
      metricScope: 'Frontend',
      metricTimingData: diff,
    })
  }

  const prev = cloneDeep(previous)

  const openOrderHasTheSameOrderIndex = prev.getPaginatedOrderHistory.orders.findIndex(
    (el: OrderType) => {
      if (el.info && el.info.orderId) {
        return (
          el.info.orderId ===
          subscriptionData.data.listenOrderHistory.info.orderId
        )
      } else {
        return el._id === subscriptionData.data.listenOrderHistory._id
      }
    }
  )
  const openOrderAlreadyExists = openOrderHasTheSameOrderIndex !== -1

  let result

  if (openOrderAlreadyExists) {
    const oldDataElement =
      prev.getPaginatedOrderHistory.orders[openOrderHasTheSameOrderIndex]
    const newDataElement = subscriptionData.data.listenOrderHistory

    if (
      oldDataElement.status !== 'filled' &&
      newDataElement.status === 'filled' &&
      newDataElement.type !== 'market'
    ) {
      enqueueSnackbar(
        `${
          newDataElement.type
            ? `${newDataElement.type
                .charAt(0)
                .toUpperCase()}${newDataElement.type.slice(1)} order`
            : 'Order'
        } ${
          newDataElement.type === 'maker-only'
            ? ''
            : `with price ${newDataElement.price}`
        } was executed!`,
        {
          variant: 'success',
        }
      )
    }

    if (
      newDataElement.status !== 'open' &&
      !(
        newDataElement.status === 'partially_filled' &&
        oldDataElement.status === 'filled'
      )
    ) {
      // here we handling wrong order of subscribtion events
      prev.getPaginatedOrderHistory.orders[openOrderHasTheSameOrderIndex] = {
        ...prev.getPaginatedOrderHistory.orders[openOrderHasTheSameOrderIndex],
        ...subscriptionData.data.listenOrderHistory,
      }
    }

    result = { ...prev }
  } else {
    const newDataElement = subscriptionData.data.listenOrderHistory

    prev.getPaginatedOrderHistory.orders = [
      { ...newDataElement },
      ...prev.getPaginatedOrderHistory.orders,
    ]

    if (
      newDataElement.status === 'filled' &&
      newDataElement.type !== 'market'
    ) {
      enqueueSnackbar(
        `${
          newDataElement.type
            ? `${newDataElement.type
                .charAt(0)
                .toUpperCase()}${newDataElement.type.slice(1)} order`
            : 'Order'
        } ${
          newDataElement.type === 'maker-only'
            ? ''
            : `with price ${newDataElement.price}`
        } was executed!`,
        {
          variant: 'success',
        }
      )
    }

    result = { ...prev }
  }

  return result
}

export const updateTradeHistoryQuerryFunction = (
  previous,
  { subscriptionData }
) => {
  // console.log(
  //   'updateTradeHistoryQuerryFunction subscriptionData',
  //   subscriptionData
  // )

  const isEmptySubscription =
    !subscriptionData.data || !subscriptionData.data.listenTradeHistory

  if (isEmptySubscription) {
    return previous
  }

  const prev = cloneDeep(previous)

  const tradeHasTheSameIndex = prev.getTradeHistory.trades.findIndex(
    (el: TradeType) => el.id === subscriptionData.data.listenTradeHistory.id
  )
  const tradeAlreadyExists = tradeHasTheSameIndex !== -1

  let result

  if (tradeAlreadyExists) {
    prev.getTradeHistory.trades[tradeHasTheSameIndex] = {
      ...prev.getTradeHistory.trades[tradeHasTheSameIndex],
      ...subscriptionData.data.listenTradeHistory,
    }

    result = { ...prev }
  } else {
    prev.getTradeHistory.trades = [
      { ...subscriptionData.data.listenTradeHistory },
      ...prev.getTradeHistory.trades,
    ]

    result = { ...prev }
  }

  return result
}
