import React from 'react'

import { TradeHistoryTable } from '../Tables/Tables'
import { TradeHistoryWrapper } from '../Chart.styles'

const MemoizedTradeHistoryWrapper = React.memo(TradeHistoryWrapper)

const TradeHistoryWrapperVariant = (showTableOnMobile) => ({
  show: showTableOnMobile === 'TRADE',
})

const TradeHistoryRaw = ({
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
        key={'tradeyistory_table_query_render'}
        quote={quote}
        activeExchange={activeExchange}
        exchange={exchange}
        currencyPair={pair}
        showTableOnMobile={showTableOnMobile}
        minPriceDigits={minPriceDigits}
        changeTable={changeTable}
        chartProps={chartProps}
        marketType={marketType}
        sizeDigits={sizeDigits}
        symbol={symbol}
        theme={theme}
        updateTerminalPriceFromOrderbook={updateTerminalPriceFromOrderbook}
        isDataLoading={isPairDataLoading}
      />
    </MemoizedTradeHistoryWrapper>
  )
}

export const TradeHistory = React.memo(TradeHistoryRaw)
