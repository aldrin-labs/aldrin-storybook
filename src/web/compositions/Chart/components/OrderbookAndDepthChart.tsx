import React, { useState, useEffect } from 'react'
import 'treemap-js'
var SortedMap = require('collections/sorted-map')

import { client } from '@core/graphql/apolloClient'
import { Grid } from '@material-ui/core'
import QueryRenderer from '@core/components/QueryRenderer'
import { ORDERS_MARKET_QUERY } from '@core/graphql/queries/chart/ORDERS_MARKET_QUERY'
import { getTerminalData } from '@core/graphql/queries/chart/getTerminalData'

import {
  MOCKED_ORDERBOOK,
  ORDERBOOK,
} from '@core/graphql/subscriptions/ORDERBOOK'
import { updateOrderBookQuerryFunction } from '@core/utils/chartPageUtils'
import { OrderBook, DepthChart } from '../components'
import {
  IProps,
  OrderbookGroup,
} from '../Tables/OrderBookTable/OrderBookTableContainer.types'

import { client } from '@core/graphql/apolloClient'
import { useOrderbook, useMarkPrice } from '@sb/dexUtils/markets'

import {
  transformOrderbookData,
  addOrdersToOrderbook,
  addOrderToOrderbook,
  getAggregatedData,
  testJSON,
  getAggregationsFromMinPriceDigits,
  getNumberOfDecimalsFromNumber,
} from '@core/utils/chartPageUtils'

import { useInterval } from '@sb/dexUtils/useInterval'

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
    isPairDataLoading,
    sizeDigits
  } = props

  const {
    marketOrders = {},
  } = props.data || {
    marketOrders: {},
  }

  const markPrice = useMarkPrice();
  const [orderbook] = useOrderbook()
  const [orderbookData, setOrderbookData] = useState({
    asks: new TreeMap(),
    bids: new TreeMap()
  });

  const [aggregatedOrderbookData, setAggregatedOrderbookData] = useState({
    asks: new TreeMap(),
    bids: new TreeMap()
  });

  const [aggregation, setAggregation] = useState("")

  useEffect(() => {
    if (!isPairDataLoading) {
      setAggregation(String(getAggregationsFromMinPriceDigits(minPriceDigits)[0].value))
    }
  }, [isPairDataLoading])

  useInterval(() => {
    if (props.isPairDataLoading || aggregation === "") return

    const asks = orderbook?.asks?.map(row => [row[0], [row[1], Date.now()]])
    const bids = orderbook?.bids?.map(row => [row[0], [row[1], Date.now()]])

    const updatedData = transformOrderbookData({
      marketOrders: {
        asks, bids
      },
      aggregation: +getAggregationsFromMinPriceDigits(minPriceDigits)[0].value,
      sizeDigits: props.sizeDigits,
    })

    if (
      String(aggregation) !==
      String(getAggregationsFromMinPriceDigits(minPriceDigits)[0].value)
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
        bids: aggregatedBids
      })
    }

    setOrderbookData({
      asks: updatedData.asks,
      bids: updatedData.bids
    })

    return () => setOrderbookData({
      asks: new TreeMap(),
      bids: new TreeMap()
    })
  }, 250)

  const dataToSend = String(aggregation) ===
    String(getAggregationsFromMinPriceDigits(minPriceDigits)[0].value)
    ? orderbookData
    : aggregatedOrderbookData

  return (
    <div
      id="depthChartAndOB"
      style={{ display: 'flex', width: '100%', height: '100%' }}
    >
      {!hideDepthChart && (
        <Grid
          item
          xs={5}
          style={{
            height: '100%',
          }}
        >
          <DepthChart
            theme={theme}
            chartProps={chartProps}
            changeTable={changeTable}
            exchange={exchange}
            symbol={symbol}
            data={{
              asks: new TreeMap(),
              bids: new TreeMap(),
            }}
          />
        </Grid>
      )}

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
          data={dataToSend}
        />
      </Grid>
    </div>
  )
}

export { OrderbookAndDepthChart as APIWrapper }
