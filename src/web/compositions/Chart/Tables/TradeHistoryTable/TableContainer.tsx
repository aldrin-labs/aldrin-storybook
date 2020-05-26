import React, { Component } from 'react'
import dayjs from 'dayjs'
import TradeHistoryTable from './Table/TradeHistoryTable'
import ChartCardHeader from '@sb/components/ChartCardHeader'
var SortedMap = require('collections/sorted-map')

import {
  reduceArrayLength,
  getNumberOfDigitsAfterDecimal,
  testJSON,
  getNumberOfDecimalsFromNumber,
  getAggregationsFromMinPriceDigits,
} from '@core/utils/chartPageUtils'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { MARKET_TICKERS } from '@core/graphql/subscriptions/MARKET_TICKERS'

import { client } from '@core/graphql/apolloClient'

import { IProps, IState } from './TableContainer.types'
import { withErrorFallback } from '@core/hoc/withErrorFallback'

let unsubscribe: Function | undefined

class TableContainer extends Component<IProps, IState> {
  state: IState = {
    data: [],
    numbersAfterDecimalForPrice: 8,
  }

  subscription: { unsubscribe: Function } | null

  static getDerivedStateFromProps(newProps: IProps, state: IState) {
    if (
      !(
        newProps.data &&
        newProps.data.marketTickers &&
        newProps.data.marketTickers.length > 0 &&
        newProps.data.marketTickers.length !== state.data.length
      )
    ) {
      //  if data is actually not a new data
      return null
    }

    // query data processing
    if (
      state.data.length === 0 &&
      newProps.data &&
      newProps.data.marketTickers &&
      newProps.data.marketTickers.length > 0
    ) {
      const updatedData = newProps.data.marketTickers.map((trade, i) => ({
        ...trade,
        price: Number(trade.price).toFixed(
          getNumberOfDecimalsFromNumber(
            getAggregationsFromMinPriceDigits(newProps.minPriceDigits)[0].value
          )
        ),
        time: dayjs.unix(+trade.timestamp).format('LTS'),
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

  subscribe = () => {
    const that = this
    this.subscription && this.subscription.unsubscribe()

    this.subscription = client
      .subscribe({
        query: MARKET_TICKERS,
        fetchPolicy: 'no-cache',
        variables: {
          marketType: String(this.props.marketType),
          exchange: this.props.exchange,
          symbol: this.props.symbol,
        },
      })
      .subscribe({
        next: ({ data }) => {
          if (
            data &&
            data.listenMarketTickers &&
            data.listenMarketTickers.length > 0
          ) {
            const tickersData = data.listenMarketTickers

            if (
              !tickersData ||
              tickersData.length === 0 ||
              tickersData[0].pair !== that.props.currencyPair ||
              tickersData[0].marketType != that.props.marketType
            ) {
              return null
            }

            const updatedData = reduceArrayLength(
              tickersData
                .map((trade) => ({
                  ...trade,
                  price: Number(trade.price).toFixed(
                    getNumberOfDecimalsFromNumber(
                      getAggregationsFromMinPriceDigits(
                        that.props.minPriceDigits
                      )[0].value
                    )
                  ),
                  time: new Date(trade.time).toLocaleTimeString(),
                }))
                .concat(that.state.data)
            )

            this.setState({
              data: updatedData,
            })
          }
        },
      })
  }

  componentDidMount() {
    this.subscribe()
  }

  componentDidUpdate(prevProps: IProps) {
    if (
      prevProps.activeExchange.symbol !== this.props.activeExchange.symbol ||
      prevProps.currencyPair !== this.props.currencyPair ||
      prevProps.marketType !== this.props.marketType
    ) {
      // when change exchange delete all data and...
      this.setState({ data: [] })

      //  unsubscribe from old exchange
      this.subscription && this.subscription.unsubscribe()

      //  subscribe to new exchange and create new unsub link
      this.subscribe()
    }
  }

  render() {
    const { quote, currencyPair, updateTerminalPriceFromOrderbook } = this.props
    const { data, numbersAfterDecimalForPrice } = this.state
    const amountForBackground = data.reduce((prev, curr) => prev + +curr.size, 0) / data.length

    return (
      <>
        <ChartCardHeader>Trade history</ChartCardHeader>
        <TradeHistoryTable
          data={data}
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

export default withErrorFallback(TableContainer)
