import React, { useState, useEffect } from 'react'
import 'treemap-js'

import { Grid } from '@material-ui/core'
import { OrderBook } from '../components'
import { useOrderbook, useMarkPrice } from '@sb/dexUtils/markets'

import {
  transformOrderbookData,
  getAggregatedData,
  getAggregationsFromPricePrecision,
} from '@core/utils/chartPageUtils'

import { useInterval } from '@sb/dexUtils/useInterval'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

const OrderbookAndDepthChart = (props) => {
  const {
    theme,
    chartProps,
    changeTable,
    symbol,
    marketType,
    exchange,
    quote,
    selectedKey,
    minPriceDigits,
    arrayOfMarketIds,
    updateTerminalPriceFromOrderbook,
    hideDepthChart,
    sizeDigits,
    terminalViewMode,
    pricePrecision: serumPricePrecision,
  } = props

  const { marketOrders = {} } = props.data || {
    marketOrders: {},
  }

  const markPrice = useMarkPrice()
  const [orderbook] = useOrderbook()
  const [prevOrderbook, setPrevOrderbook] = useState({})

  const pricePrecision =
    serumPricePrecision === undefined
      ? sizeDigits !== undefined
        ? 8
        : undefined
      : serumPricePrecision

  const [orderbookData, setOrderbookData] = useState({
    asks: new TreeMap(),
    bids: new TreeMap(),
  })

  const [aggregatedOrderbookData, setAggregatedOrderbookData] = useState({
    asks: new TreeMap(),
    bids: new TreeMap(),
  })

  const [aggregation, setAggregation] = useState(
    String(getAggregationsFromPricePrecision(pricePrecision)[0].value)
  )
  const [prevAggregation, setPrevAggregation] = useState(
    String(getAggregationsFromPricePrecision(pricePrecision)[0].value)
  )

  useEffect(
    () =>
      setAggregation(
        String(getAggregationsFromPricePrecision(pricePrecision)[0].value)
      ),
    [pricePrecision]
  )

  useInterval(() => {
    if (
      pricePrecision === undefined ||
      sizeDigits === undefined ||
      (!orderbook?.asks && !orderbook?.bids) ||
      (JSON.stringify(orderbook) === JSON.stringify(prevOrderbook) &&
        prevAggregation === aggregation)
    )
      return

    setPrevOrderbook(orderbook)
    setPrevAggregation(aggregation)

    const asks = orderbook.asks.map((row) => [row[0], [row[1], Date.now()]])
    const bids = orderbook.bids.map((row) => [row[0], [row[1], Date.now()]])

    const updatedData = transformOrderbookData({
      marketOrders: {
        asks,
        bids,
      },
      aggregation: +getAggregationsFromPricePrecision(pricePrecision)[0].value,
      sizeDigits: props.sizeDigits,
    })

    if (
      String(aggregation) !==
      String(getAggregationsFromPricePrecision(pricePrecision)[0].value)
    ) {
      const [aggregatedAsks] = getAggregatedData({
        orderbookData: updatedData.asks,
        aggregation: +aggregation,
        side: 'asks',
        sizeDigits,
      })

      const [aggregatedBids] = getAggregatedData({
        orderbookData: updatedData.bids,
        aggregation: +aggregation,
        side: 'bids',
        sizeDigits,
      })

      setAggregatedOrderbookData({
        asks: aggregatedAsks,
        bids: aggregatedBids,
      })
    }

    setOrderbookData({
      asks: updatedData.asks,
      bids: updatedData.bids,
    })

    return () =>
      setOrderbookData({
        asks: new TreeMap(),
        bids: new TreeMap(),
      })
  }, 250)

  const dataToSend =
    String(aggregation) ===
    String(getAggregationsFromPricePrecision(pricePrecision)[0].value)
      ? orderbookData
      : aggregatedOrderbookData

  return (
    <RowContainer id="depthChartAndOB" height="100%">
      <Grid
        item
        xs={hideDepthChart ? 12 : 7}
        id="orderbook"
        style={{ height: '100%' }}
      >
        <OrderBook
          theme={theme}
          exchange={exchange}
          aggregation={8}
          chartProps={chartProps}
          changeTable={changeTable}
          symbol={symbol}
          marketOrders={marketOrders}
          minPriceDigits={minPriceDigits}
          selectedKey={selectedKey}
          marketType={marketType}
          arrayOfMarketIds={arrayOfMarketIds}
          updateTerminalPriceFromOrderbook={updateTerminalPriceFromOrderbook}
          setOrderbookAggregation={setAggregation}
          quote={quote}
          markPrice={markPrice}
          pricePrecision={pricePrecision}
          data={dataToSend}
          terminalViewMode={terminalViewMode}
        />
      </Grid>
    </RowContainer>
  )
}

export { OrderbookAndDepthChart as APIWrapper }
