import React, { Component, PureComponent } from 'react'
import { compose } from 'recompose'

import dayjs from 'dayjs'
import TradeHistoryTable from './Table/TradeHistoryTable'
import ChartCardHeader from '@sb/components/ChartCardHeader'
// var SortedMap = require('collections/sorted-map')

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
import { withFetch } from '@core/hoc/withFetchHoc'
import { getUrlForWebsocket } from '@core/utils/getUrlForWebsocket'
import { getUrlForFetch } from '@core/utils/getUrlForFetch'
import { combineTradeHistoryDataFromWebsocket } from './utils'
import { combineTradeHistoryDataFromFetch } from './utils'

// let unsubscribe: Function | undefined

class TableContainer extends PureComponent<IProps, IState> {
  state: IState = {
    data: [],
    numbersAfterDecimalForPrice: 8,
  }

  // subscription: { unsubscribe: Function } | null

  static getDerivedStateFromProps(newProps: IProps, state: IState) {
    // query data processing
    if (
      state.data.length === 0 &&
      newProps.fetchData &&
      newProps.fetchData.length > 0
    ) {
      const updatedData = newProps.fetchData.map((trade, i) => ({
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



    // subscription data processing
    if (
      newProps.data &&
      newProps.data.length > 0
    ) {
      const tickersData = newProps.data

      if ( 
        !tickersData ||
        tickersData.length === 0 ||
        tickersData[0].symbol !== newProps.currencyPair ||
        tickersData[0].marketType != newProps.marketType
      ) {
          // console.log('TableContainer SUBSCRIPTION DATA FOR WRONG PAIR')
          return { numbersAfterDecimalForPrice: state.numbersAfterDecimalForPrice, data: [] }
      }

      const updatedData = reduceArrayLength(
        tickersData
          .map((trade) => ({
            ...trade,
            price: Number(trade.price).toFixed(
              getNumberOfDecimalsFromNumber(
                getAggregationsFromMinPriceDigits(
                  newProps.minPriceDigits
                )[0].value
              )
            ),
            time: dayjs.unix(+trade.timestamp).format('h:mm:ss a'),
          }))
          .concat(state.data)
      )

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

  componentDidUpdate(prevProps: IProps) {
    if (
      prevProps.activeExchange.symbol !== this.props.activeExchange.symbol ||
      prevProps.currencyPair !== this.props.currencyPair ||
      prevProps.marketType !== this.props.marketType
    ) {

      // console.log('TableContainer componentDidUpdate cleanState')
      // when change exchange delete all data and...
      this.setState({ data: [] }, () => {
        // console.log('TableContainer componentDidUpdate cleanState SUCCESS')
      })

      //  unsubscribe from old exchange
      // this.subscription && this.subscription.unsubscribe()

      //  subscribe to new exchange and create new unsub link
      // this.subscribe()
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
        <ChartCardHeader theme={theme}>Trade history</ChartCardHeader>
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
    url: (props: any) => getUrlForFetch('TH', props.marketType, props.symbol, 100),
    onData: combineTradeHistoryDataFromFetch,
    pair: (props: any) => props.symbol,
    limit: 100,
  }),
  withWebsocket({
    url: (props: any) => getUrlForWebsocket('TH', props.marketType, props.symbol),
    onMessage: combineTradeHistoryDataFromWebsocket,
    pair: (props: any) => props.symbol
  })
)(TableContainer)

export default React.memo(TradeHistoryWrapper, (prevProps: any, nextProps: any) => {

  const symbolIsEqual = prevProps.symbol === nextProps.symbol
  const marketTypeIsEqual = prevProps.marketType === nextProps.marketType
  const currencyPairIsEqual = prevProps.currencyPair === nextProps.prevProps

  if (
    symbolIsEqual &&
    marketTypeIsEqual &&
    currencyPairIsEqual
  ) {
    return true
  }

  return false
})