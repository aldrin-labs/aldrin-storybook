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
import { updateOpenOrderHistoryQuerryFunction } from '@sb/components/TradingTable/TradingTable.utils'
import { getTerminalData } from '@core/graphql/queries/chart/getTerminalData'
import { OrderBookTableContainer, DepthChart } from '../components'
import { OrderbookContainer } from '../Chart.styles'
import {
  IProps,
  OrderbookGroup,
} from '../Tables/OrderBookTable/OrderBookTableContainer.types'

import {
  addOrdersToOrderbook,
  addOrderToOrderbook,
  getAggregatedData,
  getDataFromTree,
  getAggregationsFromMinPriceDigits,
  getNumberOfDecimalsFromNumber,
  combineOrderbookFromFetch,
} from '@core/utils/chartPageUtils'

import { withFetch } from '@core/hoc/withFetchHoc'
import { getUrlForFetch } from '@core/utils/getUrlForFetch'

import worker from './worker.js';
import WebWorker from './workerSetup';

const gridStyles = { height: '100%' }
const obAndDepthChartContainerStyles = {
  display: 'flex',
  width: '100%',
  height: '100%',
}
const MemoizedGrid = React.memo(Grid)
const MemoizedOrderbookContainer = React.memo(OrderbookContainer)

class OrderbookAndDepthChart extends React.PureComponent {
  state = {
    queryDataLoaded: false,
    aggregation: 0,
    // asks: new TreeMap(),
    // bids: new TreeMap(),
    // aggregatedData: {
    //   asks: new TreeMap(),
    //   bids: new TreeMap(),
    // },
    webWorkerData: {
      asks: [],
      bids: [],
      aggregatedData: {
        asks: [],
        bids: [],
      },
    }
  }

  subscription: { unsubscribe: Function } | null

  // transforming data
  static getDerivedStateFromProps(newProps, state) {
    const { webWorkerData } = state
    const {
      fetchData,
      sizeDigits,
      isPairDataLoading,
      minPriceDigits,
    } = newProps

    let updatedData = null

    const marketOrders = fetchData

    // first get data from query
    if (
      webWorkerData.asks.length === 0 &&
      webWorkerData.bids.length === 0 &&
      marketOrders &&
      marketOrders.asks &&
      marketOrders.bids &&
      !isPairDataLoading
    ) {
      updatedData = addOrdersToOrderbook({
        updatedData: { asks: new TreeMap(), bids: new TreeMap() },
        ordersData: marketOrders,
        aggregation: getAggregationsFromMinPriceDigits(minPriceDigits)[0].value,
        defaultAggregation: getAggregationsFromMinPriceDigits(minPriceDigits)[0]
          .value,
        originalOrderbookTree: { asks: new TreeMap(), bids: new TreeMap() },
        isAggregatedData: false,
        sizeDigits,
      })

      // transform treemap to array
      return {
        webWorkerData: {
          asks: getDataFromTree(updatedData.asks, 'asks').reverse(),
          bids: getDataFromTree(updatedData.bids, 'bids').reverse(),
        },
        queryDataLoaded: true,
        aggregation: getAggregationsFromMinPriceDigits(minPriceDigits)[0].value,
      }
    }

    return null
  }

  componentDidMount() {
    this.worker = new WebWorker(worker);

    this.worker.addEventListener('message', e => {
      const isAggregatedData = e.data.isAggregatedData
			this.setState(prev => ({
        webWorkerData: {
          ...prev,
          ...(isAggregatedData ? {} : { asks: e.data.asks, bids: e.data.bids }),
          aggregatedData: {
            ...prev.aggregatedData,
            ...(!isAggregatedData ? {} : { asks: e.data.asks, bids: e.data.bids }),
          }
        }
      }))
    });

    if (!this.props.isPairDataLoading) {
      const { queryDataLoaded } = this.state
      const { sizeDigits, minPriceDigits, isPairDataLoading, data, marketType, symbol } = this.props

      const message = JSON.parse(
        JSON.stringify({
          aggregation: getAggregationsFromMinPriceDigits(minPriceDigits)[0].value,
          sizeDigits,
          minPriceDigits,
          isPairDataLoading,
          queryDataLoaded,
          marketType,
          symbol
        })
      )
  
      this.worker.postMessage(message);
    }
  }

  componentDidUpdate(prevProps: IProps, prevState) {
    const { queryDataLoaded } = this.state
    const { sizeDigits, minPriceDigits, isPairDataLoading, data, marketType, symbol, fetchData } = this.props

    const message = JSON.parse(
      JSON.stringify({
        aggregation: getAggregationsFromMinPriceDigits(minPriceDigits)[0].value,
        sizeDigits,
        minPriceDigits,
        isPairDataLoading,
        queryDataLoaded,
        marketType,
        symbol,
        marketOrders: fetchData,
      })
    )

    // update globalQueryDataLoaded in webworker when query data loaded
    if (this.state.queryDataLoaded !== prevState.queryDataLoaded) {
      const messageWithFirstData = JSON.parse(
        JSON.stringify({
          aggregation: getAggregationsFromMinPriceDigits(minPriceDigits)[0].value,
          sizeDigits,
          minPriceDigits,
          isPairDataLoading,
          queryDataLoaded,
          marketType,
          symbol,
          marketOrders: fetchData,
        })
      )

      this.worker.postMessage(messageWithFirstData);
    }

    // update sizeDigits + aggregation + minPriceDigits once pair data loaded
    if (this.props.isPairDataLoading !== prevProps.isPairDataLoading ) {
      this.worker.postMessage(message);
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

      this.worker.postMessage(message);
    }

    if (
      prevProps.exchange !== this.props.exchange ||
      prevProps.symbol !== this.props.symbol ||
      prevProps.marketType !== this.props.marketType
    ) {
      // add first data
      // not new webworker but new socket
      this.worker.terminate();
      this.worker = new WebWorker(worker);

      this.setState({
        webWorkerData: {
          asks: [],
          bids: [],
          aggregatedData: {
            asks: [],
            bids: [],
          },
        },
        queryDataLoaded: false,
      })

      this.worker.addEventListener('message', e => {
        const isAggregatedData = e.data.isAggregatedData;
        this.setState(prev => ({
          webWorkerData: {
            ...prev,
            ...(isAggregatedData ? {} : { asks: e.data.asks, bids: e.data.bids }),
            aggregatedData: {
              ...prev.aggregatedData,
              ...(!isAggregatedData ? {} : { asks: e.data.asks, bids: e.data.bids }),
            }
          }
        }))
      });

      const messageForNewWebsocket = JSON.parse(
        JSON.stringify({
          aggregation: getAggregationsFromMinPriceDigits(minPriceDigits)[0].value,
          sizeDigits,
          minPriceDigits,
          isPairDataLoading,
          queryDataLoaded,
          marketType,
          symbol
        })
      )

      this.worker.postMessage(messageForNewWebsocket)
    }
  }

  componentWillUnmount() {
    this.worker.terminate()
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

    const marketOrders = (data && data.marketOrders) || []
    const { aggregation } = this.state
    const { asks, bids, aggregatedData } = this.state.webWorkerData

    const dataToSend =
      String(aggregation) ===
      String(getAggregationsFromMinPriceDigits(minPriceDigits)[0].value)
        ? { asks, bids }
        : aggregatedData

    return (
      <div id="depthChartAndOB" style={obAndDepthChartContainerStyles}>
        {!hideDepthChart && (
          <MemoizedGrid item xs={5} style={gridStyles}>
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
              updateTerminalPriceFromOrderbook={
                updateTerminalPriceFromOrderbook
              }
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
    },
  }),
  withFetch({
    url: (props: any) =>
      getUrlForFetch('OB', props.marketType, props.symbol, 100),
    onData: combineOrderbookFromFetch,
    pair: (props: any) => props.symbol,
    limit: 50,
  }),
)(OrderbookAndDepthChart)

const MemoizedOrderbookAndDepthChartDataWrapper = React.memo(
  OrderbookAndDepthChartDataWrapper
)

export default MemoizedOrderbookAndDepthChartDataWrapper
