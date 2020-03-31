import React, { useState } from 'react'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(localizedFormat)

import { OrderType, TradeType, FundsType, Key } from '@core/types/ChartTypes'
import ErrorIcon from '@material-ui/icons/Error'

import { Position } from './PositionsTable/PositionsTable.types'
import { TableButton } from './TradingTable.styles'
import { ArrowForward as Arrow } from '@material-ui/icons'
import { getOpenOrderHistory } from '@core/graphql/queries/chart/getOpenOrderHistory'
import { client } from '@core/graphql/apolloClient'
import { filterCacheData } from '@core/utils/TradingTable.utils'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Loading } from '@sb/components/index'
import stableCoins from '@core/config/stableCoins'
import { cloneDeep } from 'lodash-es'

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
        color: isCancelled ? 'grey' : '#DD6956',
        borderColor: isCancelled ? 'grey' : '#DD6956',
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
import {
  EntryOrderColumn,
  StopLossColumn,
  DateColumn,
  TakeProfitColumn,
} from './ActiveTrades/Columns'

import { Theme } from '@material-ui/core'
import { TRADING_CONFIG } from '@sb/components/TradingTable/TradingTable.config'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { SubColumnValue } from './ActiveTrades/Columns'
import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'
import { addMainSymbol } from '@sb/components'
import TooltipCustom from '../TooltipCustom/TooltipCustom'

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
  refetch?: () => void,
  updatePositionsHandler?: () => void,
  positionsRefetchInProcess?: boolean
): any[] =>
  tab === 'openOrders'
    ? openOrdersColumnNames(marketType)
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
        positionsRefetchInProcess
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
        .subtract(1, 'day')
        .valueOf()
    : stringDate === '1Week'
    ? dayjs()
        .startOf('day')
        .subtract(1, 'week')
        .valueOf()
    : stringDate === '1Month'
    ? dayjs()
        .startOf('day')
        .subtract(1, 'month')
        .valueOf()
    : dayjs()
        .startOf('day')
        .subtract(3, 'month')
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
    ? 'You have no active smart trades'
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
  state,
  profitPercentage,
}: IStatus): [
  'Trailing entry' | 'In Profit' | 'In Loss' | 'Preparing' | 'Timeout',
  string
] => {
  if (state && state.state && state.state !== 'WaitForEntry') {
    const { state: status } = state

    if (status === 'TrailingEntry') {
      return ['Trailing entry', '#29AC80']
    }

    if (status === 'Timeout') {
      return ['Timeout', '#29AC80']
    }

    // if (status === 'InEntry') {
    //   return ['Active', '#29AC80']
    // }

    if (profitPercentage > 0) {
      return ['In Profit', '#29AC80']
    } else {
      return ['In Loss', '#DD6956']
    }
  } else {
    return ['Preparing', '#5C8CEA']
  }
}

export const filterOpenOrders = ({ order, canceledOrders }) => {
  return (
    !canceledOrders.includes(order.info.orderId) &&
    order.type &&
    order.type !== 'market' &&
    (order.status === 'open' ||
      order.status === 'placing' ||
      order.status === 'NEW' ||
      order.status === 'expired')
  )
}

export const filterPositions = ({ position, canceledPositions }) => {
  return position.positionAmt !== 0 && !canceledPositions.includes(position._id)
}

export const combinePositionsTable = ({
  data,
  createOrderWithStatus,
  theme,
  prices,
  pair,
  keyId,
  keys,
  canceledPositions,
  priceFromOrderbook,
  pricePrecision,
  quantityPrecision,
}: {
  data: Position[]
  createOrderWithStatus: (variables: any, positionId: any) => Promise<void>
  theme: Theme
  prices: { price: number; pair: string }[]
  pair: string
  keyId: string
  canceledPositions: string[]
  priceFromOrderbook: number | string
  pricePrecision: number
  quantityPrecision: number
  keys: Key[]
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
    .filter((el) => filterPositions({ position: el, pair, canceledPositions }))
    .map((el: OrderType, i: number) => {
      const { symbol, entryPrice, positionAmt, leverage = 1, keyId } = el
      const needOpacity = el._id === '0'

      const marketPrice = (
        prices.find((price) => price.pair === `${el.symbol}:1:binance`) || {
          price: 0,
        }
      ).price

      const keyName = keys[keyId]

      const getVariables = (type: String, price: Number) => ({
        keyId: el.keyId,
        keyParams: {
          symbol,
          side: positionAmt < 0 ? 'buy' : 'sell',
          marketType: 1,
          type,
          reduceOnly: true,
          ...(type === 'limit' ? { price, timeInForce: 'GTC' } : {}),
          amount: Math.abs(positionAmt),
          leverage,
          params: {
            type,
          },
        },
      })

      const side = positionAmt < 0 ? 'sell short' : 'buy long'
      const liqPrice =
        entryPrice *
        (side === 'sell short'
          ? 1 + 100 / leverage / 100
          : 1 - 100 / leverage / 100)

      const profitPercentage =
        ((marketPrice / entryPrice) * 100 - 100) *
        leverage *
        (side === 'buy long' ? 1 : -1)

      const profitAmount =
        (positionAmt / leverage) *
        entryPrice *
        (profitPercentage / 100) *
        (side === 'buy long' ? 1 : -1)

      const pair = symbol.split('_')

      return [
        {
          index: {
            render: i + 1,
            rowspan: 2,
            color: '#7284A0',
          },
          id: el._id,
          pair: {
            render: (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {pair[0]}/{pair[1]}
              </div>
            ),
            contentToSort: symbol,
            style: { opacity: needOpacity ? 0.5 : 1 },
          },
          // type: type,
          side: {
            render: (
              <div>
                <span
                  style={{
                    display: 'block',
                    textTransform: 'uppercase',
                    color: side === 'buy long' ? green.new : red.new,
                  }}
                >
                  {side}
                </span>
              </div>
            ),
            style: {
              color: side === 'buy long' ? green.new : red.new,
              opacity: needOpacity ? 0.5 : 1,
            },
          },
          size: {
            render: `${positionAmt} ${pair[0]}`,
            contentToSort: positionAmt,
            style: { opacity: needOpacity ? 0.5 : 1 },
          },
          leverage: {
            render: `X${leverage}`,
            contentToSort: leverage,
            style: { opacity: needOpacity ? 0.5 : 1 },
          },
          entryPrice: {
            render: `${stripDigitPlaces(entryPrice, pricePrecision)} ${
              pair[1]
            }`,
            style: {
              textAlign: 'left',
              whiteSpace: 'nowrap',
              opacity: needOpacity ? 0.5 : 1,
            },
            contentToSort: entryPrice,
          },
          marketPrice: {
            render: `${stripDigitPlaces(marketPrice, pricePrecision)} ${
              pair[1]
            }`,
            style: {
              textAlign: 'left',
              whiteSpace: 'nowrap',
              opacity: needOpacity ? 0.5 : 1,
              minWidth: '100px',
            },
            contentToSort: marketPrice,
          },
          liqPrice: {
            render: `${stripDigitPlaces(liqPrice, pricePrecision)} ${pair[1]}`,
            style: {
              textAlign: 'left',
              whiteSpace: 'nowrap',
              opacity: needOpacity ? 0.5 : 1,
            },
            contentToSort: liqPrice,
          },
          profit: {
            render: marketPrice ? (
              <SubColumnValue
                style={{ whiteSpace: 'nowrap' }}
                color={profitPercentage > 0 ? green.new : red.new}
              >
                {profitPercentage && profitAmount
                  ? `${profitAmount < 0 ? '-' : ''}${Math.abs(
                      Number(profitAmount.toFixed(3))
                    )} ${pair[1]} / ${
                      profitPercentage < 0 ? '-' : ''
                    }${Math.abs(Number(profitPercentage.toFixed(2)))}%`
                  : '-'}
              </SubColumnValue>
            ) : (
              `0 ${pair[1]} / 0%`
            ),
            style: { opacity: needOpacity ? 0.5 : 1, minWidth: '150px' },
            colspan: 2,
          },
          tooltipTitle: keyName,
        },
        {
          pair: {
            render: (
              <div>
                <SubRow
                  positionId={el._id}
                  getVariables={getVariables}
                  priceFromOrderbook={priceFromOrderbook}
                  createOrderWithStatus={createOrderWithStatus}
                />
              </div>
            ),
            colspan: 9,
            style: {
              opacity: needOpacity ? 0.5 : 1,
              visibility: needOpacity ? 'hidden' : 'visible',
            },
          },
        },
      ]
    })

  processedPositionsData.forEach((position) => {
    position.forEach((obj) => positions.push(obj))
  })

  return positions
}

// TODO: fix types
export const combineActiveTradesTable = ({
  data,
  cancelOrderFunc,
  editTrade,
  theme,
  prices,
  marketType,
  currencyPair,
  quantityPrecision,
  keys,
}: {
  data: any[]
  cancelOrderFunc: (strategyId: string) => Promise<any>
  editTrade: (block: string, trade: any) => void
  theme: Theme
  prices: { pair: string; price: number }[]
  marketType: number
  currencyPair: string
  quantityPrecision: number
  keys: Key[]
}) => {
  if (!data && !Array.isArray(data)) {
    return []
  }

  const { green, red, blue } = theme.palette

  const processedActiveTradesData = data
    .filter((a) => !!a && a.enabled)
    .sort((a, b) => {
      // sometimes in db we receive createdAt as timestamp
      // so using this we understand type of value that in createdAt field

      const aDate = isNaN(dayjs(+a.createdAt).unix())
        ? a.createdAt
        : +a.createdAt

      const bDate = isNaN(dayjs(+b.createdAt).unix())
        ? b.createdAt
        : +b.createdAt

      // TODO: maybe I'm wrong here with replacing with dayjs
      return dayjs(bDate).valueOf() - dayjs(aDate).valueOf()
    })
    .map((el: OrderType, i: number, arr) => {
      const {
        createdAt,
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
          stopLossType,
          forcedLoss,
          trailingExit,
          timeoutIfProfitable,
          timeoutLoss,
          timeoutWhenLoss,
          timeoutWhenProfit,
        } = {
          pair: '-',
          marketType: 0,
          entryOrder: {
            side: '-',
            orderType: '-',
            amount: '-',
          },
          exitLevels: [],
          stopLoss: '-',
          stopLossType: '-',
          forcedLoss: false,
          trailingExit: false,
          timeoutIfProfitable: '-',
          timeoutLoss: '-',
          timeoutWhenLoss: '-',
          timeoutWhenProfit: '-',
        },
      } = el

      const { entryPrice, state, msg } = el.state || {
        entryPrice: 0,
        state: '-',
        msg: null,
      }

      const pairArr = pair.split('_')
      const needOpacity = el._id === '-1'
      const date = isNaN(dayjs(+createdAt).unix()) ? createdAt : +createdAt
      const currentPrice = (
        prices.find(
          (priceObj) => priceObj.pair === `${pair}:${marketType}:binance`
        ) || { price: 0 }
      ).price

      const keyName = keys[accountId]

      const entryOrderPrice =
        !entryDeviation && orderType === 'limit' && !entryPrice
          ? price
          : entryPrice

      const profitPercentage =
        ((currentPrice / entryOrderPrice) * 100 - 100) *
        leverage *
        (isBuyTypeOrder(side) ? 1 : -1)

      const profitAmount =
        (amount / leverage) * entryOrderPrice * (profitPercentage / 100)

      const [activeOrderStatus, statusColor] = getActiveOrderStatus({
        state: el.state,
        profitPercentage,
      })

      const isErrorInOrder = !!msg

      return {
        id: `${el._id}${i}`,
        pair: {
          render: (
            <SubColumnValue>{`${pairArr[0]}/${pairArr[1]}`}</SubColumnValue>
          ),
          style: {
            opacity: needOpacity ? 0.6 : 1,
          },
        },
        side: {
          render: (
            <SubColumnValue color={side === 'buy' ? green.new : red.new}>
              {marketType === 0
                ? side
                : side === 'buy'
                ? 'buy long'
                : 'sell short'}
            </SubColumnValue>
          ),
          style: {
            opacity: needOpacity ? 0.6 : 1,
          },
          contentToSort: side,
        },
        entryPrice: {
          render: entryOrderPrice ? (
            <SubColumnValue>
              {entryOrderPrice} {pairArr[1]}
            </SubColumnValue>
          ) : (
            '-'
          ),
          style: {
            opacity: needOpacity ? 0.6 : 1,
          },
          contentToSort: entryOrderPrice,
        },
        quantity: {
          render: (
            <SubColumnValue>
              {stripDigitPlaces(
                amount,
                marketType === 0 ? 8 : quantityPrecision
              )}{' '}
              {pairArr[0]}{' '}
            </SubColumnValue>
          ),
          style: {
            opacity: needOpacity ? 0.6 : 1,
          },
          contentToSort: amount,
        },
        takeProfit: {
          render: (
            <SubColumnValue color={green.new}>
              {trailingExit &&
              exitLevels[0] &&
              exitLevels[0].activatePrice &&
              exitLevels[0].entryDeviation
                ? `${exitLevels[0].activatePrice}% / ${
                    exitLevels[0].entryDeviation
                  }%`
                : exitLevels[0] && exitLevels[0].price
                ? `${exitLevels[0].price}%`
                : '-'}
            </SubColumnValue>
          ),
          style: {
            opacity: needOpacity ? 0.6 : 1,
          },
        },
        stopLoss: {
          render: stopLoss ? (
            <SubColumnValue color={red.new}>{stopLoss}%</SubColumnValue>
          ) : (
            '-'
          ),
          style: {
            opacity: needOpacity ? 0.6 : 1,
          },
          contentToSort: stopLoss,
        },
        profit: {
          render:
            state &&
            activeOrderStatus !== 'Preparing' &&
            state !== 'WaitForEntry' &&
            state !== 'TrailingEntry' &&
            !!currentPrice ? (
              <SubColumnValue
                color={profitPercentage > 0 ? green.new : red.new}
              >
                {profitPercentage && profitAmount
                  ? `${profitAmount < 0 ? '-' : ''}${Math.abs(
                      Number(profitAmount.toFixed(3))
                    )} ${pairArr[1]} / ${
                      profitPercentage < 0 ? '-' : ''
                    }${Math.abs(Number(profitPercentage.toFixed(2)))}%`
                  : '-'}
              </SubColumnValue>
            ) : (
              `0 ${pairArr[1]} / 0%`
            ),
          style: {
            opacity: needOpacity ? 0.6 : 1,
            minWidth: '135px',
          },
          contentToSort: profitAmount,
        },
        status: {
          render: (
            <SubColumnValue
              style={{
                textTransform: 'none',
                display: 'flex',
                alignItems: 'center',
              }}
              color={isErrorInOrder ? red.new : statusColor}
            >
              {isErrorInOrder ? 'Error' : activeOrderStatus}
              {isErrorInOrder ? (
                <TooltipCustom
                  title={msg}
                  component={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <ErrorIcon
                        style={{
                          height: '1.5rem',
                          width: '1.5rem',
                          color: red.new,
                          marginLeft: '.5rem',
                        }}
                      />
                    </div>
                  }
                />
              ) : null}
            </SubColumnValue>
          ),
          style: {
            opacity: needOpacity ? 0.6 : 1,
          },
          contentToSort: activeOrderStatus,
        },
        close: {
          render: needOpacity ? (
            ' '
          ) : (
            <BtnCustom
              btnWidth="100%"
              height="auto"
              fontSize=".9rem"
              padding=".2rem 0 .1rem 0"
              borderRadius=".8rem"
              btnColor={'#fff'}
              borderColor={red.new}
              backgroundColor={red.new}
              hoverColor={red.new}
              hoverBackground={'#fff'}
              transition={'all .4s ease-out'}
              onClick={(e) => {
                e.stopPropagation()
                cancelOrderFunc(el._id, el.accountId)
              }}
            >
              {activeOrderStatus === 'Preparing' ||
              activeOrderStatus === 'Trailing entry'
                ? 'cancel'
                : 'market'}
            </BtnCustom>
          ),
        },
        tooltipTitle: keyName,
        expandableContent: [
          {
            row: {
              render: (
                <div style={{ position: 'relative' }}>
                  <EntryOrderColumn
                    haveEdit={true}
                    editTrade={() => editTrade('entryOrder', el)}
                    enableEdit={activeOrderStatus === 'Preparing'}
                    pair={`${pairArr[0]}/${pairArr[1]}`}
                    side={side}
                    price={entryOrderPrice}
                    order={orderType}
                    amount={
                      marketType === 0 ? +amount.toFixed(8) : +amount.toFixed(3)
                    }
                    total={entryOrderPrice * amount}
                    trailing={entryDeviation}
                    activatePrice={activatePrice}
                    red={red.new}
                    green={green.new}
                    blue={blue}
                  />
                  <TakeProfitColumn
                    haveEdit={true}
                    enableEdit={true}
                    editTrade={() => editTrade('takeProfit', el)}
                    price={exitLevels.length > 0 && exitLevels[0].price}
                    order={exitLevels.length > 0 && exitLevels[0].orderType}
                    targets={exitLevels ? exitLevels : []}
                    timeoutProfit={timeoutWhenProfit}
                    timeoutProfitable={timeoutIfProfitable}
                    trailing={trailingExit}
                    red={red.new}
                    green={green.new}
                    blue={blue}
                  />
                  <StopLossColumn
                    haveEdit={true}
                    enableEdit={true}
                    editTrade={() => editTrade('stopLoss', el)}
                    price={stopLoss}
                    order={stopLossType}
                    forced={!!forcedLoss}
                    timeoutWhenLoss={timeoutWhenLoss}
                    timeoutLoss={timeoutLoss}
                    red={red.new}
                    green={green.new}
                    blue={blue}
                  />
                  <DateColumn createdAt={date} />
                </div>
              ),
              colspan: 9,
            },
          },
        ],
      }
    })

  return processedActiveTradesData
}

export const combineStrategiesHistoryTable = (
  data: OrderType[],
  theme: Theme,
  marketType: number,
  keys: Key[]
) => {
  if (!data && !Array.isArray(data)) {
    return []
  }

  const { green, red, blue } = theme.palette

  const processedStrategiesHistoryData = data
    .filter((el) => el.conditions.marketType === marketType)
    .map((el: OrderType, i: number) => {
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
          stopLossType,
          forcedLoss,
          trailingExit,
          timeoutIfProfitable,
          timeoutWhenLoss,
          timeoutLoss,
          timeoutWhenProfit,
        } = {
          pair: '-',
          marketType: 0,
          entryOrder: {
            side: '-',
            orderType: '-',
            amount: '-',
          },
          exitLevels: [],
          stopLoss: '-',
          stopLossType: '-',
          forcedLoss: false,
          trailingExit: false,
          timeoutIfProfitable: '-',
          timeoutWhenLoss: '-',
          timeoutLoss: '-',
          timeoutWhenProfit: '-',
        },
      } = el

      const { entryPrice, exitPrice, state, msg } = el.state || {
        entryPrice: 0,
        state: '',
        msg: null,
        exitPrice: 0,
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
      // ? entryPrice
      // : !!entryDeviation
      // ? activatePrice * (1 + entryDeviation / leverage / 100)
      // : price

      const [profitAmount, profitPercentage] = getPnlFromState({
        state: el.state,
        pair: pairArr,
        side,
        amount,
        leverage,
      })

      if (isErrorInOrder && profitAmount !== 0) {
        orderState = 'Closed'
        isErrorInOrder = false
      }

      if (!enabled && (state !== 'TrailingEntry' && state !== 'WaitForEntry')) {
        orderState = 'Closed'
      }

      if (
        profitAmount === 0 &&
        !exitPrice &&
        !enabled &&
        (!state || state === 'TrailingEntry' || state === 'WaitForEntry')
      ) {
        orderState = 'Canceled'
      }

      if (orderState === 'End') orderState = 'Closed'

      return {
        id: el._id,
        pair: {
          render: (
            <SubColumnValue>{`${pairArr[0]}/${pairArr[1]}`}</SubColumnValue>
          ),
          style: {
            opacity: needOpacity ? 0.6 : 1,
          },
          contentToSort: `${pairArr[0]}/${pairArr[1]}`,
        },
        side: {
          render: (
            <SubColumnValue color={side === 'buy' ? green.new : red.new}>
              {marketType === 0
                ? side
                : side === 'buy'
                ? 'buy long'
                : 'sell short'}
            </SubColumnValue>
          ),
          style: {
            opacity: needOpacity ? 0.6 : 1,
          },
          contentToSort: side,
        },
        entryPrice: {
          render: (
            <SubColumnValue>
              {stripDigitPlaces(
                entryOrderPrice,
                getNumberOfPrecisionDigitsForSymbol(pairArr[1])
              )}{' '}
              {pairArr[1]}
            </SubColumnValue>
          ),
          style: {
            opacity: needOpacity ? 0.6 : 1,
          },
          contentToSort: entryOrderPrice,
        },
        quantity: {
          render: (
            <SubColumnValue>
              {stripDigitPlaces(amount, 8)} {pairArr[0]}{' '}
            </SubColumnValue>
          ),
          style: {
            opacity: needOpacity ? 0.6 : 1,
          },
          contentToSort: amount,
        },
        takeProfit: {
          render: (
            <SubColumnValue color={green.new}>
              {trailingExit &&
              exitLevels[0] &&
              exitLevels[0].activatePrice &&
              exitLevels[0].entryDeviation
                ? `${exitLevels[0].activatePrice}% / ${
                    exitLevels[0].entryDeviation
                  }%`
                : exitLevels[0] && exitLevels[0].price
                ? `${exitLevels[0].price}%`
                : '-'}
            </SubColumnValue>
          ),
          style: {
            opacity: needOpacity ? 0.6 : 1,
          },
        },
        stopLoss: {
          render: stopLoss ? (
            <SubColumnValue color={red.new}>{stopLoss}%</SubColumnValue>
          ) : (
            '-'
          ),
          style: {
            opacity: needOpacity ? 0.6 : 1,
          },
          contentToSort: stopLoss,
        },
        profit: {
          render: (
            <SubColumnValue
              color={
                profitPercentage === 0
                  ? ''
                  : profitPercentage > 0
                  ? green.new
                  : red.new
              }
            >
              {`${stripDigitPlaces(profitAmount, 3)} ${
                pairArr[1]
              } / ${stripDigitPlaces(profitPercentage, 2)}%`}
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
              style={{
                display: 'flex',
                textTransform: 'none',
                alignItems: 'center',
              }}
              color={
                state
                  ? !isErrorInOrder && orderState !== 'Canceled'
                    ? green.new
                    : red.new
                  : red.new
              }
            >
              {isErrorInOrder ? 'Error' : orderState}
              {isErrorInOrder ? (
                <TooltipCustom
                  title={msg}
                  component={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <ErrorIcon
                        style={{
                          height: '1.5rem',
                          width: '1.5rem',
                          color: red.new,
                          marginLeft: '.5rem',
                        }}
                      />
                    </div>
                  }
                />
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
              <span style={{ display: 'block', color: '#16253D' }}>
                {String(dayjs(date).format('ll'))}
              </span>
              <span style={{ color: '#7284A0' }}>
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
        expandableContent: [
          {
            row: {
              render: (
                <div style={{ position: 'relative' }}>
                  <EntryOrderColumn
                    haveEdit={false}
                    enableEdit={!!entryPrice}
                    pair={`${pairArr[0]}/${pairArr[1]}`}
                    side={side}
                    price={entryOrderPrice}
                    order={orderType}
                    amount={
                      marketType === 0 ? +amount.toFixed(8) : +amount.toFixed(3)
                    }
                    total={entryOrderPrice * amount}
                    trailing={entryDeviation}
                    activatePrice={activatePrice}
                    red={red.new}
                    green={green.new}
                    blue={blue}
                  />
                  <TakeProfitColumn
                    haveEdit={false}
                    price={exitLevels.length > 0 && exitLevels[0].price}
                    order={exitLevels.length > 0 && exitLevels[0].orderType}
                    targets={exitLevels ? exitLevels : []}
                    timeoutProfit={timeoutWhenProfit}
                    timeoutProfitable={timeoutIfProfitable}
                    trailing={trailingExit}
                    red={red.new}
                    green={green.new}
                    blue={blue}
                  />
                  <StopLossColumn
                    haveEdit={false}
                    price={stopLoss}
                    order={stopLossType}
                    forced={!!forcedLoss}
                    timeoutWhenLoss={timeoutWhenLoss}
                    timeoutLoss={timeoutLoss}
                    red={red.new}
                    green={green.new}
                    blue={blue}
                  />
                </div>
              ),
              colspan: 9,
            },
          },
        ],
      }
    })

  return processedStrategiesHistoryData
}

export const combineOpenOrdersTable = (
  openOrdersData: OrderType[],
  cancelOrderFunc: (
    keyId: string,
    orderId: string,
    pair: string
  ) => Promise<any>,
  theme: Theme,
  arrayOfMarketIds: string[],
  marketType: number,
  canceledOrders: string[],
  keys: Key[]
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
      const { keyId, symbol, type: orderType, side, price, reduceOnly } = el

      // const filledQuantityProcessed = getFilledQuantity(filled, origQty)
      const orderId = (el.info && el.info.orderId) || el.orderId
      const origQty = (el.info && el.info.origQty) || el.origQty
      const timestamp = el.timestamp || el.updateTime

      const keyName = keys ? keys[keyId] : ''

      const needOpacity = el.marketId === '0'
      const pair = symbol.split('_')
      const type = orderType.toLowerCase().replace(/-/g, '_')

      const rawStopPrice = (el.info && +el.info.stopPrice) || +el.stopPrice
      const triggerConditions = +rawStopPrice ? rawStopPrice : '-'
      const triggerConditionsFormatted =
        triggerConditions === '-'
          ? '-'
          : (!isBuyTypeOrder(side) && type === 'limit') ||
            (isBuyTypeOrder(side) && type === 'stop_market') ||
            (isBuyTypeOrder(side) && type === 'stop_limit') ||
            (isBuyTypeOrder(side) && type === 'stop_loss_limit') ||
            (isBuyTypeOrder(side) && type === 'stop') ||
            (isBuyTypeOrder(side) && type === 'stop_loss_market') ||
            (!isBuyTypeOrder(side) && type === 'take_profit_market') ||
            (!isBuyTypeOrder(side) && type === 'take_profit_limit') ||
            (!isBuyTypeOrder(side) && type === 'take_profit')
          ? `>= ${triggerConditions}`
          : `<= ${triggerConditions}`

      return {
        id: `${orderId}${timestamp}${origQty}${el.marketId}`,
        pair: {
          render: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
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
                  color: isBuyTypeOrder(side) ? '#29AC80' : '#DD6956',
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
            opacity: needOpacity ? 0.75 : 1,
          },
        },
        price: {
          render: !+price ? price : `${stripDigitPlaces(price, 8)} ${pair[1]}`,
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
          render: `${stripDigitPlaces(origQty, 8)} ${pair[0]}`,
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
                  : `${stripDigitPlaces(origQty * price, 8)} ${pair[1]}`,
                contentToSort: origQty * price,
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
                      background: '#5C8CEA',
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
              <span style={{ display: 'block', color: '#16253D' }}>
                {String(dayjs(timestamp).format('ll'))}
              </span>
              <span style={{ color: '#7284A0' }}>
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
        cancel: {
          render: needOpacity ? (
            '-'
          ) : (
            <CloseButton
              i={i}
              onClick={() => {
                cancelOrderFunc(keyId, orderId, symbol)
                filterCacheData({
                  name: 'getOpenOrderHistory',
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
        },
        tooltipTitle: keyName,
      }
    })

  return processedOpenOrdersData
}

export const combineOrderHistoryTable = (
  orderData: OrderType[],
  theme: Theme,
  arrayOfMarketIds: string[],
  marketType: number,
  keys
) => {
  if (!orderData || !orderData) {
    return []
  }

  const processedOrderHistoryData = orderData
    .filter((order) => !!order)
    .map((el: OrderType, i) => {
      const {
        keyId,
        symbol,
        timestamp,
        type: orderType,
        side,
        price,
        reduceOnly,
        status,
        filled,
        average,
        info,
      } = el

      // const filledQuantityProcessed = getFilledQuantity(filled, origQty)
      const pair = symbol.split('_')
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

      return {
        id: `${orderId}_${timestamp}_${origQty}`,
        pair: {
          render: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
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
                  color: isBuyTypeOrder(side) ? '#29AC80' : '#DD6956',
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
          render: `${stripDigitPlaces(price, 8)} ${pair[1]}`,
          style: { textAlign: 'left', whiteSpace: 'nowrap' },
          contentToSort: price,
        },
        // filled: {
        //   render: `${filledQuantityProcessed} %`,
        //
        //   contentToSort: filledQuantityProcessed,
        // },
        quantity: {
          render: `${stripDigitPlaces(origQty, 8)} ${pair[0]}`,
          contentToSort: +origQty,
        },
        // TODO: We should change "total" to total param from backend when it will be ready
        ...(marketType === 0
          ? {
              amount: {
                // render: `${total} ${getCurrentCurrencySymbol(symbol, side)}`,
                render: `${stripDigitPlaces(origQty * price, 8)} ${pair[1]}`,
                contentToSort: origQty * price,
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
                      background: '#5C8CEA',
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
                color: status === 'canceled' ? '#DD6956' : '#29AC80',
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
              <span style={{ display: 'block', color: '#16253D' }}>
                {String(dayjs(timestamp).format('ll'))}
              </span>
              <span style={{ color: '#7284A0' }}>
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
  marketType: number,
  keys
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
        id,
        keyId,
        timestamp,
        symbol,
        side,
        price,
        amount,
        realizedPnl,
      } = el

      const keyName = keys ? keys[keyId] : ''

      const fee = el.fee ? el.fee : { cost: 0, currency: ' ' }
      const { cost, currency } = fee
      const pair = symbol.split('_')
      const isSmallProfit = Math.abs(realizedPnl) < 0.01 && realizedPnl !== 0

      return {
        id: `${id}_${timestamp}_${amount}`,
        pair: {
          render: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
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
                  color: side === 'buy' ? '#29AC80' : '#DD6956',
                }}
              >
                {side}
              </span>
            </div>
          ),
          contentToSort: side,
        },
        price: {
          render: `${stripDigitPlaces(price, 8)} ${pair[1]}`,
          style: { textAlign: 'left', whiteSpace: 'nowrap' },
          contentToSort: price,
        },
        quantity: {
          render: `${stripDigitPlaces(amount, 8)} ${pair[0]}`,
          contentToSort: +amount,
        },
        // TODO: We should change "total" to total param from backend when it will be ready
        ...(marketType === 0
          ? {
              amount: {
                // render: `${total} ${getCurrentCurrencySymbol(symbol, side)}`,
                render: `${stripDigitPlaces(amount * price, 8)} ${pair[1]}`,
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
                          ? '#29AC80'
                          : realizedPnl < 0
                          ? '#DD6956'
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
            <span style={{ color: '#29AC80', textTransform: 'uppercase' }}>
              succesful
            </span>
          ),

          contentToSort: 0,
        },
        date: {
          render: (
            <div>
              <span style={{ display: 'block', color: '#16253D' }}>
                {String(dayjs(timestamp).format('ll'))}
              </span>
              <span style={{ color: '#7284A0' }}>
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

export const combineFundsTable = (
  fundsData: FundsType[],
  hideSmallAssets: boolean,
  marketType: number
) => {
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
  const isEmptySubscription =
    !subscriptionData.data || !subscriptionData.data.listenActiveStrategies

  if (isEmptySubscription) {
    return previous
  }

  const prev = cloneDeep(previous)

  const strategyHasTheSameIndex = prev.getActiveStrategies.findIndex(
    (el: TradeType) =>
      el._id === subscriptionData.data.listenActiveStrategies._id
  )
  const tradeAlreadyExists = strategyHasTheSameIndex !== -1

  let result

  if (tradeAlreadyExists) {
    prev.getActiveStrategies[strategyHasTheSameIndex] = {
      ...prev.getActiveStrategies[strategyHasTheSameIndex],
      ...subscriptionData.data.listenActiveStrategies,
    }

    result = { ...prev }
  } else {
    prev.getActiveStrategies = [
      { ...subscriptionData.data.listenActiveStrategies },
      ...prev.getActiveStrategies,
    ]

    result = { ...prev }
  }

  return result
}

export const updateStrategiesHistoryQuerryFunction = (
  previous,
  { subscriptionData }
) => {
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
  const isEmptySubscription =
    !subscriptionData.data || !subscriptionData.data.listenFuturesPositions

  if (isEmptySubscription) {
    return previous
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

  const openOrderHasTheSameOrderIndex = prev.getOpenOrderHistory.findIndex(
    (el: OrderType) =>
      el.info &&
      String(el.info.orderId) ===
        String(subscriptionData.data.listenOpenOrders.info.orderId)
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
  previous,
  { subscriptionData }
) => {
  const isEmptySubscription =
    !subscriptionData.data || !subscriptionData.data.listenOrderHistory

  if (isEmptySubscription) {
    return previous
  }

  const prev = cloneDeep(previous)

  const openOrderHasTheSameOrderIndex = prev.getOrderHistory.findIndex(
    (el: OrderType) =>
      el.info.orderId === subscriptionData.data.listenOrderHistory.info.orderId
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
  { subscriptionData }
) => {
  const isEmptySubscription =
    !subscriptionData.data || !subscriptionData.data.listenOrderHistory

  if (isEmptySubscription) {
    return previous
  }

  const prev = cloneDeep(previous)

  const openOrderHasTheSameOrderIndex = prev.getPaginatedOrderHistory.orders.findIndex(
    (el: OrderType) =>
      el.info.orderId === subscriptionData.data.listenOrderHistory.info.orderId
  )
  const openOrderAlreadyExists = openOrderHasTheSameOrderIndex !== -1

  let result

  if (openOrderAlreadyExists) {
    const oldDataElement =
      prev.getPaginatedOrderHistory.orders[openOrderHasTheSameOrderIndex]
    const newDataElement = subscriptionData.data.listenOrderHistory

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
    prev.getPaginatedOrderHistory.orders = [
      { ...subscriptionData.data.listenOrderHistory },
      ...prev.getPaginatedOrderHistory.orders,
    ]

    result = { ...prev }
  }

  return result
}

export const updateTradeHistoryQuerryFunction = (
  previous,
  { subscriptionData }
) => {
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
