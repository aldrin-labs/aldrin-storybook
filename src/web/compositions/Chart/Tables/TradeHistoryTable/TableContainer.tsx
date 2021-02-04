import React, { Component, PureComponent } from 'react'
import { compose } from 'recompose'

import dayjs from 'dayjs'
import TradeHistoryTable from './Table/TradeHistoryTable'
import ChartCardHeader from '@sb/components/ChartCardHeader'
// var SortedMap = require('collections/sorted-map')
import tradeHistoryWorker from './tradeHistoryWorker'
import WebWorker from '@sb/compositions/Chart/components/workerSetup'
import {
  reduceArrayLength,
  getNumberOfDigitsAfterDecimal,
  // testJSON,
  getNumberOfDecimalsFromNumber,
  getAggregationsFromMinPriceDigits,
} from '@core/utils/chartPageUtils'

// import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

// import { MARKET_TICKERS } from '@core/graphql/subscriptions/MARKET_TICKERS'

// import { client } from '@core/graphql/apolloClient'

import { IProps, IState } from './TableContainer.types'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { withWebsocket } from '@core/hoc/withWebsocket'
import { withBatching } from '@core/hoc/withBatching'
import { withFetch } from '@core/hoc/withFetchHoc'
import { getUrlForWebsocket } from '@core/utils/getUrlForWebsocket'
import { getUrlForFetch } from '@core/utils/getUrlForFetch'
import { combineTradeHistoryDataFromWebsocket } from './utils'
import { combineTradeHistoryDataFromFetch } from './utils'

// let unsubscribe: Function | undefined

const MemoizedChartCardHeader = React.memo(ChartCardHeader)

class TableContainer extends PureComponent<IProps, IState> {
  state: IState = {
    data: [],
    numbersAfterDecimalForPrice: 8,
  }

  static getDerivedStateFromProps(newProps: IProps, state: IState) {
    // query data processing
    if (
      state.data.length === 0 &&
      newProps.fetchData &&
      newProps.fetchData.length > 0 &&
      !newProps.isPairDataLoading
    ) {
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

      const numbersAfterDecimalForPrice = getNumberOfDigitsAfterDecimal(
        updatedData,
        'price'
      )

      return {
        numbersAfterDecimalForPrice,
        data: reduceArrayLength(updatedData),
      }
    }

    return null
  }

  componentDidMount() {
    this.tradeHistoryWorker = new WebWorker(tradeHistoryWorker)

    this.tradeHistoryWorker.addEventListener('message', (e) => {
      console.log('th received data', e)

      const proccesedData = e.data.map((trade) => ({
        ...trade,
        price: Number(trade.price).toFixed(
          getNumberOfDecimalsFromNumber(
            getAggregationsFromMinPriceDigits(this.props.minPriceDigits)[0]
              .value
          )
        ),
        time: dayjs.unix(+trade.timestamp).format('h:mm:ss a'),
      }))
      this.setState({ data: proccesedData })
    })

    const message = 'message'
    this.tradeHistoryWorker.postMessage(message)
  }

  componentDidUpdate(prevProps: IProps) {
    const prevPropsData = (prevProps.data &&
      prevProps.data.length > 0 &&
      prevProps.data[0]) || { size: 0, price: 0, timestamp: 0 }

    // subscription data processing
    if (
      this.state.data.length > 0 &&
      this.props.data &&
      this.props.data.length > 0 &&
      (this.props.data[0].timestamp !== prevPropsData.timestamp ||
        this.props.data[0].size !== prevPropsData.size ||
        this.props.data[0].price !== prevPropsData.price)
    ) {
      const tickersData = this.props.data

      if (
        !tickersData ||
        tickersData.length === 0 ||
        tickersData[0].symbol !== this.props.currencyPair
      ) {
        // console.log('TableContainer SUBSCRIPTION DATA FOR WRONG PAIR')
        this.setState({ data: [] })
      }

      const updatedData = reduceArrayLength(
        tickersData
          .map((trade) => ({
            ...trade,
            price: Number(trade.price).toFixed(
              getNumberOfDecimalsFromNumber(
                getAggregationsFromMinPriceDigits(this.props.minPriceDigits)[0]
                  .value
              )
            ),
            time: dayjs.unix(+trade.timestamp).format('h:mm:ss a'),
          }))
          .concat(this.state.data)
      )

      const numbersAfterDecimalForPrice = getNumberOfDigitsAfterDecimal(
        updatedData,
        'price'
      )

      this.setState({
        numbersAfterDecimalForPrice,
        data: reduceArrayLength(updatedData),
      })
    }

    if (
      prevProps.exchange !== this.props.exchange ||
      prevProps.currencyPair !== this.props.currencyPair ||
      prevProps.marketType !== this.props.marketType
    ) {
      // console.log('TableContainer componentDidUpdate cleanState')
      // when change exchange delete all data and...
      this.setState({ data: [] }, () => {
        // console.log('TableContainer componentDidUpdate cleanState SUCCESS')
      })
    }
  }

  render() {
    const {
      quote,
      currencyPair,
      updateTerminalPriceFromOrderbook,
      theme,
    } = this.props

    const { data, numbersAfterDecimalForPrice } = this.state
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
          numbersAfterDecimalForPrice={numbersAfterDecimalForPrice}
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
    onData: combineTradeHistoryDataFromFetch,
    pair: (props: any) => props.symbol,
    limit: 100,
  }),
  withBatching({
    data: (props: any) => props.data,
  })
)(TableContainer)

export default React.memo(
  TradeHistoryWrapper,
  (prevProps: any, nextProps: any) => {
    const symbolIsEqual = prevProps.symbol === nextProps.symbol
    const marketTypeIsEqual = prevProps.marketType === nextProps.marketType
    const currencyPairIsEqual = prevProps.currencyPair === nextProps.prevProps

    if (symbolIsEqual && marketTypeIsEqual && currencyPairIsEqual) {
      return true
    }

    return false
  }
)
