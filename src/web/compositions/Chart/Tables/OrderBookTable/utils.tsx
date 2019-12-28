/** @flow */
import React, { CSSProperties } from 'react'
import styled from 'styled-components'
import {
  rowStyles,
  roundUp,
  roundUpSmall,
  getNumberOfDecimalsFromNumber,
} from '@core/utils/chartPageUtils'

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
  aggregation = 0.00000001,
  openOrderHistory,
  amountForBackground,
}: IProps) {
  const a11yProps = { 'aria-rowindex': index + 1 }
  const colorStyles =
    rowData.fall !== undefined
      ? { color: rowData.fall ? '#DD6956' : '#29AC80' }
      : {}
  let needHighlightPrice = false
  let needHighlightStopPrice = false

  if (openOrderHistory && openOrderHistory.length > 0) {
    const functionToRound = aggregation >= 1 ? roundUp : roundUpSmall

    const digitsByGroup =
      aggregation >= 1
        ? aggregation
        : getNumberOfDecimalsFromNumber(aggregation)

    needHighlightPrice =
      openOrderHistory.findIndex((order) => {
        const orderPrice = functionToRound(order.price, digitsByGroup)

        return +orderPrice === +rowData.price
      }) !== -1

    needHighlightStopPrice =
      openOrderHistory.findIndex((order) => {
        const orderStopPrice = functionToRound(order.stopPrice, digitsByGroup)

        return +orderStopPrice === +rowData.price
      }) !== -1
  }

  const orderPercentage =
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
    // <Fade timeout={1000} in={true}>
    <Container
      {...a11yProps}
      className={className}
      key={key}
      role="row"
      style={{
        ...style,
        ...rowStyles,
        ...colorStyles,
        backgroundColor: needHighlightPrice
          ? '#e0e5ec'
          : needHighlightStopPrice
          ? '#44CCFF'
          : '',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, .15)',
        },
        '@media (max-width: 1450px)': {
          fontSize: '1rem',
        },
        '@media (max-width: 1350px)': {
          fontSize: '0.9rem',
        },
      }}
    >
      {columns}
      {amountForBackground && (
        <Container
          style={{
            position: 'absolute',
            width: '100%',
            height: '80%',
            backgroundColor:
              side === 'bids'
                ? 'rgba(149, 220, 160, 0.31)'
                : 'rgba(220, 157, 149, 0.31)',
            borderRadius: '1px',
            top: '10%',
            left: `calc(100% - ${orderPercentage}%)`,
          }}
        />
      )}
    </Container>
    // </Fade>
  )
}
