import React, { Component } from 'react'

import TradeHistoryTable from './Table/TradeHistoryTable'
import ChartCardHeader from '@sb/components/ChartCardHeader'

import {
  reduceArrayLength,
  getNumberOfDigitsAfterDecimal,
  testJSON,
} from '@core/utils/chartPageUtils'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { IProps, IState } from './TableContainer.types'
import { withErrorFallback } from '@core/hoc/withErrorFallback'

let unsubscribe: Function | undefined

class TableContainer extends Component<IProps, IState> {
  state: IState = {
    data: [],
    numbersAfterDecimalForPrice: 8,
  }

  static getDerivedStateFromProps(newProps: IProps, state: IState) {
    if (
      !(
        newProps.data &&
        newProps.data.marketTickers &&
        newProps.data.marketTickers.length > 0 &&
        newProps.data.marketTickers.length !== state.data
      )
    ) {
      //  if data is actually not a new data
      return null
    }
    if (
      newProps.data &&
      newProps.data.marketTickers &&
      newProps.data.marketTickers.length > 0
    ) {
      const tickerData = testJSON(newProps.data.marketTickers[0])
        ? JSON.parse(newProps.data.marketTickers[0])
        : newProps.data.marketTickers[0]

      if (state.data.length > 0 && tickerData[6] === state.data[0].id) {
        return null
      }

      const ticker = {
        fall: tickerData[9],
        id: tickerData[6],
        size: stripDigitPlaces(tickerData[5], 8),
        price: stripDigitPlaces(tickerData[4], 2),
        time: new Date(tickerData[8]).toLocaleTimeString(),
      }

      const updatedData = [ticker].concat(state.data)
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
    if (this.props.subscribeToMore) {
      //  unsubscribe from old exchange when you first time change exchange
      unsubscribe && unsubscribe()

      unsubscribe = this.props.subscribeToMore()
    }
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
      unsubscribe && unsubscribe()

      //  subscribe to new exchange and create new unsub link
      unsubscribe = this.props.subscribeToMore()
    }
  }

  componentWillUnmount() {
    unsubscribe && unsubscribe()
  }

  render() {
    const { quote, currencyPair } = this.props
    const { data, numbersAfterDecimalForPrice } = this.state
    return (
      <>
        <ChartCardHeader>Trade history</ChartCardHeader>
        <TradeHistoryTable
          data={data}
          numbersAfterDecimalForPrice={numbersAfterDecimalForPrice}
          quote={quote}
          currencyPair={currencyPair}
        />
      </>
    )
  }
}

export default withErrorFallback(TableContainer)
