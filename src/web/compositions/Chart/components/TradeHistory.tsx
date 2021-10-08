import React from 'react'

import QueryRenderer from '@core/components/QueryRenderer'
import { MARKET_QUERY } from '@core/graphql/queries/chart/MARKET_QUERY'

import { TradeHistoryTable } from '../Tables/Tables'
import { TradeHistoryWrapper } from '../Chart.styles'

export const TradeHistory = ({
  updateTerminalPriceFromOrderbook,
  showTableOnMobile,
  isPairDataLoading,
  activeExchange,
  minPriceDigits,
  pricePrecision,
  quantityPrecision,
  changeTable,
  chartProps,
  sizeDigits,
  marketType,
  exchange,
  theme,
  symbol,
  quote,
  pair,
}) => {
  return (
    <TradeHistoryWrapper
      theme={theme}
      key="tradehistory_table"
      className="ExchangesTable"
      variant={{
        show: showTableOnMobile === 'TRADE',
      }}
    >
      <QueryRenderer
        component={TradeHistoryTable}
        withOutSpinner
        query={MARKET_QUERY}
        variables={{ symbol, exchange: 'serum', marketType }}
        fetchPolicy="network-only"
        {...{
          quote,
          activeExchange,
          exchange,
          pricePrecision,
          quantityPrecision,
          currencyPair: pair,
          showTableOnMobile,
          minPriceDigits,
          changeTable,
          chartProps,
          marketType,
          sizeDigits,
          symbol,
          theme,
          updateTerminalPriceFromOrderbook,
          key: 'tradeyistory_table_query_render',
        }}
        // isDataLoading={isPairDataLoading}
      />
    </TradeHistoryWrapper>
  )
}
