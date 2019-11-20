import React from 'react'

import QueryRenderer from '@core/components/QueryRenderer'
import { MARKET_TICKERS } from '@core/graphql/subscriptions/MARKET_TICKERS'
import { MARKET_QUERY } from '@core/graphql/queries/chart/MARKET_QUERY'

import { updateTradeHistoryQuerryFunction } from '@core/utils/chartPageUtils'

import { TradeHistoryTable } from '../Tables/Tables'
import { TradeHistoryWrapper } from '../Chart.styles'

export const TradeHistory = ({
  showTableOnMobile,
  activeExchange,
  aggregation,
  changeTable,
  chartProps,
  exchange,
  symbol,
  quote,
  pair,
}) => (
  <TradeHistoryWrapper
    key={`tradehistory_table`}
    className='ExchangesTable'
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
        variables: { symbol, exchange, marketType: '0' },
        updateQueryFunction: updateTradeHistoryQuerryFunction,
      }}
      {...{
        quote,
        activeExchange,
        exchange,
        currencyPair: pair,
        showTableOnMobile,
        aggregation,
        changeTable,
        chartProps,
        key: 'tradeyistory_table_query_render',
      }}
    />
  </TradeHistoryWrapper>
)
