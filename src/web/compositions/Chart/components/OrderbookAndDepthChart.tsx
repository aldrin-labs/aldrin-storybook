import React from 'react'
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

import {
  transformOrderbookData,
  addOrdersToOrderbook,
  addOrderToOrderbook,
  getAggregatedData,
  testJSON,
  getAggregationsFromMinPriceDigits,
} from '@core/utils/chartPageUtils'

let unsubscribe = Function

class OrderbookAndDepthChart extends React.Component {
  state = {
    readyForNewOrder: true,
    aggregation: 0,
    resubscribeTimer: null,
    dataWasUpdated: true,
    amountsMap: new SortedMap(),
    asks: new TreeMap(),
    bids: new TreeMap(),
    aggregatedData: {
      asks: new TreeMap(),
      bids: new TreeMap(),
      amountsMap: new SortedMap(),
    },
  }

  subscription: { unsubscribe: Function } | null

  // transforming data
  static getDerivedStateFromProps(newProps, state) {
    const { asks, bids, readyForNewOrder, aggregation, amountsMap } = state
    const {
      data: { marketOrders },
      sizeDigits,
      isPairDataLoading,
      minPriceDigits,
    } = newProps

    let updatedData = null
    let newResubscribeTimer = null
    let updatedAggregatedData = state.aggregatedData

    // first get data from query
    if (
      asks.getLength() === 0 &&
      bids.getLength() === 0 &&
      marketOrders &&
      marketOrders.asks &&
      marketOrders.bids &&
      testJSON(marketOrders.asks) &&
      testJSON(marketOrders.bids) &&
      !isPairDataLoading
    ) {
      updatedData = transformOrderbookData({
        marketOrders,
        amountsMap,
        aggregation: getAggregationsFromMinPriceDigits(minPriceDigits)[0].value,
        sizeDigits,
      })

      return {
        ...updatedData,
      }
    }

    return {}
  }

  subscribe = () => {
    const that = this
    this.subscription = client
      .subscribe({
        query: ORDERBOOK,
        fetchPolicy: 'no-cache',
        variables: {
          marketType: this.props.marketType,
          exchange: this.props.exchange,
          symbol: this.props.symbol,
        },
      })
      .subscribe({
        next: ({ data }) => {
          const {
            asks,
            bids,
            readyForNewOrder,
            aggregation,
            amountsMap,
          } = that.state
          const { sizeDigits, minPriceDigits } = that.props

          if (asks.getLength() === 0 && bids.getLength() === 0) {
            return
          }

          let updatedData = null
          let newResubscribeTimer = null
          let updatedAggregatedData = that.state.aggregatedData

          const newOrders = data.listenOrderbook
          // const newOrders = subscriptionData.data.listenMockedOrderbook

          let ordersAsks = []
          let ordersBids = []

          if (newOrders.length > 0) {
            newOrders.forEach((order, i) => {
              const side = order.side.match(/ask/) ? 'asks' : 'bids'
              if (side === 'asks') {
                ordersAsks.push(order)
              } else {
                ordersBids.push(order)
              }
            })
          }

          const marketOrders = Object.assign(
            {
              asks: [],
              bids: [],
              __typename: 'orderbookOrder',
            },
            {
              asks: ordersAsks,
              bids: ordersBids,
            }
          )

          if (
            ((marketOrders.asks.length > 0 || marketOrders.bids.length > 0) &&
              !(typeof marketOrders.asks === 'string')) ||
            !(typeof marketOrders.bids === 'string')
          ) {
            const ordersData = marketOrders
            const orderbookData = updatedData || { asks, bids }

            // check that current pair and marketType === pair in new orders
            if (
              (ordersData.bids.length > 0 &&
                ordersData.bids[0].pair !==
                  `${that.props.symbol}_${that.props.marketType}`) ||
              (ordersData.asks.length > 0 &&
                ordersData.asks[0].pair !==
                  `${that.props.symbol}_${that.props.marketType}`)
            )
              return null

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
              aggregation: getAggregationsFromMinPriceDigits(minPriceDigits)[0]
                .value,
              originalOrderbookTree: { asks, bids },
              isAggregatedData: false,
              amountsMap,
              sizeDigits,
            })
          }

          that.setState({
            dataWasUpdated: true,
            resubscribeTimer: newResubscribeTimer,
            readyForNewOrder:
              readyForNewOrder === undefined ? true : readyForNewOrder,
            aggregation:
              aggregation === undefined || aggregation === 0
                ? String(
                    getAggregationsFromMinPriceDigits(minPriceDigits)[0].value
                  )
                : aggregation,
            aggregatedData: updatedAggregatedData,
            ...updatedData,
          })
        },
      })
  }

  componentDidMount() {
    clearInterval(this.state.resubscribeTimer)

    const resubscribeTimer = setInterval(() => {
      if (this.state.dataWasUpdated) {
        this.setState({ dataWasUpdated: false })
      } else {
        this.subscription && this.subscription.unsubscribe()
        this.subscribe()
      }
    }, 20000)

    this.subscribe()

    this.setState({
      // resubscribeTimer,
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
      this.subscription && this.subscription.unsubscribe()
      this.subscribe()
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

  componentWillUnmount() {
    this.setState({ readyForNewOrder: false })
    this.subscription && this.subscription.unsubscribe()
    clearInterval(this.state.resubscribeTimer)
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

  addOrderToOrderbookTree = async (data) => {
    const { asks, bids, aggregation, amountsMap, aggregatedData } = this.state

    const { sizeDigits, minPriceDigits, symbol, marketType } = this.props

    let marketPrice
    let updatedData = null
    let updatedAggregatedData = aggregatedData

    const orderbookData = { asks, bids }

    if (data.price === 'market') return null

    await client
      .query({
        query: getTerminalData,
        variables: {
          pair: `${symbol}:${marketType}`,
          exchange: 'binance',
        },
      })
      .then((getTerminalData) => {
        marketPrice = getTerminalData.data.getPrice

        const side = data.price > marketPrice ? 'asks' : 'bids'
        const orderData = {
          [side]: [{ ...data, side }],
          [side === 'asks' ? 'bids' : 'asks']: [],
        }

        if (
          String(aggregation) !==
          String(getAggregationsFromMinPriceDigits(minPriceDigits)[0].value)
        ) {
          updatedAggregatedData = addOrderToOrderbook({
            updatedData: updatedAggregatedData,
            orderData,
            aggregation,
            originalOrderbookTree: { asks, bids },
            isAggregatedData: true,
            sizeDigits,
          })
        }

        updatedData = addOrderToOrderbook({
          updatedData: orderbookData,
          orderData,
          aggregation: getAggregationsFromMinPriceDigits(minPriceDigits)[0]
            .value,
          originalOrderbookTree: { asks, bids },
          isAggregatedData: false,
          amountsMap,
          sizeDigits,
        })

        this.setState({
          aggregatedData: updatedAggregatedData,
          ...updatedData,
        })
      })

    return null
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
      data: { marketOrders },
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
      <div
        id="depthChartAndOB"
        style={{ display: 'flex', width: '100%', height: '100%' }}
      >
        <Grid
          item
          xs={5}
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
          xs={7}
          id="orderbook"
          style={{ height: '100%', padding: '0 .4rem .4rem .4rem' }}
        >
          <OrderBook
            exchange={exchange}
            aggregation={aggregation}
            chartProps={chartProps}
            changeTable={changeTable}
            symbol={symbol}
            marketOrders={marketOrders}
            minPriceDigits={minPriceDigits}
            selectedKey={selectedKey}
            marketType={marketType}
            amountForBackground={amountForBackground}
            arrayOfMarketIds={arrayOfMarketIds}
            updateTerminalPriceFromOrderbook={updateTerminalPriceFromOrderbook}
            setOrderbookAggregation={this.setOrderbookAggregation}
            addOrderToOrderbookTree={this.addOrderToOrderbookTree}
            quote={quote}
            data={dataToSend}
          />
        </Grid>
      </div>
    )
  }
}

export const APIWrapper = ({
  chartProps,
  changeTable,
  isPairDataLoading,
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
      withTableLoader={false}
      fetchPolicy="network-only"
      query={ORDERS_MARKET_QUERY}
      variables={{ symbol: symbol, exchange, marketType }}
      subscriptionArgs={{
        subscription: ORDERBOOK,
        variables: { symbol, exchange, marketType },
        // subscription: MOCKED_ORDERBOOK,
        // variables: { time: 10000, ordersPerTime: 100 },
        updateQueryFunction: updateOrderBookQuerryFunction,
      }}
      {...{
        quote,
        symbol,
        exchange,
        marketType,
        sizeDigits,
        selectedKey,
        minPriceDigits,
        arrayOfMarketIds,
        onButtonClick: changeTable,
        setOrders: chartProps.setOrders,
        updateTerminalPriceFromOrderbook,
        isPairDataLoading,
        ...chartProps,
      }}
      isDataLoading={isPairDataLoading}
      withoutLoading={true}
    />
  )
}
