import React from 'react'
import { Grid } from '@material-ui/core'

import QueryRenderer from '@core/components/QueryRenderer'
import { MARKET_TICKERS } from '@core/graphql/subscriptions/MARKET_TICKERS'
import { MARKET_QUERY } from '@core/graphql/queries/chart/MARKET_QUERY'

import {
  updateTradeHistoryQuerryFunction,
} from '@core/utils/chartPageUtils'

import { TradeHistory, OrderBook } from './index'

const TradeHistoryAndOrderbook = ({
  showTableOnMobile,
  activeExchange,
  currencyPair,
  aggregation,
  changeTable,
  chartProps,
  exchange,
  quote,
  ...rest
}) => {
  console.log('rest', rest)

  return <>
    <Grid
      item
      xs={4}
      style={{ height: '100%', padding: '0 .4rem .4rem .4rem' }}
    >
      <OrderBook
        activeExchange={activeExchange}
        aggregation={aggregation}
        chartProps={chartProps}
        changeTable={changeTable}
        exchange={exchange}
        symbol={currencyPair}
        pair={currencyPair}
        quote={quote}
      />
    </Grid>
    <Grid
      item
      xs={4}
      style={{ height: '100%', padding: '0 0 .4rem .4rem' }}
    >
      <TradeHistory
        showTableOnMobile={showTableOnMobile}
        activeExchange={activeExchange}
        exchange={exchange}
        symbol={currencyPair}
        pair={currencyPair}
        quote={quote}
      />
    </Grid>
  </>
}

const APIWrapper = ({
  symbol,
  exchange,
  quote,
  activeExchange,
  pair,
  showTableOnMobile,
  aggregation,
  changeTable,
  chartProps,
}) => {
  return <QueryRenderer
    component={TradeHistoryAndOrderbook}
    withOutSpinner
    query={MARKET_QUERY}
    variables={{ symbol, exchange }}
    subscriptionArgs={{
      subscription: MARKET_TICKERS,
      variables: { symbol, exchange },
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
}

export { APIWrapper as TradeHistoryAndOrderbook }
