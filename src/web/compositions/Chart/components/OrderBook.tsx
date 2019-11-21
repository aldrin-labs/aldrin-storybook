import React from 'react'

import { OrderBookTable } from '../Tables/Tables'
import { OrderbookContainer } from '../Chart.styles'

export const OrderBook = ({
  chartProps,
  changeTable,
  aggregation,
  currencyPair,
  activeExchange,
  symbol,
  quote,
  data,
  setOrderbookAggregation,
}) => (
  <OrderbookContainer key={`orderbook_table`}>
    <OrderBookTable
      {...{
        quote,
        symbol,
        activeExchange,
        currencyPair,
        aggregation,
        setOrderbookAggregation,
        onButtonClick: changeTable,
        ...chartProps,
        data,
        key: 'orderbook_table_query_render',
      }}
    />
  </OrderbookContainer>
)
