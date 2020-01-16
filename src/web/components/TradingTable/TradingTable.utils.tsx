import React, { useState } from 'react'
import moment from 'moment'
import { OrderType, TradeType, FundsType } from '@core/types/ChartTypes'
import { TableButton } from './TradingTable.styles'
import { ArrowForward as Arrow } from '@material-ui/icons'
import { getOpenOrderHistory } from '@core/graphql/queries/chart/getOpenOrderHistory'
import { client } from '@core/graphql/apolloClient'
import { filterCacheData } from '@core/utils/TradingTable.utils'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Loading } from '@sb/components/index'
import stableCoins from '@core/config/stableCoins'
import { cloneDeep } from 'lodash-es'

const CloseButton = ({ i, onClick }) => {
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
  StatusColumn,
  TakeProfitColumn,
} from './ActiveTrades/Columns'

import { Theme } from '@material-ui/core'
import { TRADING_CONFIG } from '@sb/components/TradingTable/TradingTable.config'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { SubColumnValue } from './ActiveTrades/Columns'
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
    : tab === 'positions'
    ? positionsBody
    : []

export const getTableHead = (tab: string, marketType: number = 0): any[] =>
  tab === 'openOrders'
    ? openOrdersColumnNames(marketType)
    : tab === 'orderHistory'
    ? orderHistoryColumnNames(marketType)
    : tab === 'tradeHistory'
    ? tradeHistoryColumnNames(marketType)
    : tab === 'funds'
    ? fundsColumnNames
    : tab === 'positions'
    ? positionsColumnNames
    : tab === 'activeTrades'
    ? activeTradesColumnNames
    : tab === 'strategiesHistory'
    ? strategiesHistoryColumnNames
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

export const getPnlFromState = ({ state, amount, side, pair, leverage }) => {
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

export const combinePositionsTable = (
  data: OrderType[],
  cancelOrderFunc: (
    keyId: string,
    orderId: string,
    pair: string
  ) => Promise<any>,
  createOrderWithStatus,
  theme: Theme,
  marketPrice: number,
  pair: string,
  keyId: string
) => {
  if (!data && !Array.isArray(data)) {
    return []
  }

  const { green, red } = theme.palette
  let positions = []

  const processedPositionsData = data
    .filter((el) => el.positionAmt !== 0)
    .filter((el) => el.symbol === pair)
    .map((el: OrderType, i: number) => {
      const { symbol, entryPrice, positionAmt, leverage = 1 } = el
      const needOpacity = el._id === '0'

      const getVariables = (type: String, price: Number) => ({
        keyId,
        keyParams: {
          symbol,
          side: positionAmt < 0 ? 'buy' : 'sell',
          marketType: 1,
          type,
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
        ((marketPrice / entryPrice) * 100 - 100) * leverage * (side === 'buy long' ? 1 : -1)

      const profitAmount =
        (positionAmt / leverage) * entryPrice * (profitPercentage / 100)

      const pair = symbol.split('_')

      return [
        {
          index: {
            render: i + 1,
            rowspan: 2,
            color: '#7284A0',
          },
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
            render: `${stripDigitPlaces(entryPrice, 2)} ${pair[1]}`,
            style: {
              textAlign: 'left',
              whiteSpace: 'nowrap',
              opacity: needOpacity ? 0.5 : 1,
            },
            contentToSort: entryPrice,
          },
          marketPrice: {
            render: `${stripDigitPlaces(marketPrice, 2)} ${pair[1]}`,
            style: {
              textAlign: 'left',
              whiteSpace: 'nowrap',
              opacity: needOpacity ? 0.5 : 1,
            },
            contentToSort: marketPrice,
          },
          liqPrice: {
            render: `${stripDigitPlaces(liqPrice, 2)} ${pair[1]}`,
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
                style={{ whiteSpace: 'normal' }}
                color={
                  profitPercentage > 0 && side === 'buy long'
                    ? green.new
                    : red.new
                }
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
            style: { opacity: needOpacity ? 0.5 : 1, whiteSpace: 'nowrap' },
          },
        },
        {
          pair: {
            render: (
              <div>
                <SubRow
                  getVariables={getVariables}
                  createOrderWithStatus={createOrderWithStatus}
                />
              </div>
            ),
            colspan: 8,
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

const getStatusFromState = (
  state: 'End' | 'WaitForEntry' | 'Cancel' | string
) => {
  if (state === 'End') {
    return ['Closed', '#DD6956']
  } else if (state === 'Cancel') {
    return ['Canceled', '#DD6956']
  } else if (state === 'WaitForEntry' || state === '-') {
    return ['Waiting', '#5C8CEA']
  } else {
    return [state, '#29AC80']
  }
}

// TODO: fix types
export const combineActiveTradesTable = (
  data: OrderType[],
  cancelOrderFunc: (strategyId: string) => Promise<any>,
  editTrade: (block: string, trade: any) => void,
  theme: Theme,
  currentPrice: number,
  marketType: number
) => {
  if (!data && !Array.isArray(data)) {
    return []
  }

  const { green, red, blue } = theme.palette

  const processedActiveTradesData = data
    .filter((el) => el.conditions.marketType === marketType)
    .filter((el) => el.enabled)
    .map((el: OrderType, i: number) => {
      const {
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
          timeoutLossable,
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
          timeoutLossable: '-',
          timeoutWhenProfit: '-',
        },
      } = el

      const { entryPrice, state } = el.state || {
        entryPrice: 0,
        state: '-',
      }

      // console.log('order', el)

      // const filledQuantityProcessed = getFilledQuantity(filled, origQty)

      const pairArr = pair.split('_')
      const status = getStatusFromState(state)
      const needOpacity = el._id === '-1'

      const entryOrderPrice = !!entryPrice
        ? entryPrice
        : !!entryDeviation
        ? // ? activatePrice + (activatePrice / 100) * entryDeviation
          activatePrice * (1 + entryDeviation / leverage / 100)
        : price

      const profitPercentage =
        ((currentPrice / entryOrderPrice) * 100 - 100) * leverage

      const profitAmount =
        (amount / leverage) * entryOrderPrice * (profitPercentage / 100)

      return {
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
        },
        quantity: {
          render: (
            <SubColumnValue>
              {amount} {pairArr[0]}{' '}
            </SubColumnValue>
          ),
          style: {
            opacity: needOpacity ? 0.6 : 1,
          },
        },
        takeProfit: {
          render: (
            <SubColumnValue color={green.new}>
              {trailingExit &&
              exitLevels[0] &&
              exitLevels[0].activatePrice &&
              exitLevels[0].entryDeviation
                ? `${exitLevels[0].activatePrice} / ${
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
        },
        profit: {
          render:
            entryPrice && currentPrice ? (
              <SubColumnValue
                color={
                  profitPercentage > 0 && side === 'buy' ? green.new : red.new
                }
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
          },
        },
        status: {
          render: (
            <SubColumnValue style={{ textTransform: 'none' }} color={status[1]}>
              {!!status[0] ? status[0] : 'Waiting'}
            </SubColumnValue>
          ),
          style: {
            opacity: needOpacity ? 0.6 : 1,
          },
        },
        close: {
          render: (
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
              onClick={() => cancelOrderFunc(el._id)}
            >
              {status[0] === 'Waiting' ? 'cancel' : 'market'}
            </BtnCustom>
          ),
          style: {
            opacity: needOpacity ? 0 : 1,
          },
        },
        expandableContent: [
          {
            row: {
              render: (
                <>
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
                    trailing={!entryPrice && entryDeviation}
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
                    timeoutLoss={timeoutLoss}
                    trailing={false}
                    timeoutLossable={timeoutLossable}
                    red={red.new}
                    green={green.new}
                    blue={blue}
                  />
                </>
              ),
              colspan: 8,
            },
          },
        ],
      }
    })

  return processedActiveTradesData
}

export const combineStrategiesHistoryTable = (
  data: OrderType[],
  theme,
  marketType: number
) => {
  if (!data && !Array.isArray(data)) {
    return []
  }

  const { green, red, blue } = theme.palette

  const processedStrategiesHistoryData = data
    .filter((el) => el.conditions.marketType === marketType)
    .map((el: OrderType, i: number) => {
      const {
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
          timeoutLossable,
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
          timeoutLossable: '-',
          timeoutWhenProfit: '-',
        },
      } = el

      const { entryPrice, state } = el.state || {
        entryPrice: 0,
        state: '-',
      }

      // console.log('order', el)

      // const filledQuantityProcessed = getFilledQuantity(filled, origQty)

      const pairArr = pair.split('_')
      const needOpacity = el._id === '-1'
      const editTrade = () => {}

      const entryOrderPrice = !!entryPrice
        ? entryPrice
        : !!entryDeviation
        ? activatePrice * (1 + entryDeviation / leverage / 100)
        : price

      const [profitAmount, profitPercentage] = getPnlFromState({
        state,
        pair: pairArr,
        side,
        amount,
        leverage,
      })

      return {
        id: el._id,
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
        },
        quantity: {
          render: (
            <SubColumnValue>
              {amount} {pairArr[0]}{' '}
            </SubColumnValue>
          ),
          style: {
            opacity: needOpacity ? 0.6 : 1,
          },
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
        },
        profit: {
          render: (
            <SubColumnValue
              color={
                profitPercentage === 0
                  ? ''
                  : profitPercentage > 0 && side === 'buy'
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
        },
        status: {
          render: (
            <SubColumnValue color={profitPercentage > 0 ? green.new : red.new}>
              {profitPercentage === 0
                ? 'Canceled'
                : profitPercentage > 0
                ? 'finished by t-a-p'
                : 'closed by stop-loss'}
            </SubColumnValue>
          ),
          style: {
            opacity: needOpacity ? 0.6 : 1,
          },
        },
        expandableContent: [
          {
            row: {
              render: (
                <>
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
                    trailing={!entryPrice && entryDeviation}
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
                    timeoutLoss={timeoutLoss}
                    trailing={false}
                    timeoutLossable={timeoutLossable}
                    red={red.new}
                    green={green.new}
                    blue={blue}
                  />
                </>
              ),
              colspan: 8,
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
  marketType: number
) => {
  if (!openOrdersData && !Array.isArray(openOrdersData)) {
    return []
  }

  const processedOpenOrdersData = openOrdersData
    .filter(
      (el) =>
        ((el.status === 'open' ||
          el.status === 'placing' ||
          el.status === 'NEW') &&
          isDataForThisMarket(marketType, arrayOfMarketIds, el.marketId)) ||
        (el.marketId === '0' && el.symbol)
    )
    .map((el: OrderType, i: number) => {
      const { keyId, symbol, type: orderType, side, price } = el

      // const filledQuantityProcessed = getFilledQuantity(filled, origQty)
      const orderId = (el.info && el.info.orderId) || el.orderId
      const origQty = (el.info && el.info.origQty) || el.origQty
      const timestamp = el.timestamp || el.updateTime

      const needOpacity = el.status === 'placing'
      const pair = symbol.split('_')
      const type = orderType.toLowerCase().replace('-', '_')

      const rawStopPrice = (el.info && +el.info.stopPrice) || +el.stopPrice
      const triggerConditions = +rawStopPrice ? rawStopPrice : '-'
      const triggerConditionsFormatted =
        triggerConditions === '-'
          ? '-'
          : (!isBuyTypeOrder(side) && type === 'limit') ||
            (isBuyTypeOrder(side) && type === 'stop_market') ||
            (isBuyTypeOrder(side) && type === 'stop_limit') ||
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
          style: { whiteSpace: 'nowrap', opacity: needOpacity ? 0.75 : 1 },
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
      }
    })

  return processedOpenOrdersData
}

export const combineOrderHistoryTable = (
  orderData: OrderType[],
  theme: Theme,
  arrayOfMarketIds: string[],
  marketType: number
) => {
  if (!orderData && !Array.isArray(orderData)) {
    return []
  }

  const processedOrderHistoryData = orderData
    .filter((el) =>
      isDataForThisMarket(marketType, arrayOfMarketIds, el.marketId)
    )
    .map((el: OrderType, i) => {
      const {
        symbol,
        timestamp,
        type: orderType,
        side,
        price,
        status,
        filled,
        average,
        info,
      } = el

      // const filledQuantityProcessed = getFilledQuantity(filled, origQty)
      const pair = symbol.split('_')
      const type = orderType.toLowerCase().replace('-', '_')

      const { orderId = 'id', stopPrice = 0, origQty = '0' } = info
        ? info
        : { orderId: 'id', stopPrice: 0, origQty: 0 }

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
        id: `${orderId}${timestamp}${origQty}`,
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
                  color: side === 'buy' ? '#29AC80' : '#DD6956',
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
  theme: Theme,
  arrayOfMarketIds: string[],
  marketType: number
) => {
  if (!tradeData && !Array.isArray(tradeData)) {
    return []
  }

  const processedTradeHistoryData = tradeData
    .filter((el) =>
      isDataForThisMarket(marketType, arrayOfMarketIds, el.marketId)
    )
    .map((el: TradeType) => {
      const { id, timestamp, symbol, side, price, amount, realizedPnl } = el

      const fee = el.fee ? el.fee : { cost: 0, currency: ' ' }
      const { cost, currency } = fee
      const pair = symbol.split('_')

      return {
        id: id,
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
                    {`${
                      typeof realizedPnl === 'number' && realizedPnl < 0
                        ? '-'
                        : ''
                    }${
                      realizedPnl || realizedPnl === 0
                        ? stripDigitPlaces(realizedPnl, 8)
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
      el.symbol === subscriptionData.data.listenFuturesPositions.symbol
  )

  console.log('prev.getActivePositions', prev.getActivePositions)
  console.log(
    'subscriptionData.data.listenFuturesPositions',
    subscriptionData.data.listenFuturesPositions
  )
  console.log('positionHasTheSameIndex', positionHasTheSameIndex)

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

  console.log(
    'subscriptionData.data.listenOpenOrders',
    subscriptionData.data.listenOpenOrders
  )
  console.log('openOrderHasTheSameOrderIndex', openOrderHasTheSameOrderIndex)

  const openOrderAlreadyExists = openOrderHasTheSameOrderIndex !== -1
  console.log('openOrderAlreadyExists', openOrderAlreadyExists)

  let result

  if (openOrderAlreadyExists) {
    prev.getOpenOrderHistory[openOrderHasTheSameOrderIndex] = {
      ...prev.getOpenOrderHistory[openOrderHasTheSameOrderIndex],
      ...subscriptionData.data.listenOpenOrders,
    }

    // console.log(
    //   'order exist, update',
    //   prev.getOpenOrderHistory[openOrderHasTheSameOrderIndex]
    // )

    result = { ...prev }
  } else {
    prev.getOpenOrderHistory = [
      { ...subscriptionData.data.listenOpenOrders },
      ...prev.getOpenOrderHistory,
    ]

    // console.log('add order', prev.getOpenOrderHistory)

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

  console.log('isEmptySubscription', isEmptySubscription)
  if (isEmptySubscription) {
    return previous
  }

  const prev = cloneDeep(previous)

  const openOrderHasTheSameOrderIndex = prev.getOrderHistory.findIndex(
    (el: OrderType) =>
      el.info.orderId === subscriptionData.data.listenOrderHistory.info.orderId
  )
  const openOrderAlreadyExists = openOrderHasTheSameOrderIndex !== -1

  console.log('openOrderAlreadyExists', openOrderAlreadyExists)
  console.log(
    'subscriptionData.data.listenOrderHistory',
    subscriptionData.data.listenOrderHistory
  )
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
