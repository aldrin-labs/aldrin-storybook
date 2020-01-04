import React from 'react'
import 'treemap-js'
var SortedMap = require('collections/sorted-map')

import { Grid } from '@material-ui/core'
import QueryRenderer from '@core/components/QueryRenderer'
import { ORDERS_MARKET_QUERY } from '@core/graphql/queries/chart/ORDERS_MARKET_QUERY'
import { MOCKED_ORDERBOOK, ORDERBOOK } from '@core/graphql/subscriptions/ORDERBOOK'
import { updateOrderBookQuerryFunction } from '@core/utils/chartPageUtils'
import { OrderBook, DepthChart } from '../components'
import {
  IProps,
  OrderbookGroup,
} from '../Tables/OrderBookTable/OrderBookTableContainer.types'

import {
  transformOrderbookData,
  addOrdersToOrderbook,
  getAggregatedData,
  testJSON,
  getAggregationsFromMinPriceDigits,
} from '@core/utils/chartPageUtils'

let unsubscribe = Function

class OrderbookAndDepthChart extends React.Component {
  state = {
    readyForNewOrder: true,
    aggregation: 0,
    amountsMap: new SortedMap(),
    asks: new TreeMap(),
    bids: new TreeMap(),
    aggregatedData: {
      asks: new TreeMap(),
      bids: new TreeMap(),
      amountsMap: new SortedMap(),
    },
  }

  // transforming data
  static getDerivedStateFromProps(newProps, state) {
    const { asks, bids, readyForNewOrder, aggregation, amountsMap } = state
    const {
      data: { marketOrders },
      sizeDigits,
      minPriceDigits,
    } = newProps

    let updatedData = null
    let updatedAggregatedData = state.aggregatedData

    // first get data from query
    // if (
    //   asks.getLength() === 0 &&
    //   bids.getLength() === 0 &&
    //   marketOrders.asks &&
    //   marketOrders.bids &&
    //   testJSON(marketOrders.asks) &&
    //   testJSON(marketOrders.bids)
    // ) {
    //   updatedData = transformOrderbookData({
    //     marketOrders,
    //     amountsMap,
    //     aggregation: getAggregationsFromMinPriceDigits(minPriceDigits)[0].value,
    //     sizeDigits,
    //   })
      
    //   return {
    //     ...updatedData,
    //   }
    // }

    if (
      !(typeof marketOrders.asks === 'string') ||
      !(typeof marketOrders.bids === 'string')
    ) {
      const ordersData = newProps.data.marketOrders
      const orderbookData = updatedData || { asks, bids }

      // check that current pair and marketType === pair in new orders
      // if (
      //   (ordersData.bids.length > 0 &&
      //     ordersData.bids[0].pair !==
      //       `${newProps.symbol}_${newProps.marketType}`) ||
      //   (ordersData.asks.length > 0 &&
      //     ordersData.asks[0].pair !==
      //       `${newProps.symbol}_${newProps.marketType}`)
      // )
      //   return null

      if (
        String(aggregation) !==
        String(getAggregationsFromMinPriceDigits(minPriceDigits)[0].value)
      ) {
        updatedAggregatedData = addOrdersToOrderbook({
          updatedData: updatedAggregatedData,
          ordersData,
          aggregation,
          originalOrderbookTree: { asks, bids },
          isAggregatedData: true,
          sizeDigits,
        })
      }

      updatedData = addOrdersToOrderbook({
        updatedData: orderbookData,
        ordersData,
        aggregation: getAggregationsFromMinPriceDigits(minPriceDigits)[0].value,
        originalOrderbookTree: { asks, bids },
        isAggregatedData: false,
        amountsMap,
        sizeDigits,
      })
    }

    return {
      readyForNewOrder:
        readyForNewOrder === undefined ? true : readyForNewOrder,
      aggregation:
        aggregation === undefined || aggregation === 0
          ? String(getAggregationsFromMinPriceDigits(minPriceDigits)[0].value)
          : aggregation,
      aggregatedData: updatedAggregatedData,
      ...updatedData,
    }
  }

  componentDidMount() {
    if (this.props.subscribeToMore) {
      //  unsubscribe from old exchange when you first time change exchange
      unsubscribe && unsubscribe()

      unsubscribe = this.props.subscribeToMore()
    }

    this.setState({
      aggregation: String(
        getAggregationsFromMinPriceDigits(this.props.minPriceDigits)[0].value
      ),
    })
  }

  componentDidUpdate(prevProps: IProps) {
    if (
      prevProps.exchange !== this.props.exchange ||
      prevProps.symbol !== this.props.symbol ||
      prevProps.marketType !== this.props.marketType
    ) {
      // when change exchange delete all data and...
      this.setState({
        asks: new TreeMap(),
        bids: new TreeMap(),
        amountsMap: new SortedMap(),
        aggregation: String(
          getAggregationsFromMinPriceDigits(this.props.minPriceDigits)[0].value
        ),
        aggregatedData: {
          asks: new TreeMap(),
          bids: new TreeMap(),
          amountsMap: new SortedMap(),
        },
      })

      //  unsubscribe from old exchange
      unsubscribe && unsubscribe()

      //  subscribe to new exchange and create new unsub link
      unsubscribe = this.props.subscribeToMore()
    }

    if (
      String(
        getAggregationsFromMinPriceDigits(prevProps.minPriceDigits)[0].value
      ) !==
      String(
        getAggregationsFromMinPriceDigits(this.props.minPriceDigits)[0].value
      )
    ) {
      this.setState({
        aggregation: String(
          getAggregationsFromMinPriceDigits(this.props.minPriceDigits)[0].value
        ),
      })
    }
  }

  // componentWillUnmount() {
  //   this.setState({ readyForNewOrder: false })
  //   unsubscribe && unsubscribe()
  // }

  setOrderbookAggregation = (aggregation: OrderbookGroup) => {
    const { sizeDigits } = this.props

    const [asks, amountsMapAsks] = getAggregatedData({
      orderbookData: this.state.asks,
      aggregation,
      side: 'asks',
      amountsMap: new SortedMap(),
      sizeDigits,
    })

    const [bids, amountsMapBids] = getAggregatedData({
      orderbookData: this.state.bids,
      aggregation,
      side: 'bids',
      amountsMap: amountsMapAsks,
      sizeDigits,
    })

    this.setState({
      aggregation,
      aggregatedData: {
        bids,
        asks,
        amountsMap: amountsMapBids,
      },
    })
  }

  render() {
    const {
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
    } = this.props

    const { asks, bids, aggregation, aggregatedData, amountsMap } = this.state

    const dataToSend =
      String(aggregation) ===
      String(getAggregationsFromMinPriceDigits(minPriceDigits)[0].value)
        ? { asks, bids }
        : aggregatedData

    const amountForBackground = amountsMap.average()

    return (
      <>
        <Grid
          item
          xs={4}
          style={{
            height: '100%',
            padding: '0 .4rem .4rem 0',
          }}
        >
          <DepthChart
            chartProps={chartProps}
            changeTable={changeTable}
            exchange={exchange}
            symbol={symbol}
            data={{
              asks,
              bids,
            }}
          />
        </Grid>

        <Grid
          item
          xs={8}
          id="orderbook"
          style={{ height: '100%', padding: '0 .4rem .4rem .4rem' }}
        >
          <OrderBook
            exchange={exchange}
            aggregation={aggregation}
            chartProps={chartProps}
            changeTable={changeTable}
            symbol={symbol}
            minPriceDigits={minPriceDigits}
            selectedKey={selectedKey}
            marketType={marketType}
            amountForBackground={amountForBackground}
            arrayOfMarketIds={arrayOfMarketIds}
            updateTerminalPriceFromOrderbook={updateTerminalPriceFromOrderbook}
            setOrderbookAggregation={this.setOrderbookAggregation}
            quote={quote}
            data={dataToSend}
          />
        </Grid>
      </>
    )
  }
}

export const APIWrapper = ({
  chartProps,
  changeTable,
  aggregation,
  marketType,
  exchange,
  minPriceDigits,
  arrayOfMarketIds,
  selectedKey,
  updateTerminalPriceFromOrderbook,
  symbol,
  sizeDigits,
  quote,
}) => {
  return (
    <QueryRenderer
      component={OrderbookAndDepthChart}
      withOutSpinner
      withTableLoader={true}
      fetchPolicy="network-only"
      query={ORDERS_MARKET_QUERY}
      variables={{ symbol: symbol, exchange, marketType }}
      subscriptionArgs={{
        // subscription: ORDERBOOK,
        // variables: { symbol, exchange, marketType },
        subscription: MOCKED_ORDERBOOK,
        variables: { time: 10000, ordersPerTime: 100 },
        updateQueryFunction: updateOrderBookQuerryFunction,
      }}
      {...{
        quote,
        symbol,
        exchange,
        aggregation,
        marketType,
        sizeDigits,
        selectedKey,
        minPriceDigits,
        arrayOfMarketIds,
        onButtonClick: changeTable,
        setOrders: chartProps.setOrders,
        updateTerminalPriceFromOrderbook,
        ...chartProps,
      }}
    />
  )
}
