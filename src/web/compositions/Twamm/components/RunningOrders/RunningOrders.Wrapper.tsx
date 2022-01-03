import React from 'react'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { DexTokensPrices } from '@sb/compositions/Pools/index.types'

import RunningOrdersTable from './RunningOrders'
import {PairSettings} from "@sb/dexUtils/twamm/types";

export const RunningOrdersWrapper = ({
  getDexTokensPricesQuery,
  pairSettings,
  selectedPairSettings
}: {
  getDexTokensPrices: DexTokensPrices[],
  pairSettings: PairSettings[],
  selectedPairSettings: PairSettings,
}) => {
  return (
    <RowContainer>
      <RunningOrdersTable
        getDexTokensPricesQuery={getDexTokensPricesQuery}
        pairSettings={pairSettings}
        selectedPairSettings={selectedPairSettings}
      />
    </RowContainer>
  )
}
