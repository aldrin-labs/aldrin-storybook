import React, { Component } from 'react'

import QueryRenderer, { queryRendererHoc } from '@core/components/QueryRenderer'
import { ORDERS_MARKET_QUERY } from '@core/graphql/queries/chart/ORDERS_MARKET_QUERY'
import { GET_ACTIVE_EXCHANGE } from '@core/graphql/queries/chart/getActiveExchange'
import TransformDataToDepthChartComponent from './TransformDataToDepthChartComponent/TransformDataToDepthChartComponent'
import { IProps } from './DepthChartContainer.types'

class DepthChartContainer extends Component<IProps> {
  render() {
    const {
      getActiveExchangeQuery: {
        chart: { activeExchange },
      },
      base,
      quote,
    } = this.props
    const symbol = `${base}_${quote}` || ''
    const exchange = activeExchange.symbol

    return (
      <QueryRenderer
        component={TransformDataToDepthChartComponent}
        pollInterval={1000}
        withOutSpinner={true}
        query={ORDERS_MARKET_QUERY}
        fetchPolicy="cache-and-network"
        variables={{ symbol, exchange }}
        {...this.props}
      />
    )
  }
}

export default queryRendererHoc({
  query: GET_ACTIVE_EXCHANGE,
  name: 'getActiveExchangeQuery',
})(DepthChartContainer)
