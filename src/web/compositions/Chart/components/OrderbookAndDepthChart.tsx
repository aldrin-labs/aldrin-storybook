import React from 'react'
import 'treemap-js'
var SortedMap = require('collections/sorted-map')

import { Grid } from '@material-ui/core'
import QueryRenderer from '@core/components/QueryRenderer'
import { ORDERS_MARKET_QUERY } from '@core/graphql/queries/chart/ORDERS_MARKET_QUERY'
import { ORDERBOOK } from '@core/graphql/subscriptions/ORDERBOOK'
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
} from '@core/utils/chartPageUtils'

let unsubscribe = Function

class OrderbookAndDepthChart extends React.Component {
  state = {
    readyForNewOrder: true,
    aggregation: 0.01,
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
    } = newProps

    let updatedData = null
    let updatedAggregatedData = state.aggregatedData

    // first get data from query
    if (
      asks.getLength() === 0 &&
      bids.getLength() === 0 &&
      marketOrders.asks &&
      marketOrders.bids &&
      testJSON(marketOrders.asks) &&
      testJSON(marketOrders.bids)
    ) {
      updatedData = transformOrderbookData({
        marketOrders,
        amountsMap,
        sizeDigits,
      })

      return {
        ...updatedData,
      }
    }

    if (
      !(typeof marketOrders.asks === 'string') ||
      !(typeof marketOrders.bids === 'string')
    ) {
      const ordersData = newProps.data.marketOrders
      const orderbookData = updatedData || { asks, bids }

      if (aggregation !== 0.01) {
        updatedAggregatedData = addOrdersToOrderbook({
          updatedData: updatedAggregatedData,
          ordersData,
          aggregation,
          originalOrderbookTree: { asks, bids },
          isAggregated: true,
          sizeDigits,
        })
      }

      updatedData = addOrdersToOrderbook({
        updatedData: orderbookData,
        ordersData,
        aggregation,
        originalOrderbookTree: { asks, bids },
        isAggregatedData: false,
        amountsMap,
        sizeDigits,
      })
    }

    return null
    // return {
    //   readyForNewOrder:
    //     readyForNewOrder === undefined ? true : readyForNewOrder,
    //   aggregatedData: updatedAggregatedData,
    //   ...updatedData,
    // }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.readyForNewOrder) {
      return true
    }

    return false
  }

  componentDidMount() {
    if (this.props.subscribeToMore) {
      //  unsubscribe from old exchange when you first time change exchange
      unsubscribe && unsubscribe()

      unsubscribe = this.props.subscribeToMore()
    }
  }

  componentDidUpdate(prevProps: IProps) {
    if (
      prevProps.activeExchange.symbol !== this.props.activeExchange.symbol ||
      prevProps.currencyPair !== this.props.currencyPair
    ) {
      // when change exchange delete all data and...
      this.setState({ asks: new TreeMap(), bids: new TreeMap() })

      //  unsubscribe from old exchange
      unsubscribe && unsubscribe()

      //  subscribe to new exchange and create new unsub link
      unsubscribe = this.props.subscribeToMore()
    }

    if (this.state.readyForNewOrder) {
      this.setState({ readyForNewOrder: false }, () =>
        setTimeout(() => this.setState({ readyForNewOrder: true }), 1000)
      )
    }
  }

  componentWillUnmount() {
    this.setState({ readyForNewOrder: false })
    unsubscribe && unsubscribe()
  }

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
      currencyPair,
      marketType,
      activeExchange,
      exchange,
      quote,
      updateTerminalPriceFromOrderbook,
    } = this.props
    const { asks, bids, aggregation, aggregatedData, amountsMap } = this.state

    const dataToSend = aggregation === 0.01 ? { asks, bids } : aggregatedData
    const amountForBackground = amountsMap.average()

    console.log('re-render orderbook')

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
            symbol={currencyPair}
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
            activeExchange={activeExchange}
            aggregation={aggregation}
            chartProps={chartProps}
            changeTable={changeTable}
            currencyPair={currencyPair}
            marketType={marketType}
            amountForBackground={amountForBackground}
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
  pair,
  marketType,
  activeExchange,
  exchange,
  updateTerminalPriceFromOrderbook,
  symbol,
  sizeDigits,
  quote,
}) => (
  <QueryRenderer
    component={OrderbookAndDepthChart}
    withOutSpinner
    withTableLoader={true}
    fetchPolicy="network-only"
    query={ORDERS_MARKET_QUERY}
    variables={{ symbol: symbol, exchange, marketType }}
    subscriptionArgs={{
      subscription: ORDERBOOK,
      variables: { symbol: symbol, exchange, marketType },
      updateQueryFunction: updateOrderBookQuerryFunction,
    }}
    {...{
      quote,
      symbol,
      activeExchange,
      currencyPair: pair,
      aggregation,
      sizeDigits,
      onButtonClick: changeTable,
      setOrders: chartProps.setOrders,
      updateTerminalPriceFromOrderbook,
      ...chartProps,
    }}
  />
)
