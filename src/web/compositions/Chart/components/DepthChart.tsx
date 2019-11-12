import React from 'react'

import QueryRenderer from '@core/components/QueryRenderer'
import { ORDERS_MARKET_QUERY } from '@core/graphql/queries/chart/ORDERS_MARKET_QUERY'
import { MARKET_ORDERS } from '@core/graphql/subscriptions/MARKET_ORDERS'
import {
  updateOrderBookQuerryFunction,
} from '@core/utils/chartPageUtils'

import ChartCardHeader from '@sb/components/ChartCardHeader'
import DepthChartComponent from '../DepthChart/DepthChart'

import {
  DepthChartContainer,
} from '../Chart.styles'

export const DepthChart = ({ chartProps, changeTable, exchange, symbol }) => {
  return (
    <DepthChartContainer>
      <ChartCardHeader>Depth chart</ChartCardHeader>
      <QueryRenderer
        component={DepthChartComponent}
        withOutSpinner
        query={ORDERS_MARKET_QUERY}
        variables={{ symbol, exchange }}
        subscriptionArgs={{
          subscription: MARKET_ORDERS,
          variables: { symbol, exchange },
          updateQueryFunction: updateOrderBookQuerryFunction,
        }}
        {...{
          onButtonClick: changeTable,
          ...chartProps,
          key: 'depth_chart_query_render',
        }}
      />
    </DepthChartContainer>
  )
}
