import React from 'react'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import RunninhOrdersTable from './RunningOrders'

export const RunningOrdersWrapper = () => {
  return (
    <RowContainer>
      <RunninhOrdersTable />
    </RowContainer>
  )
}
