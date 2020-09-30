import React, { Component } from 'react'
import dayjs from 'dayjs'
import TradeHistoryTable from './Table/TradeHistoryTable'
import ChartCardHeader from '@sb/components/ChartCardHeader'
var SortedMap = require('collections/sorted-map')

import {
  reduceArrayLength,
  getNumberOfDigitsAfterDecimal,
  testJSON,
  getNumberOfDecimalsFromNumber,
  getAggregationsFromMinPriceDigits,
} from '@core/utils/chartPageUtils'

import { withErrorFallback } from '@core/hoc/withErrorFallback'

import { useTrades } from '@sb/dexUtils/markets'

const TableContainer = (props) => {
  const {
    quote,
    currencyPair,
    updateTerminalPriceFromOrderbook,
    theme,
  } = props

  const trades = useTrades()

  const updatedTrades = trades ? trades.map(trade => ({
    ...trade, price: Number(trade.price).toFixed(
      getNumberOfDecimalsFromNumber(
        getAggregationsFromMinPriceDigits(
          props.minPriceDigits
        )[0].value
      )
    ), time: new Date(Date.now()).toLocaleTimeString(),
  })) : []

  console.log(updatedTrades)

  const amountForBackground =
    updatedTrades.reduce((prev, curr) => prev + +curr.size, 0) / updatedTrades.length

  return (
    <>
      <ChartCardHeader theme={theme}>Trade history</ChartCardHeader>
      <TradeHistoryTable
        data={updatedTrades}
        theme={theme}
        updateTerminalPriceFromOrderbook={updateTerminalPriceFromOrderbook}
        quote={quote}
        amountForBackground={amountForBackground}
        currencyPair={currencyPair}
      />
    </>
  )
  // }
}

export default withErrorFallback(TableContainer)
