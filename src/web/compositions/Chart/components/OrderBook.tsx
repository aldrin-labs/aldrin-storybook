import React from 'react'

import { OrderBookTable } from '../Tables/Tables'
import { OrderbookContainer } from '../Chart.styles'

export const OrderBook = ({
  theme,
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
    <OrderbookContainer key={`orderbook_table`} theme={theme}>
      <OrderBookTable
        {...{
          quote,
          theme,
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
