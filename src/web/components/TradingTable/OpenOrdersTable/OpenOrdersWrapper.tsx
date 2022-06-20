import React from 'react'

import { useOpenOrders } from '@sb/dexUtils/markets'

import OpenOrdersTable from './OpenOrdersTable'

export const OpenOrdersTableWrapper = ({
  tab,
  theme,
  show,
  marketType,
  canceledOrders,
  handlePairChange,
  terminalViewMode,
}: {
  tab
  theme
  show
  marketType
  canceledOrders
  handlePairChange
  terminalViewMode
}) => {
  const openOrders = useOpenOrders()

  return (
    <OpenOrdersTable
      {...{
        tab,
        show,
        marketType,
        canceledOrders,
        handlePairChange,
        openOrders,
        terminalViewMode,
      }}
    />
  )
}
