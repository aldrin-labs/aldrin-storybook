/** @flow */
import React, { useState, useEffect, CSSProperties } from 'react'
import { Fade } from '@material-ui/core'

/**
 * Default row renderer for Table.
 */

type IProps = {
  className: string
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
  openOrderHistory,
}: IProps) {
  const a11yProps = { 'aria-rowindex': index + 1 }
  const colorStyles = rowData.fall !== undefined ? { color: rowData.fall ? '#DD6956' : '#29AC80'} : {}
  let needHighlight = false

  if (openOrderHistory && openOrderHistory.length > 0) {
    needHighlight =
      openOrderHistory.findIndex((order) => order.price === rowData.price) !==
      -1
  }

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
    <div
      {...a11yProps}
      className={className}
      key={key}
      role="row"
      style={{ ...style, ...colorStyles, backgroundColor: needHighlight ? '#e0e5ec' : '' }}
    >
      {columns}
    </div>
    // </Fade>
  )
}
