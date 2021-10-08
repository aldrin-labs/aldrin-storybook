import React, { Component } from 'react'
import dayjs from 'dayjs'
import ChartCardHeader from '@sb/components/ChartCardHeader'
import {
  reduceArrayLength,
  getNumberOfDigitsAfterDecimal,
} from '@core/utils/chartPageUtils'

import { MARKET_TICKERS } from '@core/graphql/subscriptions/MARKET_TICKERS'

import { client } from '@core/graphql/apolloClient'

import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { IProps, IState } from './TableContainer.types'
import TradeHistoryTable from './Table/TradeHistoryTable'

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
      newProps.data.marketTickers.length > 0 &&
      newProps.pricePrecision !== undefined &&
      newProps.sizeDigits !== undefined
    ) {
      const tickersData = [...newProps.data.marketTickers]

      const updatedData = tickersData
        .sort((a, b) => b.timestamp - a.timestamp)
        .map((trade, i) => ({
          ...trade,
          size: Number(trade.size).toFixed(newProps.sizeDigits),
          price: Number(trade.price).toFixed(newProps.pricePrecision),
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

    if (
      prevProps.pricePrecision !== this.props.pricePrecision ||
      prevProps.sizeDigits !== this.props.sizeDigits
    ) {
      const tickersData = [...this.props.data.marketTickers]

      const updatedData = tickersData
        .sort((a, b) => b.timestamp - a.timestamp)
        .map((trade, i) => ({
          ...trade,
          size: Number(trade.size).toFixed(this.props.sizeDigits),
          price: Number(trade.price).toFixed(this.props.pricePrecision),
          time: dayjs.unix(+trade.timestamp).format('LTS'),
          id: `${trade.price}${trade.size}${i}${trade.timestamp}`,
        }))

      this.setState({
        data: updatedData,
      })
    }
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
          exchange: 'serum',
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
            const pricePrecision =
              that.props.pricePrecision === undefined
                ? that.props.sizeDigits !== undefined
                  ? 8
                  : undefined
                : that.props.pricePrecision

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
                .sort((a, b) => b.time - a.time)
                .map((trade) => ({
                  ...trade,
                  size: Number(trade.size).toFixed(that.props.sizeDigits),
                  price: Number(trade.price).toFixed(pricePrecision),
                  time: dayjs.unix(+trade.timestamp).format('LTS'),
                }))
                .concat(that.state.data)
            )

            that.setState({
              data: updatedData,
            })
          }
        },
      })
  }

  render() {
    const {
      quote,
      currencyPair,
      updateTerminalPriceFromOrderbook,
      theme,
      sizeDigits,
    } = this.props
    const { data = [], numbersAfterDecimalForPrice } = this.state
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
          quantityPrecision={sizeDigits}
          amountForBackground={amountForBackground}
          currencyPair={currencyPair}
        />
      </>
    )
  }
}

export default withErrorFallback(TableContainer)
