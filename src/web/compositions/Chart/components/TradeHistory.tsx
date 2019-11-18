import React from 'react'

import { TradeHistoryTable } from '../Tables/Tables'

import { TradeHistoryWrapper } from '../Chart.styles'

export const TradeHistory = ({
  showTableOnMobile,
  quote,
  activeExchange,
  pair,
  data,
  ...rest
}) => (
  <TradeHistoryWrapper
    key={`tradehistory_table`}
    className='ExchangesTable'
    variant={{
      show: showTableOnMobile === 'TRADE',
    }}
  >
    <TradeHistoryTable
      {...{
        data,
        quote,
        activeExchange,
        currencyPair: pair,
        key: 'tradeyistory_table_query_render',
        ...rest,
      }}
    />
  </TradeHistoryWrapper>
)
