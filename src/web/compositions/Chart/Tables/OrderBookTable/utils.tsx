/** @flow */
import React, { CSSProperties } from 'react'
import styled from 'styled-components'
import {
  rowStyles,
  roundUp,
  roundUpSmall,
  getNumberOfDecimalsFromNumber,
} from '@core/utils/chartPageUtils'

import RedArrow from '@icons/redArrow.png'
import GreenArrow from '@icons/greenArrow.png'
import { isDataForThisMarket } from '@sb/components/TradingTable/TradingTable.utils'

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

const roundDown = function(num, precision) {
  num = parseFloat(num)
  if (!precision) return num
  return Math.floor(num / precision) * precision
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
  openOrderHistory,
  amountForBackground,
}: IProps) {
  const a11yProps = { 'aria-rowindex': index + 1 }
  const colorStyles =
    rowData.fall !== undefined
      ? // ? { color: rowData.fall ? '#DD6956' : '#29AC80' }
        { color: rowData.fall ? '#FF3716' : '#13901F' }
      : {}
  let needHighlightPrice = false
  let needHighlightStopPrice = false

  if (openOrderHistory && openOrderHistory.length > 0) {
    const functionToRound = aggregation >= 1 ? roundDown : roundUpSmall

    const digitsByGroup =
      aggregation >= 1
        ? aggregation
        : getNumberOfDecimalsFromNumber(aggregation)

    needHighlightPrice =
      openOrderHistory.findIndex((order) => {
        const orderPrice = functionToRound(order.price, digitsByGroup)

        return (
          +orderPrice === +rowData.price &&
          (isDataForThisMarket(marketType, arrayOfMarketIds, order.marketId) ||
            order.marketId === '0') &&
          !order.stopPrice
        )
      }) !== -1

    needHighlightStopPrice =
      openOrderHistory.findIndex((order) => {
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
            side === 'bids' || rowData.fall === 0
              ? // ? 'rgba(149, 220, 160, 0.31)'
                // : 'rgba(220, 157, 149, 0.31)',
                '#AAF2C9'
              : '#FFD1D1',
          transform: `translateX(calc(100% - ${orderPercentage}%))`,
          ...(rowData.fall === undefined ? {} : { transition: 'none' }),
        }}
      />
      <div className="needHover" />
    </div>
  )
}
