import React from 'react'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import DepthChart from '../DepthChart'
import { GET_ORDERS } from '@core/graphql/queries/chart/getOrders'

const MainDepthChart = (props: any) => {
  const {
    getOrdersQuery: {
      orderbook: {
        orders: { asks, bids },
      },
    },
  } = props

  return <DepthChart asks={asks} bids={bids} {...props} />
}

export default queryRendererHoc({
  query: GET_ORDERS,
  name: 'getOrdersQuery',
})(MainDepthChart)
