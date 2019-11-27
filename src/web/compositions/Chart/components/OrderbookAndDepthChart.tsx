import React from 'react'
import TreeMap from 'treemap-js'
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
  addOrderToOrderbook,
  testJSON,
} from '@core/utils/chartPageUtils'

let unsubscribe = Function

class OrderbookAndDepthChart extends React.Component {
  state = {
    readyForNewOrder: true,
    aggregation: 0.01,
    asks: new TreeMap(),
    bids: new TreeMap(),
    aggregatedData: {
      asks: new TreeMap(),
      bids: new TreeMap(),
    },
  }

  // transforming data
  static getDerivedStateFromProps(newProps, state) {
    const { asks, bids, readyForNewOrder } = state
    const {
      data: { marketOrders },
    } = newProps

    let updatedData = null

    // first get data from query
    if (
      asks.size === 0 &&
      bids.size === 0 &&
      marketOrders.asks &&
      marketOrders.bids &&
      testJSON(marketOrders.asks) &&
      testJSON(marketOrders.bids)
    ) {
      updatedData = transformOrderbookData({ marketOrders })
    }

    if (
      !(typeof marketOrders.asks === 'string') ||
      !(typeof marketOrders.bids === 'string')
    ) {
      const orderData = newProps.data.marketOrders
      const orderbookData = updatedData || { asks, bids }

      updatedData = addOrderToOrderbook(orderbookData, orderData)
    }

    return {
      readyForNewOrder:
        readyForNewOrder === undefined ? true : readyForNewOrder,
      ...updatedData,
    }
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
        setTimeout(() => this.setState({ readyForNewOrder: true }), 100)
      )
    }
  }

  setOrderbookAggregation = (aggregation: OrderbookGroup) => {
    this.setState({ aggregation })
    // update aggregatedData
  }

  render() {
    const {
      chartProps,
      changeTable,
      aggregation,
      currencyPair,
      activeExchange,
      exchange,
      quote,
    } = this.props
    const { asks, bids } = this.state

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
          xs={4}
          id='orderbook'
          style={{ height: '100%', padding: '0 .4rem .4rem .4rem' }}
        >
          <OrderBook
            activeExchange={activeExchange}
            aggregation={aggregation}
            chartProps={chartProps}
            changeTable={changeTable}
            currencyPair={currencyPair}
            setOrderbookAggregation={this.setOrderbookAggregation}
            quote={quote}
            data={{
              asks,
              bids,
            }}
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
  activeExchange,
  exchange,
  symbol,
  quote,
}) => (
  <QueryRenderer
    component={OrderbookAndDepthChart}
    withOutSpinner
    query={ORDERS_MARKET_QUERY}
    variables={{ symbol, exchange }}
    fetchPolicy='network-only'
    subscriptionArgs={{
      subscription: ORDERBOOK,
      variables: { symbol: `${symbol}_0`, exchange },
      updateQueryFunction: updateOrderBookQuerryFunction,
    }}
    {...{
      quote,
      symbol,
      activeExchange,
      currencyPair: pair,
      aggregation,
      onButtonClick: changeTable,
      setOrders: chartProps.setOrders,
      ...chartProps,
    }}
  />
)
