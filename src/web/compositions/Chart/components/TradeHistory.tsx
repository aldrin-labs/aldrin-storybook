import React from 'react'

import QueryRenderer from '@core/components/QueryRenderer'
import { MOCKED_MARKET_TICKERS, MARKET_TICKERS } from '@core/graphql/subscriptions/MARKET_TICKERS'
import { MARKET_QUERY } from '@core/graphql/queries/chart/MARKET_QUERY'

import { updateTradeHistoryQuerryFunction } from '@core/utils/chartPageUtils'

import { TradeHistoryTable } from '../Tables/Tables'
import { TradeHistoryWrapper } from '../Chart.styles'

export const TradeHistory = ({
  updateTerminalPriceFromOrderbook,
  showTableOnMobile,
  activeExchange,
  minPriceDigits,
  changeTable,
  chartProps,
  sizeDigits,
  marketType,
  exchange,
  symbol,
  quote,
  pair,
}) => {
  return (
    <TradeHistoryWrapper
      key={`tradehistory_table`}
      className="ExchangesTable"
      variant={{
        show: showTableOnMobile === 'TRADE',
      }}
    >
      <QueryRenderer
        component={TradeHistoryTable}
        withOutSpinner
        query={MARKET_QUERY}
        variables={{ symbol, exchange }}
        subscriptionArgs={{
          subscription: MARKET_TICKERS,
          variables: { symbol, exchange, marketType: String(marketType) },
          // subscription: MOCKED_MARKET_TICKERS,
          // variables: { time: 10000 },
          updateQueryFunction: updateTradeHistoryQuerryFunction,
        }}
        {...{
          quote,
          activeExchange,
          exchange,
          currencyPair: pair,
          showTableOnMobile,
          minPriceDigits,
          changeTable,
          chartProps,
          marketType,
          sizeDigits,
          updateTerminalPriceFromOrderbook,
          key: 'tradeyistory_table_query_render',
        }}
      />
    </TradeHistoryWrapper>
  )
}
