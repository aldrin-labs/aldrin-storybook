import React from 'react'

import { TradeHistoryWrapper } from '../Chart.styles'
import { TradeHistoryTable } from '../Tables/Tables'

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
    <>
      <TradeHistoryWrapper
        key="tradehistory_table"
        className="ExchangesTable"
        variant={{
          show: showTableOnMobile === 'TRADE',
        }}
      >
        <TradeHistoryTable
          {...{
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
            data: { marketTickers: [] },
          }}
        />

        {/* <QueryRenderer
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
          }} */}
        {/* // isDataLoading={isPairDataLoading} */}
        {/* /> */}
      </TradeHistoryWrapper>
    </>
  )
}
