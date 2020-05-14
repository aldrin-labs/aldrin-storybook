import React, { Component } from 'react'
import dayjs from 'dayjs'
import TradeHistoryTable from './Table/TradeHistoryTable'
import ChartCardHeader from '@sb/components/ChartCardHeader'

import {
  reduceArrayLength,
  getNumberOfDigitsAfterDecimal,
  testJSON,
  getNumberOfDecimalsFromNumber,
  getAggregationsFromMinPriceDigits,
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
        newProps.data.marketTickers.length !== state.data.length
      )
    ) {
      //  if data is actually not a new data
      return null
    }

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

    if (
      newProps.data &&
      newProps.data.marketTickers &&
      newProps.data.marketTickers.length > 0
    ) {
      const tickersData = newProps.data.marketTickers

      if (
        !tickersData ||
        tickersData.length === 0 ||
        tickersData[0].pair !== newProps.currencyPair ||
        tickersData[0].marketType != newProps.marketType
      ) {
        return null
      }

      const updatedData = reduceArrayLength(
        tickersData
          .map((trade) => ({
            ...trade,
            price: Number(trade.price).toFixed(
              getNumberOfDecimalsFromNumber(
                getAggregationsFromMinPriceDigits(newProps.minPriceDigits)[0]
                  .value
              )
            ),
            time: new Date(trade.time).toLocaleTimeString(),
          }))
          .concat(state.data)
      )

      return {
        data: updatedData,
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

  render() {
    const { quote, currencyPair, updateTerminalPriceFromOrderbook } = this.props
    const { data, numbersAfterDecimalForPrice } = this.state
    return (
      <>
        <ChartCardHeader>Trade history</ChartCardHeader>
        <TradeHistoryTable
          data={data}
          numbersAfterDecimalForPrice={numbersAfterDecimalForPrice}
          updateTerminalPriceFromOrderbook={updateTerminalPriceFromOrderbook}
          quote={quote}
          currencyPair={currencyPair}
        />
      </>
    )
  }
}

export default withErrorFallback(TableContainer)
