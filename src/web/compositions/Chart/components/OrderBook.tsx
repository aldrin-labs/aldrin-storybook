import React from 'react'

import { OrderBookTable } from '../Tables/Tables'
import { OrderbookContainer } from '../Chart.styles'

export const OrderBook = ({
  chartProps,
  changeTable,
  aggregation,
  exchange,
  marketType,
  symbol,
  quote,
  data,
  selectedKey,
  setOrderbookAggregation,
  amountForBackground,
  addOrderToOrderbookTree,
  updateTerminalPriceFromOrderbook,
  sizeDigits,
  minPriceDigits,
  arrayOfMarketIds,
  marketOrders,
}) => (
  <OrderbookContainer key={`orderbook_table`}>
    <OrderBookTable
      {...{
        quote,
        currencyPair: symbol,
        exchange,
        aggregation,
        marketType,
        marketOrders,
        setOrderbookAggregation,
        onButtonClick: changeTable,
        amountForBackground,
        addOrderToOrderbookTree,
        updateTerminalPriceFromOrderbook,
        sizeDigits,
        minPriceDigits,
        selectedKey,
        arrayOfMarketIds,
        ...chartProps,
        data,
        key: 'orderbook_table_query_render',
      }}
    />
  </OrderbookContainer>
)
