import React from 'react'

import { OrderBookTable } from '../Tables/Tables'
import { OrderbookContainer } from '../Chart.styles'

export const OrderBook = ({
  chartProps,
  changeTable,
  aggregation,
  currencyPair,
  activeExchange,
  marketType,
  symbol,
  quote,
  data,
  setOrderbookAggregation,
  amountForBackground,
  updateTerminalPriceFromOrderbook,
  sizeDigits,
}) => (
  <OrderbookContainer key={`orderbook_table`}>
    <OrderBookTable
      {...{
        quote,
        symbol,
        activeExchange,
        currencyPair,
        aggregation,
        marketType,
        setOrderbookAggregation,
        onButtonClick: changeTable,
        amountForBackground,
        updateTerminalPriceFromOrderbook,
        sizeDigits,
        ...chartProps,
        data,
        key: 'orderbook_table_query_render',
      }}
    />
  </OrderbookContainer>
)
