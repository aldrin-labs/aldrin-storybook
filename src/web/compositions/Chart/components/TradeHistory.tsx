import React from 'react'

import QueryRenderer from '@core/components/QueryRenderer'
import {
  MOCKED_MARKET_TICKERS,
  MARKET_TICKERS,
} from '@core/graphql/subscriptions/MARKET_TICKERS'
import { MARKET_QUERY } from '@core/graphql/queries/chart/MARKET_QUERY'

import { updateTradeHistoryQuerryFunction } from '@core/utils/chartPageUtils'

import { TradeHistoryTable } from '../Tables/Tables'
import { TradeHistoryWrapper } from '../Chart.styles'
import { getUrlForWebsocket } from '@core/utils/getUrlForWebsocket'
import { combineTradeHistoryDataFromWebsocket } from '../Tables/TradeHistoryTable/utils'

export const TradeHistory = ({
  updateTerminalPriceFromOrderbook,
  showTableOnMobile,
  isPairDataLoading,
  activeExchange,
  minPriceDigits,
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
      key={`tradehistory_table`}
      className="ExchangesTable"
      variant={{
        show: showTableOnMobile === 'TRADE',
      }}
    >
      <TradeHistoryTable
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
          symbol,
          theme,
          updateTerminalPriceFromOrderbook,
          key: 'tradeyistory_table_query_render',
        }}
        isDataLoading={isPairDataLoading}
      />
    </TradeHistoryWrapper>
  )
}
