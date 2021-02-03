import React from 'react'
import memoizeOne from 'memoize-one'

import { TradeHistoryTable } from '../Tables/Tables'
import { TradeHistoryWrapper } from '../Chart.styles'

const MemoizedTradeHistoryWrapper = React.memo(TradeHistoryWrapper)

const getTradeHistoryWrapperVariant = memoizeOne((showTableOnMobile) => ({
  show: showTableOnMobile === 'TRADE',
}))

// create web worker
// connect it to compponentDidMount
// send message to webworker - this.worker.postMessage
// send message from webworker and receive it - self.onmessage - check in OB web worker

// hardcode url
// replace websocket to webworker, check how we receive message from websocket and console.log it - always nees socket.onopen
// send prodceessed data to tradeHistory

const TradeHistoryRaw = ({
  updateTerminalPriceFromOrderbook,
  showTableOnMobile,
  isPairDataLoading,
  activeExchange,
  minPriceDigits,
  changeTable,
  // chartProps,
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
      // variant={variant}
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
        // chartProps={chartProps}
        marketType={marketType}
        sizeDigits={sizeDigits}
        symbol={symbol}
        theme={theme}
        updateTerminalPriceFromOrderbook={updateTerminalPriceFromOrderbook}
        isPairDataLoading={isPairDataLoading}
      />
    </MemoizedTradeHistoryWrapper>
  )
}

export const TradeHistory = React.memo(TradeHistoryRaw)
