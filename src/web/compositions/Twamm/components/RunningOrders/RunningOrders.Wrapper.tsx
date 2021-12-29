import React from 'react'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { DexTokensPrices } from '@sb/compositions/Pools/index.types'

import RunningOrdersTable from './RunningOrders'

export const RunningOrdersWrapper = (getDexTokensPricesQuery: {
  getDexTokensPrices: DexTokensPrices[]
}) => {
  return (
    <RowContainer>
      <RunningOrdersTable getDexTokensPricesQuery={getDexTokensPricesQuery} />
    </RowContainer>
  )
}
