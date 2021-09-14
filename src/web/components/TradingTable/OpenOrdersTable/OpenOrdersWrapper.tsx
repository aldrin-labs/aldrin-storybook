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
}: {
  tab
  theme
  show
  marketType
  canceledOrders
  handlePairChange
}) => {
  const openOrders = useOpenOrders()

  return (
    <OpenOrdersTable
      {...{
        tab,
        theme,
        show,
        marketType,
        canceledOrders,
        handlePairChange,
        openOrders,
      }}
    />
  )
}
