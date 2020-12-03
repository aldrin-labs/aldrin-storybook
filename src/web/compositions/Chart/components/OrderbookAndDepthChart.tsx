import React from 'react'
import { compose } from 'recompose'
import { Grid } from '@material-ui/core'

import 'treemap-js'
// var SortedMap = require('collections/sorted-map')

import { client } from '@core/graphql/apolloClient'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { checkLoginStatus } from '@core/utils/loginUtils'
import { getOpenOrderHistory } from '@core/graphql/queries/chart/getOpenOrderHistory'
import { OPEN_ORDER_HISTORY } from '@core/graphql/subscriptions/OPEN_ORDER_HISTORY'
import {
  updateOpenOrderHistoryQuerryFunction,
} from '@sb/components/TradingTable/TradingTable.utils'
import { ORDERS_MARKET_QUERY } from '@core/graphql/queries/chart/ORDERS_MARKET_QUERY'
import { getTerminalData } from '@core/graphql/queries/chart/getTerminalData'

import {
  MOCKED_ORDERBOOK,
  ORDERBOOK,
} from '@core/graphql/subscriptions/ORDERBOOK'
import { OrderBookTableContainer, DepthChart } from '../components'
import { OrderbookContainer } from '../Chart.styles'
import {
  IProps,
  OrderbookGroup,
} from '../Tables/OrderBookTable/OrderBookTableContainer.types'

import {
  transformOrderbookData,
  addOrdersToOrderbook,
  addOrderToOrderbook,
  getAggregatedData,
  testJSON,
  getAggregationsFromMinPriceDigits,
  getNumberOfDecimalsFromNumber,
  combineOrderbookFromWebsocket,
  combineOrderbookFromFetch
} from '@core/utils/chartPageUtils'

import { withWebsocket } from '@core/hoc/withWebsocket'
import { withFetch } from '@core/hoc/withFetchHoc'
import { getUrlForFetch } from '@core/utils/getUrlForFetch'
import { getUrlForWebsocket } from '@core/utils/getUrlForWebsocket'

const gridStyles = { height: '100%' }
const obAndDepthChartContainerStyles = { display: 'flex', width: '100%', height: '100%' }
const MemoizedGrid = React.memo(Grid)
const MemoizedOrderbookContainer = React.memo(OrderbookContainer)

class OrderbookAndDepthChart extends React.PureComponent {
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
      fetchData,
      sizeDigits,
      isPairDataLoading,
      minPriceDigits,
    } = newProps

    let updatedData = null

    const marketOrders = fetchData

    // first get data from query
    if (
      asks.getLength() === 0 &&
      bids.getLength() === 0 &&
      marketOrders &&
      marketOrders.asks &&
      marketOrders.bids &&
      !isPairDataLoading
    ) {
      updatedData = addOrdersToOrderbook({
        updatedData: { asks, bids },
        ordersData: marketOrders,
        aggregation: getAggregationsFromMinPriceDigits(minPriceDigits)[0]
          .value,
        defaultAggregation: getAggregationsFromMinPriceDigits(
          minPriceDigits
        )[0].value,
        originalOrderbookTree: { asks, bids },
        isAggregatedData: false,
        sizeDigits,
      })

      return {
        ...updatedData,
        aggregation: getAggregationsFromMinPriceDigits(minPriceDigits)[0].value
      }
    }

    return null
  }

  componentDidUpdate(prevProps: IProps) {
    if (prevProps.data?.marketOrders?.asks.length !== this.props.data?.marketOrders?.asks.length) {
      const { asks, bids, readyForNewOrder, aggregation } = this.state

      const { sizeDigits, minPriceDigits, isPairDataLoading, data } = this.props
      if (
        (asks.getLength() === 0 && bids.getLength() === 0) ||
        isPairDataLoading || !aggregation
      ) {
        return
      }

      let updatedData = null
      let newResubscribeTimer = null
      let updatedAggregatedData = this.state.aggregatedData

      let ordersAsks = data.marketOrders.asks
      let ordersBids = data.marketOrders.bids

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
      changeTable,
      symbol,
      marketType,
      exchange,
      quote,
      base,
      selectedKey,
      data,
      minPriceDigits,
      arrayOfMarketIds,
      updateTerminalPriceFromOrderbook,
      hideDepthChart,
      sizeDigits,
      getOpenOrderHistoryQuery,
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
        style={obAndDepthChartContainerStyles}
      >
        {!hideDepthChart && (
          <MemoizedGrid
            item
            xs={5}
            style={gridStyles}
          >
            <DepthChart
              theme={theme}
              data={{
                asks,
                bids,
              }}
            />
          </MemoizedGrid>
        )}

        <MemoizedGrid
          item
          xs={hideDepthChart ? 12 : 7}
          id="orderbook"
          style={gridStyles}
        >
          <MemoizedOrderbookContainer key={`orderbook_table`} theme={theme}>
            <OrderBookTableContainer
              key={'orderbook_table_query_render'}
              data={dataToSend}
              getOpenOrderHistoryQuery={getOpenOrderHistoryQuery}
              quote={quote}
              base={base}
              symbol={symbol}
              exchange={exchange}
              aggregation={aggregation}
              sizeDigits={sizeDigits}
              minPriceDigits={minPriceDigits}
              selectedKey={selectedKey}
              arrayOfMarketIds={arrayOfMarketIds}
              marketType={marketType}
              marketOrders={marketOrders}
              theme={theme}
              onButtonClick={changeTable}
              setOrderbookAggregation={this.setOrderbookAggregation}
              addOrderToOrderbookTree={this.addOrderToOrderbookTree}
              updateTerminalPriceFromOrderbook={updateTerminalPriceFromOrderbook}
              // amountForBackground={amountForBackground}
            />
          </MemoizedOrderbookContainer>
        </MemoizedGrid>
      </div>
    )
  }
}

const OrderbookAndDepthChartDataWrapper = compose(
  queryRendererHoc({
    variables: (props) => ({
      openOrderInput: {
        activeExchangeKey: props.selectedKey.keyId,
        marketType: props.marketType,
        allKeys: true,
        page: 0,
        perPage: 30,
      },
    }),
    withOutSpinner: true,
    withTableLoader: false,
    withoutLoading: true,
    skip: !checkLoginStatus(),
    query: getOpenOrderHistory,
    name: `getOpenOrderHistoryQuery`,
    fetchPolicy: `cache-first`,
    subscriptionArgs: {
      subscription: OPEN_ORDER_HISTORY,
      variables: (props) => ({
        openOrderInput: {
          marketType: props.marketType,
          activeExchangeKey: props.selectedKey.keyId,
          allKeys: true,
        },
      }),
      updateQueryFunction: updateOpenOrderHistoryQuerryFunction,
    }
  }),
  withFetch({
    url: (props: any) => getUrlForFetch('OB', props.marketType, props.symbol, 100),
    onData: combineOrderbookFromFetch,
    pair: (props: any) => props.symbol,
    limit: 100,
  }),
  withWebsocket({
    url: (props: any) => getUrlForWebsocket('OB', props.marketType, props.symbol),
    onMessage: combineOrderbookFromWebsocket,
    pair: (props: any) => props.symbol
  })
)(OrderbookAndDepthChart)


const MemoizedOrderbookAndDepthChartDataWrapper = React.memo(OrderbookAndDepthChartDataWrapper)

export default MemoizedOrderbookAndDepthChartDataWrapper