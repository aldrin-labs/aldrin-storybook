import React, { Component, PureComponent } from 'react'
import { compose, shallowEqual } from 'recompose'

import dayjs from 'dayjs'
import TradeHistoryTable from './Table/TradeHistoryTable'
import ChartCardHeader from '@sb/components/ChartCardHeader'
// var SortedMap = require('collections/sorted-map')
import tradeHistoryWorker from './tradeHistoryWorker.js'
import WebWorker from '@sb/compositions/Chart/components/workerSetup'
import {
  reduceArrayLength,
  // testJSON,
  getNumberOfDecimalsFromNumber,
  getAggregationsFromMinPriceDigits,
} from '@core/utils/chartPageUtils'

import { IProps, IState } from './TableContainer.types'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { withFetch } from '@core/hoc/withFetchHoc'
import { getUrlForFetch } from '@core/utils/getUrlForFetch'
import { combineTradeHistoryDataFromFetch } from './utils'

// let unsubscribe: Function | undefined

const MemoizedChartCardHeader = React.memo(ChartCardHeader)

class TableContainer extends PureComponent<IProps, IState> {
  state: IState = {
    data: [],
  }

  static getDerivedStateFromProps(newProps: IProps, state: IState) {
    // query data processing

    console.log('newProps.fetchData out', newProps, state)
    if (
      state.data.length === 0 &&
      newProps.fetchData &&
      newProps.fetchData.length > 0 &&
      !newProps.isPairDataLoading &&
      newProps.fetchData[0].symbol === newProps.symbol
    ) {
      console.log('newProps.fetchData in', newProps, state)
      const updatedData = newProps.fetchData.reverse().map((trade, i) => ({
        ...trade,
        price: (+trade.price).toFixed(
          getNumberOfDecimalsFromNumber(
            getAggregationsFromMinPriceDigits(newProps.minPriceDigits)[0].value
          )
        ),
        time: dayjs.unix(trade.timestamp).format('h:mm:ss a'),
        id: `${trade.price}${trade.size}${i}${trade.timestamp}`,
      }))

      console.log('set new data', updatedData)

      return {
        isDataLoaded: true,
        data: reduceArrayLength(updatedData),
      }
    }

    return null
  }

  componentDidMount() {
    const that = this
    this.tradeHistoryWorker = new WebWorker(tradeHistoryWorker)

    this.tradeHistoryWorker.addEventListener('message', (e) => {
      if (!e.data || !that.state.isDataLoaded) return

      const proccesedData = e.data.map((trade) => ({
        ...trade,
        price: Number(trade.price).toFixed(
          getNumberOfDecimalsFromNumber(
            getAggregationsFromMinPriceDigits(that.props.minPriceDigits)[0]
              .value
          )
        ),
        time: dayjs.unix(+trade.timestamp).format('h:mm:ss a'),
      }))

      that.setState({ data: proccesedData })
    })
  }

  componentDidUpdate(prevProps: IProps, prevState) {
    // update globalQueryDataLoaded in webworker when query data loaded
    if (
      this.state.isDataLoaded !== prevState.isDataLoaded &&
      this.state.isDataLoaded
    ) {
      const messageWithFirstData = JSON.parse(
        JSON.stringify({
          isDataLoaded: this.state.isDataLoaded,
          marketType: this.props.marketType,
          pair: this.props.symbol,
          data: this.state.data,
        })
      )

      this.tradeHistoryWorker.postMessage(messageWithFirstData)
    }

    if (
      prevProps.exchange !== this.props.exchange ||
      prevProps.symbol !== this.props.symbol ||
      prevProps.marketType !== this.props.marketType
    ) {
      console.log('smth changed')

      const message = JSON.parse(
        JSON.stringify({
          isDataLoaded: false,
          marketType: this.props.marketType,
          pair: this.props.symbol,
          data: [],
          shouldChangeWebsocketUrl: true,
        })
      )

      this.setState({ data: [], isDataLoaded: false })
      this.tradeHistoryWorker.postMessage(message)
    }
  }

  render() {
    const {
      quote,
      currencyPair,
      updateTerminalPriceFromOrderbook,
      theme,
    } = this.props

    const { data } = this.state
    const amountForBackground =
      data.reduce((prev, curr) => prev + +curr.size, 0) / data.length

    return (
      <>
        <MemoizedChartCardHeader theme={theme}>
          Trade history
        </MemoizedChartCardHeader>
        <TradeHistoryTable
          data={data}
          theme={theme}
          updateTerminalPriceFromOrderbook={updateTerminalPriceFromOrderbook}
          quote={quote}
          amountForBackground={amountForBackground}
          currencyPair={currencyPair}
        />
      </>
    )
  }
}

const TradeHistoryWrapper = compose(
  // withWebsocket,
  withErrorFallback,
  withFetch({
    url: (props: any) =>
      getUrlForFetch('TH', props.marketType, props.symbol, 100),
    onData: (data: any, symbol: string) => combineTradeHistoryDataFromFetch(data, symbol),
    pair: (props: any) => props.symbol,
    limit: 60,
  })
)(TableContainer)

export default React.memo(
  TradeHistoryWrapper,
  (prevProps: any, nextProps: any) => {
    return shallowEqual(prevProps, nextProps)
  }
)
