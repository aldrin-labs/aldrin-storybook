import React from 'react'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(localizedFormat)

import ErrorIcon from '@material-ui/icons/Error'
import ArrowBottom from '@icons/arrowBottom.svg'
import SvgIcon from '@sb/components/SvgIcon'
import Timer from '@icons/clock.svg'
import { processEntryLevels } from '@core/utils/chartPageUtils'

import { Theme } from '@material-ui/core'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { getPrecisionItem } from '@core/utils/getPrecisionItem'
import { modifyCacheData } from '@core/utils/TradingTable.utils'
import { TooltipCustom } from '@sb/components/index'

import { SubColumnTitle, SubColumnValue } from './Columns'
import { SmartOrder } from './ActiveTrades.types'
import { TableCell, TableRow } from '../TradingTable.styles'
import { ExitLevel } from '@sb/compositions/Chart/components/SmartOrderTerminal/types'

type IStatus = {
  state: { state: string }
  strategy: any
  theme: Theme
}

const getActiveOrderStatus = ({
  theme,
  strategy,
  state,
}: IStatus): [
  (
    | 'Trailing entry'
    | 'Active'
    | 'Preparing'
    | 'Timeout'
    | 'Waiting alert'
    | 'On pause'
    | 'Waiting hedge'
  ),
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

    return ['Active', theme.palette.green.main]
  } else {
    return ['Preparing', theme.palette.blue.background]
  }
}

export const getStrategyFields = ({
  el,
  theme,
  keyName,
  pairArr,
  editTrade,
  enableEdit,
  isActiveTable,
  pricePrecision,
  entryOrderPrice,
  handlePairChange,
  quantityPrecision,
}: {
  el: SmartOrder
  theme: Theme
  keyName: string
  pairArr: [string, string]
  editTrade: (part: string, el: SmartOrder) => void
  enableEdit: boolean
  isActiveTable: boolean
  pricePrecision: number
  entryOrderPrice: number
  handlePairChange: (pair: string) => void
  quantityPrecision: number
}) => {
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
      entryLevels,
      stopLoss,
      timeoutLoss,
      hedgeLossDeviation,
    } = {
      pair: '-',
      marketType: 0,
      leverage: 1,
      entryOrder: {
        side: '-',
        orderType: '-',
        amount: 0,
        activatePrice: 0,
      },
      exitLevels: [],
      entryLevels: [],
      stopLoss: 0,
      stopLossType: '-',
      forcedLoss: false,
      trailingExit: false,
      timeoutIfProfitable: '-',
      timeoutLoss: '-',
      timeoutWhenLoss: '-',
      timeoutWhenProfit: '-',
      hedgeLossDeviation: '-',
      isTemplate: false,
      templatePnl: 0,
      templateStatus: '-',
    },
  } = el

  const takeProfitPercentage =
    exitLevels[0] && exitLevels[0].activatePrice && exitLevels[0].entryDeviation
      ? exitLevels[0].activatePrice
      : exitLevels[0].price

  return {
    blank: '',
    pair: {
      render: (
        <SubColumnValue
          theme={theme}
          onClick={(e) => {
            handlePairChange(pair)
          }}
          style={{ fontSize: '1.3rem', fontFamily: 'Avenir Next Demi' }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span
              style={{ color: theme.palette.grey.onboard }}
            >{`${pairArr[0]}/${pairArr[1]}`}</span>
            <span
              style={{
                color:
                  side === 'buy'
                    ? theme.palette.green.main
                    : theme.palette.red.main,

                textTransform: 'capitalize',
              }}
            >
              {marketType === 0
                ? side
                : side === 'buy'
                ? 'buy long'
                : 'sell short'}
            </span>
            <span
              style={{
                color: theme.palette.grey.light,
                textTransform: 'capitalize',
              }}
            >
              {keyName}
            </span>
          </div>
        </SubColumnValue>
      ),
      style: {
        cursor: 'pointer',
      },
    },
    entryPrice: {
      render: !!entryOrderPrice ? (
        <SubColumnValue
          style={{
            fontSize: '1.3rem',
            fontFamily: 'Avenir Next Demi',
            color: theme.palette.grey.onboard,
          }}
          theme={theme}
        >
          {stripDigitPlaces(entryOrderPrice, pricePrecision)} {pairArr[1]}
        </SubColumnValue>
      ) : !!entryDeviation ? (
        <SubColumnValue
          style={{
            fontSize: '1.3rem',
            fontFamily: 'Avenir Next Demi',
            color: theme.palette.grey.onboard,
            display: 'flex',
            flexDirection: 'column',
          }}
          theme={theme}
        >
          <div
            style={{
              color: theme.palette.grey.light,
              textTransform: 'none',
            }}
          >
            Trailing from
          </div>{' '}
          <div>{stripDigitPlaces(activatePrice, pricePrecision)}</div>
        </SubColumnValue>
      ) : (
        '-'
      ),
      contentToSort: entryOrderPrice,
    },
    // leverage: {
    //   render: (
    //     <SubColumnValue
    //       style={{
    //         fontSize: '1.3rem',
    //         fontFamily: 'Avenir Next Demi',
    //         textTransform: 'lowercase',
    //         color: theme.palette.grey.onboard,
    //       }}
    //       theme={theme}
    //     >
    //       {' '}
    //       {'x'}
    //       {leverage}
    //     </SubColumnValue>
    //   ),
    //   contentToSort: leverage,
    // },
    quantity: {
      render: (
        <SubColumnValue
          style={{
            fontSize: '1.3rem',
            fontFamily: 'Avenir Next Demi',
            color: theme.palette.grey.onboard,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
          theme={theme}
        >
          {/* {isActiveTable && enableEdit && (
            <SubColumnTitle
              theme={theme}
              style={{ width: 'auto', padding: '0 1rem 0 0' }}
            >
              <BtnCustom
                disabled={!enableEdit}
                needMinWidth={false}
                btnWidth="auto"
                height="1.5rem"
                fontSize=".9rem"
                padding=".1rem 1rem 0 1rem"
                borderRadius="0.5rem"
                borderColor={
                  enableEdit ? theme.palette.blue.tabs : theme.palette.grey.main
                }
                btnColor={'#fff'}
                backgroundColor={
                  enableEdit ? theme.palette.blue.tabs : theme.palette.grey.main
                }
                transition={'all .4s ease-out'}
                onClick={(e) => {
                  e.stopPropagation()
                  editTrade('entryOrder', el)
                }}
                style={enableEdit ? {} : { cursor: 'default' }}
              >
                edit
              </BtnCustom>
            </SubColumnTitle>
          )} */}

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <a
              style={{
                color: theme.palette.grey.light,
                fontSize: '1.2rem',
              }}
            >
              {amount.toFixed(quantityPrecision)} {pairArr[0]}
            </a>
            <a
              style={{
                color: theme.palette.grey.light,
                fontSize: '1.2rem',
              }}
            >
              {(amount * entryOrderPrice).toFixed(2)} {pairArr[1]}
            </a>
          </div>
        </SubColumnValue>
      ),
      contentToSort: amount,
    },
    // averaging: {
    //   render: (
    //     <SubColumnValue
    //       style={{
    //         fontSize: '1.3rem',
    //         fontFamily: 'Avenir Next Demi',
    //         textTransform: 'lowercase',
    //         color: theme.palette.grey.onboard,
    //         position: 'relative',
    //       }}
    //       theme={theme}
    //     >
    //       {entryLevels && entryLevels.length > 0 ? (
    //         <>
    //           {entryLevels.length}
    //           {' points'}{' '}
    //           <SvgIcon src={ArrowBottom} width={'1rem'} height={'1rem'} />
    //         </>
    //       ) : (
    //         '-'
    //       )}
    //       {entryLevels.length > 0 && (
    //         <div
    //           className="avgTable"
    //           style={{
    //             position: 'absolute',
    //             height: 'auto',
    //             left: '45%',
    //             width: '60rem',
    //             top: '100%',
    //             background: theme.palette.background.default,
    //             zIndex: 100,
    //             borderRadius: '0.1rem',
    //             justifyContent: 'center',
    //             border: theme.palette.border.main,
    //           }}
    //         >
    //           <table
    //             style={{
    //               width: '95%',
    //               color: theme.palette.grey.light,
    //               textTransform: 'uppercase',
    //               letterSpacing: '0',
    //             }}
    //           >
    //             <TableRow style={{ fontSize: '1.2rem' }}>
    //               <TableCell theme={theme}>price</TableCell>
    //               <TableCell theme={theme}>amount / margin</TableCell>
    //               <TableCell theme={theme}>est. averaged entry price</TableCell>
    //             </TableRow>

    //             {processEntryLevels(entryLevels, leverage, side).map(
    //               (level, index) => {
    //                 return (
    //                   <TableRow>
    //                     <TableCell theme={theme}>
    //                       {level.price.toFixed(pricePrecision)} {pairArr[1]}
    //                     </TableCell>
    //                     <TableCell theme={theme}>
    //                       {level.quantity} {index === 0 ? pairArr[0] : '%'} /{' '}
    //                       {level.margin.toFixed(pricePrecision)} {pairArr[1]}
    //                     </TableCell>
    //                     <TableCell theme={theme}>
    //                       {level.estimatedAveragingPrice.toFixed(
    //                         pricePrecision
    //                       )}{' '}
    //                       {pairArr[1]}
    //                     </TableCell>
    //                   </TableRow>
    //                 )
    //               }
    //             )}
    //           </table>{' '}
    //         </div>
    //       )}
    //     </SubColumnValue>
    //   ),
    //   contentToSort: entryLevels ? entryLevels.length : 0,
    // },
    stopLoss: {
      render:
        stopLoss || hedgeLossDeviation ? (
          <SubColumnValue
            style={{
              fontSize: '1.3rem',
              fontFamily: 'Avenir Next Demi',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
            theme={theme}
            color={theme.palette.red.main}
          >
            {isActiveTable && (
              <SubColumnTitle
                theme={theme}
                style={{ width: 'auto', padding: '0 1rem 0 0' }}
              >
                <BtnCustom
                  needMinWidth={false}
                  btnWidth="auto"
                  height="1.5rem"
                  fontSize=".9rem"
                  padding=".1rem 1rem 0 1rem"
                  borderRadius="0.5rem"
                  borderColor={theme.palette.blue.tabs}
                  btnColor={'#fff'}
                  backgroundColor={theme.palette.blue.tabs}
                  hoverBackground={theme.palette.blue.tabs}
                  transition={'all .4s ease-out'}
                  onClick={(e) => {
                    e.stopPropagation()
                    editTrade('stopLoss', el)
                  }}
                >
                  edit
                </BtnCustom>
              </SubColumnTitle>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <div style={{ alignSelf: 'start' }}>
                {' '}
                <a> {stopLoss || hedgeLossDeviation}% </a>{' '}
                {timeoutLoss ? (
                  <a>
                    <>
                      {' '}
                      <a style={{ color: theme.palette.grey.onboard }}>
                        {' '}
                        /{' '}
                      </a>{' '}
                      <SvgIcon src={Timer} height="13px" />
                      <a
                        style={{
                          textTransform: 'lowercase',
                          color: theme.palette.grey.onboard,
                        }}
                      >
                        {' '}
                        {timeoutLoss} sec
                      </a>
                    </>
                  </a>
                ) : null}
              </div>
              <a
                style={{
                  color: theme.palette.grey.light,
                  fontSize: '1.2rem',
                  alignSelf: 'baseline',
                }}
              >
                {' '}
                {entryOrderPrice ? (
                  side === 'buy' ? (
                    (entryOrderPrice * (1 - stopLoss / 100 / leverage)).toFixed(
                      pricePrecision
                    ) + ` ${pairArr[1]}`
                  ) : (
                    (entryOrderPrice * (1 + stopLoss / 100 / leverage)).toFixed(
                      pricePrecision
                    ) + ` ${pairArr[1]}`
                  )
                ) : (
                  <a style={{ textTransform: 'none', alignSelf: 'baseline' }}>
                    Processing...
                  </a>
                )}{' '}
              </a>
            </div>
          </SubColumnValue>
        ) : (
          '-'
        ),
      contentToSort: stopLoss,
    },
    takeProfit: {
      render: (
        <SubColumnValue
          style={{
            fontSize: '1.3rem',
            fontFamily: 'Avenir Next Demi',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
          theme={theme}
          color={theme.palette.green.main}
        >
          {isActiveTable && (
            <SubColumnTitle
              theme={theme}
              style={{ width: 'auto', padding: '0 1rem 0 0' }}
            >
              <BtnCustom
                disable={!enableEdit}
                needMinWidth={false}
                btnWidth="auto"
                height="1.5rem"
                fontSize=".9rem"
                padding=".1rem 1rem 0 1rem"
                borderRadius="0.5rem"
                borderColor={theme.palette.blue.tabs}
                btnColor={'#fff'}
                backgroundColor={theme.palette.blue.tabs}
                hoverBackground={theme.palette.blue.tabs}
                transition={'all .4s ease-out'}
                onClick={(e) => {
                  e.stopPropagation()
                  editTrade('takeProfit', el)
                }}
              >
                edit
              </BtnCustom>
            </SubColumnTitle>
          )}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <div style={{ alignSelf: 'start' }}>
              {exitLevels[0] &&
              exitLevels[0].activatePrice &&
              exitLevels[0].entryDeviation ? (
                entryOrderPrice ? (
                  <div>
                    {' '}
                    <a
                      style={{
                        fontSize: '1.2rem',
                        textTransform: 'none',
                        alignSelf: 'baseline',
                      }}
                    >
                      Trailing from
                    </a>{' '}
                    +{exitLevels[0].activatePrice}%
                  </div>
                ) : (
                  `${exitLevels[0].activatePrice}% / ${exitLevels[0].entryDeviation}%` // trailing
                )
              ) : exitLevels.length > 1 ? ( // split targets
                <div
                  style={{
                    fontSize: '1.3rem',
                    fontFamily: 'Avenir Next Demi',
                    textTransform: 'lowercase',
                    color: theme.palette.grey.onboard,
                    position: 'relative',
                  }}
                >
                  {' '}
                  {exitLevels.length} targets{' '}
                  <div
                    className="splitTargetsTable"
                    style={{
                      position: 'absolute',
                      height: 'auto',
                      left: '45%',
                      width: '25rem',
                      top: '100%',
                      background: theme.palette.background.default,
                      zIndex: 100,
                      borderRadius: '0.1rem',
                      justifyContent: 'center',
                      border: theme.palette.border.main,
                    }}
                  >
                    <table
                      style={{
                        width: '95%',
                        color: theme.palette.grey.light,
                        textTransform: 'uppercase',
                        letterSpacing: '0',
                      }}
                    >
                      <TableRow style={{ fontSize: '1.2rem' }}>
                        <TableCell theme={theme}>price</TableCell>
                        <TableCell theme={theme}>quantity</TableCell>
                      </TableRow>

                      {exitLevels.map((el: ExitLevel) => {
                        return (
                          <TableRow>
                            <TableCell theme={theme}>{el.price}%</TableCell>
                            <TableCell theme={theme}>{el.amount}%</TableCell>
                          </TableRow>
                        )
                      })}
                    </table>{' '}
                  </div>
                  <SvgIcon src={ArrowBottom} width={'1rem'} height={'1rem'} />
                </div>
              ) : (
                `${exitLevels.length > 0 ? exitLevels[0].price : '-'}%` // tp
              )}
            </div>
            {exitLevels.length > 1 ? null : (
              <a
                style={{
                  color: theme.palette.grey.light,
                  fontSize: '1.2rem',
                  alignSelf: 'baseline',
                }}
              >
                {' '}
                {entryOrderPrice ? (
                  side === 'buy' ? (
                    (
                      entryOrderPrice *
                      (1 + takeProfitPercentage / 100 / leverage)
                    ).toFixed(pricePrecision) + ` ${pairArr[1]}`
                  ) : (
                    (
                      entryOrderPrice *
                      (1 - takeProfitPercentage / 100 / leverage)
                    ).toFixed(pricePrecision) + ` ${pairArr[1]}`
                  )
                ) : (
                  <a style={{ textTransform: 'none', alignSelf: 'baseline' }}>
                    Processing...
                  </a>
                )}{' '}
              </a>
            )}
          </div>
        </SubColumnValue>
      ),
    },
  }
}

export const combineActiveTradesTable = ({
  data,
  queryBody,
  queryVariables,
  cancelOrderFunc,
  changeStatusWithStatus,
  editTrade,
  theme,
  marketType,
  currencyPair,
  addOrderToCanceled,
  canceledOrders,
  keys,
  handlePairChange,
  pricePrecision,
  quantityPrecision
}: // pricePrecision,
// quantityPrecision
{
  data: any[]
  queryBody: string
  queryVariables: object
  cancelOrderFunc: (strategyId: string, accId: string) => Promise<any>
  changeStatusWithStatus: (
    startegyId: string,
    keyId: string,
    status: string
  ) => Promise<any>
  editTrade: (block: string, trade: any) => void
  theme: Theme
  marketType: 0 | 1
  currencyPair: string
  addOrderToCanceled: (id: string) => void
  canceledOrders: string[]
  keys: any
  handlePairChange: (pair: string) => void
  quantityPrecision: number,
  pricePrecision: number
  // quantityPrecision: number
}) => {
  if (!data && !Array.isArray(data)) {
    return []
  }

  const processedActiveTradesData = data
    .filter(
      (a) =>
        !!a &&
        (a.enabled ||
          (a.conditions.isTemplate &&
            a.conditions.templateStatus !== 'disabled')) &&
        !canceledOrders.includes(a._id)
    )
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
    .map((el: SmartOrder) => {
      const {
        accountId,
        conditions: {
          pair,
          leverage,
          marketType,
          entryOrder: { side, orderType, amount, price, entryDeviation },
          entryLevels,
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
          entryLevels: [],
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
        state: '-',
        msg: null,
        receivedProfitAmount: 0,
        receivedProfitPercentage: 0,
      }

      const pairArr = pair.split('_')
      const needOpacity = false
      const keyName = keys[accountId]

      const entryOrderPrice =
        !entryDeviation && orderType === 'limit' && !entryPrice
          ? price
          : entryPrice

      const [activeOrderStatus, statusColor] = getActiveOrderStatus({
        strategy: el,
        state: el.state,
        theme,
      })

      const isErrorInOrder = !!msg
      const strategyId = el._id
      const enableEdit = !entryPrice

      const isSMIsAlreadyInEntry =
        !isTemplate &&
        state &&
        activeOrderStatus !== 'Preparing' &&
        state !== 'WaitForEntry' &&
        state !== 'TrailingEntry'

      return {
        id: `${el._id}_${el.accountId}`,
        ...getStrategyFields({
          el,
          theme,
          keyName,
          pairArr,
          editTrade,
          enableEdit,
          pricePrecision,
          entryOrderPrice,
          handlePairChange,
          quantityPrecision,
          isActiveTable: true,
        }),
        profit: {
          render: (
            // isSMIsAlreadyInEntry && entryOrderPrice ? (
            //     <SMPnlComponent
            //       exchange={activeExchange}
            //       symbol={pair}
            //       marketType={marketType}
            //       pairArr={pairArr}
            //       entryPrice={entryPrice}
            //       leverage={leverage}
            //       side={side}
            //       exitPrice={exitPrice}
            //       entryOrderPrice={entryOrderPrice}
            //       entryLevels={entryLevels}
            //       receivedProfitPercentage={receivedProfitPercentage}
            //       receivedProfitAmount={receivedProfitAmount}
            //       positionAmount={+stripDigitPlaces(amount, quantityPrecision)}
            //       templatePnl={templatePnl}
            //       theme={theme}
            //     />
            //   ) : (
            <span style={{ color: theme.palette.grey.light }}>
              0 {pairArr[1]} / 0%
            </span>
          ),
          // ),
          style: {
            opacity: needOpacity ? 0.6 : 1,
            minWidth: '135px',
          },
        },
        status: {
          render: (
            <SubColumnValue
              theme={theme}
              style={{
                textTransform: 'none',
                width: '8.5rem',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                fontSize: '1.3rem',
                fontFamily: 'Avenir Next Demi',
                whiteSpace: 'nowrap',
              }}
              color={isErrorInOrder ? theme.palette.red.main : statusColor}
            >
              {isErrorInOrder ? 'Error' : activeOrderStatus}
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
                        />
                      </div>
                    }
                  />
                  <a className={'errorMsg'} style={{}}>
                    {msg}
                  </a>
                </div>
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
          ) : isTemplate ? (
            <div>
              <BtnCustom
                btnWidth="100%"
                height="auto"
                fontSize=".9rem"
                padding=".2rem 0 .1rem 0"
                margin="0 0 .4rem 0"
                borderRadius=".8rem"
                btnColor={theme.palette.white.main}
                borderColor={theme.palette.blue.main}
                backgroundColor={theme.palette.blue.main}
                hoverColor={theme.palette.white.main}
                hoverBackground={theme.palette.blue.main}
                transition={'all .4s ease-out'}
                onClick={(e) => {
                  e.stopPropagation()
                  changeStatusWithStatus(
                    el._id,
                    el.accountId,
                    templateStatus === 'paused' ? 'enabled' : 'paused'
                  )
                }}
              >
                {templateStatus === 'paused' ? 'continue' : 'pause'}
              </BtnCustom>
              <BtnCustom
                btnWidth="100%"
                height="auto"
                fontSize=".9rem"
                margin=".4rem 0 0 0"
                padding=".2rem 0 .1rem 0"
                borderRadius=".8rem"
                btnColor={theme.palette.white.main}
                borderColor={theme.palette.red.main}
                backgroundColor={theme.palette.red.main}
                hoverColor={theme.palette.white.main}
                hoverBackground={theme.palette.red.main}
                transition={'all .4s ease-out'}
                onClick={(e) => {
                  e.stopPropagation()
                  changeStatusWithStatus(el._id, el.accountId, 'disabled').then(
                    (res) => {
                      console.log('changeStatusWithStatus res', res)

                      if (res.status === 'error') {
                        modifyCacheData({
                          _id: strategyId,
                          name: 'getActiveStrategies',
                          subName: 'strategies',
                          typename: 'strategiesHistoryOutput',
                          data: null,
                          query: queryBody,
                          variables: queryVariables,
                          modifyFunc: 'map',
                          modifyFuncCallBack: (elem) => {
                            if (elem._id === strategyId) {
                              elem.enabled = el.enabled

                              if (
                                elem.conditions.isTemplate &&
                                elem.conditions.templateStatus
                              ) {
                                elem.conditions.templateStatus =
                                  el.conditions.templateStatus
                              }
                            }

                            return elem
                          },
                        })
                      }
                    }
                  )

                  modifyCacheData({
                    _id: strategyId,
                    name: 'getActiveStrategies',
                    subName: 'strategies',
                    typename: 'strategiesHistoryOutput',
                    data: null,
                    query: queryBody,
                    variables: queryVariables,
                    modifyFunc: 'map',
                    modifyFuncCallBack: (elem) => {
                      if (elem._id === strategyId) {
                        elem.enabled = false

                        if (
                          elem.conditions.isTemplate &&
                          elem.conditions.templateStatus
                        ) {
                          elem.conditions.templateStatus = 'disabled'
                        }
                      }

                      return elem
                    },
                  })

                  // addOrderToCanceled(el._id)
                }}
              >
                stop
              </BtnCustom>
            </div>
          ) : (
            <BtnCustom
              btnWidth="100%"
              height="auto"
              fontSize=".9rem"
              padding=".2rem 0 .1rem 0"
              borderRadius=".8rem"
              btnColor={theme.palette.white.main}
              borderColor={theme.palette.red.main}
              backgroundColor={theme.palette.red.main}
              hoverColor={theme.palette.red.main}
              hoverBackground={theme.palette.white.main}
              transition={'all .4s ease-out'}
              onClick={(e) => {
                e.stopPropagation()
                cancelOrderFunc(el._id, el.accountId).then((res) => {
                  console.log('changeStatusWithStatus res', res)

                  if (res.status === 'error') {
                    modifyCacheData({
                      _id: strategyId,
                      name: 'getActiveStrategies',
                      subName: 'strategies',
                      typename: 'strategiesHistoryOutput',
                      data: null,
                      query: queryBody,
                      variables: queryVariables,
                      modifyFunc: 'map',
                      modifyFuncCallBack: (elem) => {
                        if (elem._id === strategyId) {
                          elem.enabled = el.enabled

                          if (
                            elem.conditions.isTemplate &&
                            elem.conditions.templateStatus
                          ) {
                            elem.conditions.templateStatus =
                              el.conditions.templateStatus
                          }
                        }

                        return elem
                      },
                    })
                  }
                })

                modifyCacheData({
                  _id: strategyId,
                  name: 'getActiveStrategies',
                  subName: 'strategies',
                  typename: 'strategiesHistoryOutput',
                  data: null,
                  query: queryBody,
                  variables: queryVariables,
                  modifyFunc: 'map',
                  modifyFuncCallBack: (elem) => {
                    if (elem._id === strategyId) {
                      elem.enabled = false

                      if (
                        elem.conditions.isTemplate &&
                        elem.conditions.templateStatus
                      ) {
                        elem.conditions.templateStatus = 'disabled'
                      }
                    }

                    return elem
                  },
                })
              }}
            >
              {activeOrderStatus === 'Preparing' ||
              activeOrderStatus === 'Trailing entry'
                ? 'cancel'
                : 'market'}
            </BtnCustom>
          ),
        },
        // expandableContent: [
        //   {
        //     row: {
        //       render: (
        //         <div style={{ position: 'relative' }}>
        //           <EntryOrderColumn
        //             theme={theme}
        //             haveEdit={true}
        //             entryLevels={entryLevels} // avg
        //             editTrade={() => editTrade('entryOrder', el)}
        //             enableEdit={activeOrderStatus === 'Preparing' || isTemplate}
        //             pair={`${pairArr[0]}/${pairArr[1]}`}
        //             side={side}
        //             price={entryOrderPrice}
        //             order={orderType}
        //             amount={
        //               // I use toFixed instead of stripDigitPlaces
        //               // coz in strategy-service we're rounding amount in this way
        //               amount.toFixed(quantityPrecision)
        //             }
        //             total={entryOrderPrice * amount}
        //             trailing={
        //               entryDeviation
        //                 ? stripDigitPlaces(entryDeviation / leverage, 3)
        //                 : false
        //             }
        //             activatePrice={activatePrice}
        //             red={red.main}
        //             green={green.main}
        //             blue={blue}
        //           />
        //           <TakeProfitColumn
        //             haveEdit={true}
        //             theme={theme}
        //             enableEdit={true}
        //             editTrade={() => editTrade('takeProfit', el)}
        //             price={exitLevels.length > 0 && exitLevels[0].price}
        //             order={exitLevels.length > 0 && exitLevels[0].orderType}
        //             targets={exitLevels ? exitLevels : []}
        //             timeoutProfit={timeoutWhenProfit}
        //             timeoutProfitable={timeoutIfProfitable}
        //             trailing={trailingExit}
        //             red={red.main}
        //             green={green.main}
        //             blue={blue}
        //           />
        //           <StopLossColumn
        //             theme={theme}
        //             haveEdit={true}
        //             enableEdit={true}
        //             editTrade={() => editTrade('stopLoss', el)}
        //             price={stopLoss}
        //             order={stopLossType}
        //             forced={forcedLoss}
        //             timeoutWhenLoss={timeoutWhenLoss}
        //             timeoutLoss={timeoutLoss}
        //             red={red.main}
        //             green={green.main}
        //             blue={blue}
        //           />
        //           <DateColumn theme={theme} createdAt={date} />
        //         </div>
        //       ),
        //       colspan: 9,
        //     },
        //   },
        // ],
      }
    })

  return processedActiveTradesData
}
