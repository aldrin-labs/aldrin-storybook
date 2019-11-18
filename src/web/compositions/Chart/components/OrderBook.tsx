import React from 'react'

import QueryRenderer from '@core/components/QueryRenderer'
import { ORDERS_MARKET_QUERY } from '@core/graphql/queries/chart/ORDERS_MARKET_QUERY'
import { ORDERBOOK } from '@core/graphql/subscriptions/ORDERBOOK'
import { updateOrderBookQuerryFunction } from '@core/utils/chartPageUtils'

import { OrderBookTable } from '../Tables/Tables'

import { OrderbookContainer } from '../Chart.styles'

export const OrderBook = ({
  chartProps,
  changeTable,
  aggregation,
  pair,
  activeExchange,
  exchange,
  symbol,
  quote,
  lastTradeData,
}) => (
  <OrderbookContainer key={`orderbook_table`}>
    <QueryRenderer
      component={OrderBookTable}
      withOutSpinner
      query={ORDERS_MARKET_QUERY}
      variables={{ symbol, exchange }}
      //fetchPolicy='network-only'
      subscriptionArgs={{
        subscription: ORDERBOOK,
        variables: { symbol, exchange },
        updateQueryFunction: updateOrderBookQuerryFunction,
      }}
      {...{
        quote,
        symbol,
        activeExchange,
        currencyPair: pair,
        aggregation,
        onButtonClick: changeTable,
        setOrders: chartProps.setOrders,
        lastTradeData,
        ...chartProps,
        key: 'orderbook_table_query_render',
      }}
    />
  </OrderbookContainer>
)
