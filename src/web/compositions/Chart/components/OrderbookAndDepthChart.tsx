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
import { useOrderbook } from '@sb/dexUtils/markets'

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
  // state = {
  //   readyForNewOrder: true,
  //   aggregation: 0,
  //   dataWasUpdated: true,
  //   asks: new TreeMap(),
  //   bids: new TreeMap(),
  //   aggregatedData: {
  //     asks: new TreeMap(),
  //     bids: new TreeMap(),
  //   },
  // }

  // subscription: { unsubscribe: Function } | null

  // transforming data
  // static getDerivedStateFromProps(newProps, state) {
  //   const { asks, bids } = state
  //   const {
  //     sizeDigits,
  //     isPairDataLoading,
  //     minPriceDigits,
  //   } = newProps

  //   let updatedData = null

  //   const {
  //     marketOrders = {},
  //   } = newProps.data || {
  //     marketOrders: {},
  //   }

  //   // first get data from query
  //   if (
  //     asks.getLength() === 0 &&
  //     bids.getLength() === 0 &&
  //     marketOrders &&
  //     marketOrders.asks &&
  //     marketOrders.bids &&
  //     testJSON(marketOrders.asks) &&
  //     testJSON(marketOrders.bids) &&
  //     !isPairDataLoading
  //   ) {
  //     updatedData = transformOrderbookData({
  //       marketOrders,
  //       aggregation: getAggregationsFromMinPriceDigits(minPriceDigits)[0].value,
  //       sizeDigits,
  //     })

  //     return {
  //       ...updatedData,
  //     }
  //   }

  //   return {}
  // }

  // subscribe = () => {
  //   const that = this
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
  // }

  // componentDidMount() {
  //   this.subscribe()

  //   this.setState({
  //     aggregation: String(
  //       getAggregationsFromMinPriceDigits(this.props.minPriceDigits)[0].value
  //     ),
  //   })
  // }

  // componentDidUpdate(prevProps: IProps) {
  //   if (
  //     prevProps.exchange !== this.props.exchange ||
  //     prevProps.symbol !== this.props.symbol ||
  //     prevProps.marketType !== this.props.marketType
  //   ) {
  //     // when change exchange delete all data and...
  //     this.setState({
  //       asks: new TreeMap(),
  //       bids: new TreeMap(),
  //       aggregation: String(
  //         getAggregationsFromMinPriceDigits(this.props.minPriceDigits)[0].value
  //       ),
  //       aggregatedData: {
  //         asks: new TreeMap(),
  //         bids: new TreeMap(),
  //       },
  //     })

  //     //  unsubscribe from old exchange
  //     this.subscription && this.subscription.unsubscribe()
  //     this.subscribe()
  //   }

  //   if (
  //     String(
  //       getAggregationsFromMinPriceDigits(prevProps.minPriceDigits)[0].value
  //     ) !==
  //     String(
  //       getAggregationsFromMinPriceDigits(this.props.minPriceDigits)[0].value
  //     )
  //   ) {
  //     this.setState({
  //       aggregation: String(
  //         getAggregationsFromMinPriceDigits(this.props.minPriceDigits)[0].value
  //       ),
  //     })
  //   }
  // }

  // componentWillUnmount() {
  //   this.setState({ readyForNewOrder: false })
  //   this.subscription && this.subscription.unsubscribe()
  // }

  // const setOrderbookAggregation = (aggregation: OrderbookGroup) => {
  //   const { sizeDigits } = this.props

  //   const [asks] = getAggregatedData({
  //     orderbookData: this.state.asks,
  //     aggregation,
  //     side: 'asks',
  //     sizeDigits,
  //   })

  //   const [bids] = getAggregatedData({
  //     orderbookData: this.state.bids,
  //     aggregation,
  //     side: 'bids',
  //     sizeDigits,
  //   })

  //   this.setState({
  //     aggregation,
  //     aggregatedData: {
  //       bids,
  //       asks,
  //     },
  //   })
  // }

  // const addOrderToOrderbookTree = async (data) => {
  //   const { asks, bids, aggregation, aggregatedData } = this.state

  //   const { sizeDigits, minPriceDigits, symbol, marketType } = this.props

  //   let marketPrice
  //   let updatedData = null
  //   let updatedAggregatedData = aggregatedData

  //   const orderbookData = { asks, bids }

  //   if (data.price === 'market') return null

  //   await client
  //     .query({
  //       query: getTerminalData,
  //       variables: {
  //         pair: `${symbol}:${marketType}`,
  //         exchange: 'binance',
  //       },
  //     })
  //     .then((getTerminalData) => {
  //       marketPrice = getTerminalData.data.getPrice

  //       const side = data.price > marketPrice ? 'asks' : 'bids'
  //       const orderData = {
  //         [side]: [{ ...data, side }],
  //         [side === 'asks' ? 'bids' : 'asks']: [],
  //       }
  //       const digitsByGroup =
  //         aggregation >= 1
  //           ? aggregation
  //           : getNumberOfDecimalsFromNumber(aggregation)

  //       if (
  //         String(aggregation) !==
  //         String(getAggregationsFromMinPriceDigits(minPriceDigits)[0].value)
  //       ) {
  //         updatedAggregatedData = addOrderToOrderbook({
  //           updatedData: updatedAggregatedData,
  //           orderData,
  //           aggregation,
  //           originalOrderbookTree: { asks, bids },
  //           isAggregatedData: true,
  //           sizeDigits,
  //           side,
  //           digitsByGroup,
  //         })
  //       }

  //       updatedData = addOrderToOrderbook({
  //         updatedData: orderbookData,
  //         orderData,
  //         aggregation: getAggregationsFromMinPriceDigits(minPriceDigits)[0]
  //           .value,
  //         originalOrderbookTree: { asks, bids },
  //         isAggregatedData: false,
  //         sizeDigits,
  //         side,
  //         digitsByGroup,
  //       })

  //       this.setState({
  //         aggregatedData: updatedAggregatedData,
  //         ...updatedData,
  //       })
  //     })

  //   return null
  // }

  // render() {
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

    if (
      String(aggregation) !==
      String(getAggregationsFromMinPriceDigits(minPriceDigits)[0].value)
    ) {

      const [aggregatedAsks] = getAggregatedData({
        orderbookData: orderbookData.asks,
        aggregation: +aggregation,
        side: 'asks',
        sizeDigits,
      })

      const [aggregatedBids] = getAggregatedData({
        orderbookData: orderbookData.bids,
        aggregation: +aggregation,
        side: 'bids',
        sizeDigits,
      })

      setAggregatedOrderbookData({
        asks: aggregatedAsks,
        bids: aggregatedBids
      })

    }

    const updatedData = transformOrderbookData({
      marketOrders: {
        asks, bids
      },
      aggregation: +getAggregationsFromMinPriceDigits(minPriceDigits)[0].value,
      sizeDigits: props.sizeDigits,
    })

    setOrderbookData({
      asks: updatedData.asks,
      bids: updatedData.bids
    })

    return () => setOrderbookData({
      asks: new TreeMap(),
      bids: new TreeMap()
    })
  }, 250)

  const dataToSend = orderbookData
  String(aggregation) ===
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
          // amountForBackground={amountForBackground}
          arrayOfMarketIds={arrayOfMarketIds}
          updateTerminalPriceFromOrderbook={updateTerminalPriceFromOrderbook}
          setOrderbookAggregation={setAggregation}
          // addOrderToOrderbookTree={this.addOrderToOrderbookTree}
          quote={quote}
          data={dataToSend}
        />
      </Grid>
    </div>
  )
}

export { OrderbookAndDepthChart as APIWrapper }
