import React from 'react'

import { OrderbookContainer } from '../Chart.styles'
import { OrderBookTable } from '../Tables/Tables'

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
  markPrice,
  pricePrecision,
  terminalViewMode,
}) => {
  return (
    <OrderbookContainer key="orderbook_table">
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
          markPrice,
          ...chartProps,
          terminalViewMode,
          data,
          pricePrecision,
          key: 'orderbook_table_query_render',
        }}
      />
    </OrderbookContainer>
  )
}
