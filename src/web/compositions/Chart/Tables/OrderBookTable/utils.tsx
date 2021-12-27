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

import RedArrow from '@icons/redArrow.png'
import GreenArrow from '@icons/greenArrow.png'
import { isDataForThisMarket } from '@sb/components/TradingTable/TradingTable.utils'
import { Theme } from '@material-ui/core'
import { filterOpenOrders } from '@sb/components/TradingTable/OpenOrdersTable/OpenOrdersTable.utils'
import { Order } from '@project-serum/serum/lib/market'

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
  const fall = side === 'bids' || side === 'asks' ? undefined : rowData.fall

  const colorStyles =
    fall !== undefined
      ? {
          color: fall ? theme.palette.red.main : theme.palette.green.main,
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
        const orderPrice = order.price

        return +orderPrice === +rowData.price
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
        // backgroundColor: needHighlightPrice
        //   ? 'rgba(224, 229, 236, 0.5)'
        //   : needHighlightStopPrice
        //   ? 'rgba(68, 204, 255, 0.5)'
        //   : '',
      }}
    >
      <img
        style={{
          width: '1rem',
          position: 'absolute',
          left: 0,
          transform: 'translateX(25%)',
          ...(fall === undefined || fall === 0
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
          ...(fall === undefined || fall === 1
            ? { display: 'none' }
            : { display: 'block' }),
        }}
        src={GreenArrow}
      />
      {columns}
      {needHighlightPrice && (
        <div
          style={{
            width: '.7rem',
            height: '.7rem',
            borderRadius: '50%',
            position: 'absolute',
            top: '50%',
            left: '0',
            transform: 'translate(50%, -50%)',
            background: '#fff',
          }}
        ></div>
      )}
      <div
        className="amountForBackground"
        style={{
          borderRadius: '.1rem',
          backgroundColor:
            side === 'bids' || fall === 0
              ? theme.palette.orderbook.greenBackground
              : theme.palette.orderbook.redBackground,
          transform: `translateX(calc(100% - ${orderPercentage}%))`,
          ...(fall === undefined
            ? {}
            : { transition: 'none', willChange: 'background-color' }),
        }}
      />
      <div className="needHover" />
    </div>
  )
}

export const getRowHeight = ({
  mode,
  height,
  isMobile,
  side,
  terminalViewMode,
}: {
  mode: string
  height: number
  isMobile: boolean
  side: string
  terminalViewMode: string
}) => {
  const isAsks = side === 'asks'

  if (isMobile) {
    if (isAsks) {
      return height / 6
    } else {
      return terminalViewMode === 'mobileChart' ? height / 6 : height / liqRatio
    }
  } else {
    return mode === 'both' ? height / 8 : height / 18
  }
}
