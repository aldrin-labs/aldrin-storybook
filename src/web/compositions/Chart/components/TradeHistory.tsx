import React from 'react'

import { TradeHistoryTable } from '../Tables/Tables'
import { TradeHistoryWrapper } from '../Chart.styles'

const MemoizedTradeHistoryWrapper = React.memo(TradeHistoryWrapper)

const TradeHistoryWrapperVariant = {
  show: showTableOnMobile === 'TRADE',
}

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
    <MemoizedTradeHistoryWrapper
      theme={theme}
      key={`tradehistory_table`}
      className="ExchangesTable"
      variant={TradeHistoryWrapperVariant}
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
