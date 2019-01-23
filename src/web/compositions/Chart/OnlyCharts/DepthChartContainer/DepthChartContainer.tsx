import React, { Component } from 'react'
import { connect } from 'react-redux'

import QueryRenderer from '@core/components/QueryRenderer'
import { ORDERS_MARKET_QUERY } from '@core/graphql/queries/chart/ORDERS_MARKET_QUERY'
import TransformDataToDepthChartComponent from './TransformDataToDepthChartComponent/TransformDataToDepthChartComponent'
import { IProps } from './DepthChartContainer.types'

class DepthChartContainer extends Component<IProps> {
  render() {
    const { activeExchange, base, quote } = this.props
    const symbol = `${base}_${quote}` || ''
    const exchange =
      activeExchange && activeExchange.exchange
        ? activeExchange.exchange.symbol
        : ''

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

const mapStateToProps = (store: any) => ({
  activeExchange: store.chart.activeExchange,
})

export default connect(mapStateToProps)(DepthChartContainer)
