import React from 'react'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import OrdersHistoryTable from './OrdersHistory'

export const OrdersHistoryWrapper = () => {
  return (
    <RowContainer>
      <OrdersHistoryTable />
    </RowContainer>
  )
}
