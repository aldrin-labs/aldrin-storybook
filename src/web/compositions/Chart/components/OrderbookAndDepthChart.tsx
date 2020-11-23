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

import { withWebsocket } from '@core/hoc/withWebsocket'
import { adaptTickerSymbolToExchangeFormat } from '@core/utils/symbolAdapter'
import {
  transformOrderbookData,
  addOrdersToOrderbook,
  addOrderToOrderbook,
  getAggregatedData,
  testJSON,
  getAggregationsFromMinPriceDigits,
  getNumberOfDecimalsFromNumber,
} from '@core/utils/chartPageUtils'
import { getUrlForWebsocket } from '@core/utils/getUrlForWebsocket'
import { compose } from 'recompose'

let unsubscribe = Function

class OrderbookAndDepthChart extends React.Component {
  state = {
    readyForNewOrder: true,
    aggregation: 0,
    resubscribeTimer: null,
    dataWasUpdated: true,
    asks: new TreeMap(),
    bids: new TreeMap(),
    aggregatedData: {
      asks: new TreeMap(),
      bids: new TreeMap(),
    },
  }

  subscription: { unsubscribe: Function } | null

  // transforming data
  static getDerivedStateFromProps(newProps, state) {
    const { asks, bids } = state
    const {
      // BINANCE_TODO
      // here we should take data from binance OB query
      data,
      sizeDigits,
      isPairDataLoading,
      minPriceDigits,
    } = newProps

    let updatedData = null

    const marketOrders = data && data.marketOrders || []

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
    // this.subscription = client
    //   .subscribe({
    //     query: ORDERBOOK,
    //     fetchPolicy: 'no-cache',
    //     variables: {
    //       marketType: this.props.marketType,
    //       exchange: this.props.exchange,
    //       symbol: this.props.symbol,
    //     },
    //   })
    //   .subscribe({
    //     next: ({ data }) => {
    //       const { asks, bids, readyForNewOrder, aggregation } = that.state

    //       const { sizeDigits, minPriceDigits, isPairDataLoading } = that.props

    //       if (
    //         (asks.getLength() === 0 && bids.getLength() === 0) ||
    //         isPairDataLoading
    //       ) {
    //         return
    //       }

    //       let updatedData = null
    //       let newResubscribeTimer = null
    //       let updatedAggregatedData = that.state.aggregatedData

    //       const newOrders = data.listenOrderbook
    //       // const newOrders = subscriptionData.data.listenMockedOrderbook

    //       let ordersAsks = []
    //       let ordersBids = []

    //       if (newOrders.length > 0) {
    //         newOrders.forEach((order, i) => {
    //           const side = order.side.match(/ask/) ? 'asks' : 'bids'
    //           if (side === 'asks') {
    //             ordersAsks.push(order)
    //           } else {
    //             ordersBids.push(order)
    //           }
    //         })
    //       }

    //       const marketOrders = Object.assign(
    //         {
    //           asks: [],
    //           bids: [],
    //           __typename: 'orderbookOrder',
    //         },
    //         {
    //           asks: ordersAsks,
    //           bids: ordersBids,
    //         }
    //       )

    //       if (
    //         ((marketOrders.asks.length > 0 || marketOrders.bids.length > 0) &&
    //           !(typeof marketOrders.asks === 'string')) ||
    //         !(typeof marketOrders.bids === 'string')
    //       ) {
    //         const ordersData = marketOrders
    //         const orderbookData = updatedData || { asks, bids }

    //         // check that current pair and marketType === pair in new orders
    //         // if (
    //         //   (ordersData.bids.length > 0 &&
    //         //     ordersData.bids[0].pair !==
    //         //       `${that.props.symbol}_${that.props.marketType}`) ||
    //         //   (ordersData.asks.length > 0 &&
    //         //     ordersData.asks[0].pair !==
    //         //       `${that.props.symbol}_${that.props.marketType}`)
    //         // )
    //         //   return null

    //         if (
    //           String(aggregation) !==
    //           String(getAggregationsFromMinPriceDigits(minPriceDigits)[0].value)
    //         ) {
    //           updatedAggregatedData = addOrdersToOrderbook({
    //             updatedData: updatedAggregatedData,
    //             ordersData,
    //             aggregation,
    //             defaultAggregation: getAggregationsFromMinPriceDigits(
    //               this.props.minPriceDigits
    //             )[0].value,
    //             originalOrderbookTree: { asks, bids },
    //             isAggregatedData: true,
    //             sizeDigits,
    //           })
    //         }

    //         updatedData = addOrdersToOrderbook({
    //           updatedData: orderbookData,
    //           ordersData,
    //           aggregation: getAggregationsFromMinPriceDigits(minPriceDigits)[0]
    //             .value,
    //           defaultAggregation: getAggregationsFromMinPriceDigits(
    //             this.props.minPriceDigits
    //           )[0].value,
    //           originalOrderbookTree: { asks, bids },
    //           isAggregatedData: false,
    //           sizeDigits,
    //         })
    //       }

    //       that.setState({
    //         dataWasUpdated: true,
    //         resubscribeTimer: newResubscribeTimer,
    //         readyForNewOrder:
    //           readyForNewOrder === undefined ? true : readyForNewOrder,
    //         aggregation:
    //           aggregation === undefined || aggregation === 0
    //             ? String(
    //               getAggregationsFromMinPriceDigits(minPriceDigits)[0].value
    //             )
    //             : aggregation,
    //         aggregatedData: updatedAggregatedData,
    //         ...updatedData,
    //       })
    //     },
    //   })
  }

  componentDidUpdate(prevProps: IProps) {
    if (prevProps.data?.marketOrders?.asks.length !== this.props.data?.marketOrders?.asks.length) {
      const { asks, bids, readyForNewOrder, aggregation } = this.state

      const { sizeDigits, minPriceDigits, isPairDataLoading, data } = this.props
      if (
        // (asks.getLength() === 0 && bids.getLength() === 0) ||
        isPairDataLoading || !aggregation
      ) {
        return
      }

      let updatedData = null
      let newResubscribeTimer = null
      let updatedAggregatedData = this.state.aggregatedData

      let ordersAsks = data.marketOrders.asks.map(([price, size]) => ({ price, size, side: 'asks', timestamp: 0 }))
      let ordersBids = data.marketOrders.bids.map(([price, size]) => ({ price, size, side: 'bids', timestamp: 0 }))

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

        // check this current pair and marketType === pair in new orders
        // if (
        //   (ordersData.bids.length > 0 &&
        //     ordersData.bids[0].pair !==
        //       `${this.props.symbol}_${this.props.marketType}`) ||
        //   (ordersData.asks.length > 0 &&
        //     ordersData.asks[0].pair !==
        //       `${this.props.symbol}_${this.props.marketType}`)
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
            defaultAggregation: getAggregationsFromMinPriceDigits(
              this.props.minPriceDigits
            )[0].value,
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
          defaultAggregation: getAggregationsFromMinPriceDigits(
            this.props.minPriceDigits
          )[0].value,
          originalOrderbookTree: { asks, bids },
          isAggregatedData: false,
          sizeDigits,
        })
      }

      this.setState({
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
    // clearInterval(this.state.resubscribeTimer)
  }

  setOrderbookAggregation = (aggregation: OrderbookGroup) => {
    const { sizeDigits } = this.props

    const [asks] = getAggregatedData({
      orderbookData: this.state.asks,
      aggregation,
      side: 'asks',
      sizeDigits,
    })

    const [bids] = getAggregatedData({
      orderbookData: this.state.bids,
      aggregation,
      side: 'bids',
      sizeDigits,
    })

    this.setState({
      aggregation,
      aggregatedData: {
        bids,
        asks,
      },
    })
  }

  addOrderToOrderbookTree = async (data) => {
    const { asks, bids, aggregation, aggregatedData } = this.state

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
        const digitsByGroup =
          aggregation >= 1
            ? aggregation
            : getNumberOfDecimalsFromNumber(aggregation)

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
            side,
            digitsByGroup,
          })
        }

        updatedData = addOrderToOrderbook({
          updatedData: orderbookData,
          orderData,
          aggregation: getAggregationsFromMinPriceDigits(minPriceDigits)[0]
            .value,
          originalOrderbookTree: { asks, bids },
          isAggregatedData: false,
          sizeDigits,
          side,
          digitsByGroup,
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
      theme,
      chartProps,
      changeTable,
      symbol,
      marketType,
      exchange,
      quote,
      selectedKey,
      data,
      minPriceDigits,
      arrayOfMarketIds,
      updateTerminalPriceFromOrderbook,
      hideDepthChart,
    } = this.props

    const marketOrders = data && data.marketOrders || []

    const { asks, bids, aggregation, aggregatedData } = this.state

    const dataToSend =
      String(aggregation) ===
        String(getAggregationsFromMinPriceDigits(minPriceDigits)[0].value)
        ? { asks, bids }
        : aggregatedData

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
                asks,
                bids,
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
            aggregation={aggregation}
            chartProps={chartProps}
            changeTable={changeTable}
            symbol={symbol}
            marketOrders={marketOrders}
            minPriceDigits={minPriceDigits}
            selectedKey={selectedKey}
            marketType={marketType}
            // amountForBackground={amountForBackground}
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

const OrderbookAndDepthChartComponent = withWebsocket()((OrderbookAndDepthChart))


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
  hideDepthChart,
}) => {
  const url = getUrlForWebsocket('OB', marketType, symbol)
  console.log('url', url)

  return (
    <OrderbookAndDepthChartComponent
      component={OrderbookAndDepthChart}
      withOutSpinner
      withTableLoader={false}
      fetchPolicy="network-only"
      // query={ORDERS_MARKET_QUERY}
      variables={{ symbol: symbol, exchange, marketType }}
      // subscriptionArgs={{
      //   subscription: ORDERBOOK,
      //   variables: { symbol, exchange, marketType },
      //   // subscription: MOCKED_ORDERBOOK,
      //   // variables: { time: 10000, ordersPerTime: 100 },
      //   updateQueryFunction: updateOrderBookQuerryFunction,
      // }}
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
        hideDepthChart,
      }}
      isDataLoading={isPairDataLoading}
      withoutLoading={true}
      key={`${symbol}${marketType}`}
      url={url}
      onMessage={(msg, updateData) => {

        const data = JSON.parse(msg.data)

        updateData({ marketOrders: { asks: data.a, bids: data.b } })
      }}
    />
  )
}

