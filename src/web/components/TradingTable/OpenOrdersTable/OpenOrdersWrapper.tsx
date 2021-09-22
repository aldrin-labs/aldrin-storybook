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
        tab: tab,
        theme: theme,
        show: show,
        marketType: marketType,
        canceledOrders: canceledOrders,
        handlePairChange: handlePairChange,
        openOrders: openOrders,
        terminalViewMode: terminalViewMode,
      }}
    />
  )
}
