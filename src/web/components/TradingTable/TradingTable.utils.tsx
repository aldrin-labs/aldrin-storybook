import React from 'react'
import moment from 'moment'
import { OrderType, TradeType, FundsType } from '@core/types/ChartTypes'
import { TableButton } from './TradingTable.styles'
import { ArrowForward as Arrow } from '@material-ui/icons'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { cloneDeep } from 'lodash-es'

import {
  fundsColumnNames,
  openOrdersColumnNames,
  orderHistoryColumnNames,
  tradeHistoryColumnNames,
  positionsColumnNames,
  activeTradesColumnNames,
  fundsBody,
  positionsBody,
  openOrdersBody,
  orderHistoryBody,
  tradeHistoryBody,
} from '@sb/components/TradingTable/TradingTable.mocks'

import SubRow from './PositionsTable/SubRow'
// import {
//   EntryOrderColumn,
//   StopLossColumn,
//   StatusColumn,
//   TakeProfitColumn,
// } from './ActiveTrades/Columns'

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

export const combinePositionsTable = (
  data: OrderType[],
  cancelOrderFunc: (
    keyId: string,
    orderId: string,
    pair: string
  ) => Promise<any>,
  theme: Theme,
  marketPrice: number
) => {
  if (!data && !Array.isArray(data)) {
    return []
  }

  const { green, red } = theme.palette
  let positions = []

  const processedPositionsData = data
    .filter((el) => el.positionAmt !== 0)
    .map((el: OrderType, i: number) => {
      const {
        symbol,
        entryPrice,
        liquidationPrice,
        positionAmt,
        leverage = 1,
        type = '-',
      } = el

      const side = positionAmt < 0 ? 'sell short' : 'buy long'
      const liqPrice =
        entryPrice *
        (side === 'sell short'
          ? 1 + 100 / leverage / 100
          : 1 - 100 / leverage / 100)

      const profitPercentage =
        ((marketPrice / entryPrice) * 100 - 100) * leverage

      const profitAmount = positionAmt * (profitPercentage / 100) * leverage

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
                <span
                  style={{
                    color: '#7284A0',
                    letterSpacing: '1px',
                  }}
                >
                  {type}
                </span>
              </div>
            ),
            style: {
              color: side === 'buy long' ? green.new : red.new,
            },
          },
          size: {
            render: `${positionAmt} ${pair[0]}`,
            contentToSort: positionAmt,
          },
          leverage: {
            render: `X${leverage}`,
            contentToSort: leverage,
          },
          entryPrice: {
            render: `${stripDigitPlaces(entryPrice, 8)} ${pair[1]}`,
            style: { textAlign: 'left', whiteSpace: 'nowrap' },
            contentToSort: entryPrice,
          },
          marketPrice: {
            render: `${stripDigitPlaces(marketPrice, 8)} ${pair[1]}`,
            style: { textAlign: 'left', whiteSpace: 'nowrap' },
            contentToSort: marketPrice,
          },
          liqPrice: {
            render: `${stripDigitPlaces(liqPrice, 8)} ${pair[1]}`,
            style: { textAlign: 'left', whiteSpace: 'nowrap' },
            contentToSort: liqPrice,
          },
          profit: {
            render:
              marketPrice ? (
                <SubColumnValue
                  color={
                    profitPercentage > 0 && side === 'buy long'
                      ? green.new
                      : red.new
                  }
                >
                  {profitPercentage && profitAmount
                    ? `${Math.abs(Number(profitAmount.toFixed(3)))} ${
                        pair[0]
                      } / ${Math.abs(Number(profitPercentage.toFixed(2)))}%`
                    : '-'}
                </SubColumnValue>
              ) : (
                `0 ${pair[0]} / 0%`
              ),
          },
        },
        {
          pair: {
            render: (
              <div>
                <SubRow />
              </div>
            ),
            colspan: 8,
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
    .filter((el) => el.enabled)
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

      console.log('order', el)

      // const filledQuantityProcessed = getFilledQuantity(filled, origQty)

      const pairArr = pair.split('_')
      const status = getStatusFromState(state)

      const entryOrderPrice = !!entryPrice
        ? entryPrice
        : !!entryDeviation
        ? // ? activatePrice + (activatePrice / 100) * entryDeviation
          activatePrice * (1 + entryDeviation / leverage / 100)
        : price

      const profitPercentage =
        ((currentPrice / entryOrderPrice) * 100 - 100) * leverage

      const profitAmount =
        (amount / leverage) * currentPrice * (profitPercentage / 100)

      return {
        pair: {
          render: (
            <SubColumnValue>{`${pairArr[0]}/${pairArr[1]}`}</SubColumnValue>
          ),
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
        },
        entryPrice: {
          render: (
            <SubColumnValue>
              {entryOrderPrice} {pairArr[1]}
            </SubColumnValue>
          ),
        },
        quantity: {
          render: (
            <SubColumnValue>
              {amount} {pairArr[0]}{' '}
            </SubColumnValue>
          ),
        },
        takeProfit: {
          render: (
            <SubColumnValue color={green.new}>
              {trailingExit
                ? `${exitLevels[0].activatePrice}% / ${exitLevels[0].entryDeviation}%`
                : `${exitLevels[0].price}%`}
            </SubColumnValue>
          ),
        },
        stopLoss: {
          render: stopLoss ? (
            <SubColumnValue color={red.new}>{stopLoss}%</SubColumnValue>
          ) : (
            '-'
          ),
        },
        profit: {
          render:
            currentPrice && !!status[0] && status[1] === '#29AC80' ? (
              <SubColumnValue
                color={
                  profitPercentage > 0 && side === 'buy' ? green.new : red.new
                }
              >
                {profitPercentage && profitAmount
                  ? `${Math.abs(Number(profitAmount.toFixed(3)))} ${
                      pairArr[1]
                    } / ${Math.abs(Number(profitPercentage.toFixed(2)))}%`
                  : '-'}
              </SubColumnValue>
            ) : (
              `0 ${pairArr[1]} / 0%`
            ),
        },
        status: {
          render: (
            <SubColumnValue style={{ textTransform: 'none' }} color={status[1]}>
              {!!status[0] ? status[0] : 'Waiting'}
            </SubColumnValue>
          ),
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
              {status[0] === 'Waiting' ? 'close' : 'market'}
            </BtnCustom>
          ),
        },
        // entryOrder: {
        //   render: (
        //     <EntryOrderColumn
        //       enableEdit={!!entryPrice}
        //       pair={`${pairArr[0]}/${pairArr[1]}`}
        //       side={side}
        //       price={entryOrderPrice}
        //       order={orderType}
        //       amount={
        //         marketType === 0 ? +amount.toFixed(8) : +amount.toFixed(3)
        //       }
        //       total={entryOrderPrice * amount}
        //       trailing={!entryPrice && entryDeviation}
        //       red={red.new}
        //       green={green.new}
        //       blue={blue}
        //       editTrade={() => editTrade('entryOrder', el)}
        //     />
        //   ),
        // },
        // takeProfit: {
        //   render: (
        //     <TakeProfitColumn
        //       price={exitLevels.length > 0 && exitLevels[0].price}
        //       order={exitLevels.length > 0 && exitLevels[0].orderType}
        //       targets={exitLevels ? exitLevels : []}
        //       timeoutProfit={timeoutWhenProfit}
        //       timeoutProfitable={timeoutIfProfitable}
        //       trailing={trailingExit}
        //       red={red.new}
        //       green={green.new}
        //       blue={blue}
        //       editTrade={() => editTrade('takeProfit', el)}
        //     />
        //   ),
        // },
        // stopLoss: {
        //   render: (
        //     <StopLossColumn
        //       price={stopLoss}
        //       order={stopLossType}
        //       forced={!!forcedLoss}
        //       timeoutLoss={timeoutLoss}
        //       trailing={false}
        //       timeoutLossable={timeoutLossable}
        //       red={red.new}
        //       green={green.new}
        //       blue={blue}
        //       editTrade={() => editTrade('stopLoss', el)}
        //     />
        //   ),
        // },
        // status: {
        //   render: (
        //     <StatusColumn
        //       status={getStatusFromState(state)}
        //       profitPercentage={profitPercentage}
        //       profitAmount={profitAmount}
        //       red={red.new}
        //       green={green.new}
        //       blue={blue}
        //     />
        //   ),
        // },
        // close: {
        //   render: (
        //     <BtnCustom
        //       btnWidth="100%"
        //       height="auto"
        //       fontSize="1.3rem"
        //       padding=".5rem 0 .4rem 0"
        //       borderRadius=".8rem"
        //       btnColor={red.new}
        //       backgroundColor={'#fff'}
        //       hoverColor={'#fff'}
        //       hoverBackground={red.new}
        //       transition={'all .4s ease-out'}
        //       onClick={() => cancelOrderFunc(el._id)}
        //     >
        //       close
        //     </BtnCustom>
        //   ),
        // },
      }
    })

  return processedActiveTradesData
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
        el.status === 'open' &&
        isDataForThisMarket(marketType, arrayOfMarketIds, el.marketId)
    )
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

      // const filledQuantityProcessed = getFilledQuantity(filled, origQty)
      const pair = symbol.split('_')

      const rawStopPrice = +el.info.stopPrice || +el.stopPrice
      const triggerConditions = +rawStopPrice ? rawStopPrice : '-'
      const triggerConditionsFormatted =
        triggerConditions === '-'
          ? '-'
          : (side === 'buy' && type === 'stop_market') ||
            type === 'stop_limit' ||
            ((side === 'sell' && type === 'take_profit_market') ||
              type === 'take_profit_limit')
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
        },
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
        // TODO: We should change "total" to total param from backend when it will be ready
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
              style={{ color: '#DD6956', borderColor: '#DD6956' }}
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
        type,
        side,
        price,
        status,
        filled,
        average,
        info,
      } = el

      // const filledQuantityProcessed = getFilledQuantity(filled, origQty)
      const pair = symbol.split('_')

      const { orderId = 'id', stopPrice = 0, origQty = '0' } = info
        ? info
        : { orderId: 'id', stopPrice: 0, origQty: 0 }

      const rawStopPrice = +el.info.stopPrice || +el.stopPrice
      const triggerConditions = +rawStopPrice ? rawStopPrice : '-'
      const triggerConditionsFormatted =
        triggerConditions === '-'
          ? '-'
          : (side === 'buy' && type === 'stop_market') ||
            type === 'stop_limit' ||
            ((side === 'sell' && type === 'take_profit_market') ||
              type === 'take_profit_limit')
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
      const { id, timestamp, symbol, side, price, amount } = el

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
          render: quantity || '-',
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
