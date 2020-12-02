import React from 'react'

import QueryRenderer from '@core/components/QueryRenderer'
import { ORDERS_MARKET_QUERY } from '@core/graphql/queries/chart/ORDERS_MARKET_QUERY'
import { MARKET_ORDERS } from '@core/graphql/subscriptions/MARKET_ORDERS'
import { updateOrderBookQuerryFunction } from '@core/utils/chartPageUtils'

import ChartCardHeader from '@sb/components/ChartCardHeader'
import DepthChartComponent from '../DepthChart/DepthChart'

import { DepthChartContainer } from '../Chart.styles'

const MemoizedChartCardHeader = React.memo(ChartCardHeader)
const MemoizedDepthChartContainer = React.memo(DepthChartContainer)

const DepthChartRaw = ({
  theme,
  chartProps,
  changeTable,
  exchange,
  symbol,
  data,
}) => {
  return (
    <MemoizedDepthChartContainer theme={theme}>
      <MemoizedChartCardHeader theme={theme}>Depth chart</MemoizedChartCardHeader>
      <DepthChartComponent
        {...{
          onButtonClick: changeTable,
          data,
          ...chartProps,
          key: 'depth_chart_query_render',
        }}
      />
    </MemoizedDepthChartContainer>
  )
}

export const DepthChart = React.memo(DepthChartRaw)