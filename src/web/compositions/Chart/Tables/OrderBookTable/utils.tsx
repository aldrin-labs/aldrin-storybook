/** @flow */
import React, { CSSProperties } from 'react'
import styled from 'styled-components'
import {
  rowStyles,
  roundUp,
  roundDown,
  roundDownSmall,
  roundUpSmall,
  getNumberOfDecimalsFromNumber,
} from '@core/utils/chartPageUtils'

import { filterOpenOrders } from '@sb/components/TradingTable/TradingTable.utils'

import RedArrow from '@icons/redArrow.png'
import GreenArrow from '@icons/greenArrow.png'
import { isDataForThisMarket } from '@sb/components/TradingTable/TradingTable.utils'
import { Theme } from '@material-ui/core'

// ${rowStyles}
// ${(props: { style: CSSProperties }) =>
//   props.styles}

// @media (max-width: 1450px) {
//   font-size: 1rem;
// }

// @media (max-width: 1350px) {
//   font-size: 0.9rem;
// }

const Container = styled.div``

/**
 * Default row renderer for Table.
 */

type IProps = {
  className: string
  amountForBackground: number
  columns: any
  index: number
  key?: string
  rowData?: any
  theme: Theme
  style?: CSSProperties
  openOrderHistory: { price: number }[]
  onRowClick?: ({
    event,
    index,
    rowData,
  }: {
    event: Event
    index: number
    rowData: any
  }) => void
  onRowDoubleClick?: ({
    event: Event,
    index: number,
    rowData: any,
  }: {
    event: Event
    index: number
    rowData: any
  }) => void
  onRowMouseOut?: ({
    event: Event,
    index: number,
    rowData: any,
  }: {
    event: Event
    index: number
    rowData: any
  }) => void
  onRowMouseOver?: ({
    event: Event,
    index: number,
    rowData: any,
  }: {
    event: Event
    index: number
    rowData: any
  }) => void
  onRowRightClick?: ({
    event: Event,
    index: number,
    rowData: any,
  }: {
    event: Event
    index: number
    rowData: any
  }) => void
}

export default function defaultRowRenderer({
  className,
  columns,
  index,
  key,
  onRowClick,
  onRowDoubleClick,
  onRowMouseOut,
  onRowMouseOver,
  onRowRightClick,
  rowData,
  style,
  side,
  arrayOfMarketIds = [],
  marketType,
  aggregation = 0.00000001,
  openOrderHistory = [],
  amountForBackground,
  theme,
}: IProps) {
  const a11yProps = { 'aria-rowindex': index + 1 }
  const colorStyles =
    rowData.fall !== undefined
      ? // ? { color: rowData.fall ? '#DD6956' : '#29AC80' }
        {
          color: rowData.fall
            ? theme.palette.red.main
            : theme.palette.green.main,
        }
      : {}
  let needHighlightPrice = false
  let needHighlightStopPrice = false

  const openOrders =
    (openOrderHistory &&
      openOrderHistory.filter((order) =>
        filterOpenOrders({ order, canceledOrders: [] })
      )) ||
    []

  if (openOrders && openOrders.length > 0) {
    const functionToRound =
      aggregation >= 1
        ? side === 'bids'
          ? roundDown
          : roundUp
        : side === 'bids'
        ? roundDownSmall
        : roundUpSmall

    const digitsByGroup =
      aggregation >= 1
        ? aggregation
        : getNumberOfDecimalsFromNumber(aggregation)

    needHighlightPrice =
      openOrders.findIndex((order) => {
        const orderPrice = functionToRound(order.price, digitsByGroup)

        return (
          +orderPrice === +rowData.price &&
          (isDataForThisMarket(marketType, arrayOfMarketIds, order.marketId) ||
            order.marketId === '0') &&
          !order.stopPrice
        )
      }) !== -1

    needHighlightStopPrice =
      openOrders.findIndex((order) => {
        const orderStopPrice = functionToRound(order.stopPrice, digitsByGroup)

        return (
          +orderStopPrice === +rowData.price &&
          (isDataForThisMarket(marketType, arrayOfMarketIds, order.marketId) ||
            order.marketId === '0')
        )
      }) !== -1
  }

  let orderPercentage =
    rowData.size > amountForBackground
      ? 100
      : rowData.size / (amountForBackground / 100)

  if (
    onRowClick ||
    onRowDoubleClick ||
    onRowMouseOut ||
    onRowMouseOver ||
    onRowRightClick
  ) {
    a11yProps['aria-label'] = 'row'
    a11yProps.tabIndex = 0

    if (onRowClick) {
      a11yProps.onClick = (event) => onRowClick({ event, index, rowData })
    }
    if (onRowDoubleClick) {
      a11yProps.onDoubleClick = (event) =>
        onRowDoubleClick({ event, index, rowData })
    }
    if (onRowMouseOut) {
      a11yProps.onMouseOut = (event) => onRowMouseOut({ event, index, rowData })
    }
    if (onRowMouseOver) {
      a11yProps.onMouseOver = (event) =>
        onRowMouseOver({ event, index, rowData })
    }
    if (onRowRightClick) {
      a11yProps.onContextMenu = (event) =>
        onRowRightClick({ event, index, rowData })
    }
  }

  return (
    <div
      {...a11yProps}
      className={`${className} virtualized-row`}
      key={key}
      role="row"
      style={{
        ...style,
        ...colorStyles,
        backgroundColor: needHighlightPrice
          ? 'rgba(224, 229, 236, 0.5)'
          : needHighlightStopPrice
          ? 'rgba(68, 204, 255, 0.5)'
          : '',
      }}
    >
      <img
        style={{
          width: '1rem',
          position: 'absolute',
          left: 0,
          transform: 'translateX(25%)',
          ...(rowData.fall === undefined || rowData.fall === 0
            ? { display: 'none' }
            : { display: 'block' }),
        }}
        src={RedArrow}
      />
      <img
        style={{
          width: '1rem',
          position: 'absolute',
          left: 0,
          transform: 'translateX(25%)',
          ...(rowData.fall === undefined || rowData.fall === 1
            ? { display: 'none' }
            : { display: 'block' }),
        }}
        src={GreenArrow}
      />
      {columns}
      <div
        className="amountForBackground"
        style={{
          backgroundColor:
            side === 'bids'
              ? theme.palette.orderbook.greenBackground
              : side === 'asks'
              ? theme.palette.orderbook.redBackground
              : rowData.fall === 0
              ? theme.palette.tradeHistory.greenBackground
              : theme.palette.tradeHistory.redBackground,

          // transform: `translateX(calc(100% - ${orderPercentage}%))`,
          // ...(rowData.fall === undefined
          //   ? {}
          //   : { transition: 'none', willChange: 'background-color' }),
        }}
      />
      <div className="needHover" />
    </div>
  )
}
