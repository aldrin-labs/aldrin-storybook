import React from 'react'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import RunninhOrdersTable from './OrdersHistory'

export const RunningOrdersWrapper = () => {
  return (
    <RowContainer>
      <RunninhOrdersTable />
    </RowContainer>
  )
}
