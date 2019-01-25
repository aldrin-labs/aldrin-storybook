import React, { Component } from 'react'

import TradeHistoryTable from './Table/TradeHistoryTable'
import {
  maximumItemsInArray,
  getNumberOfDigitsAfterDecimal,
  testJSON,
} from '@core/utils/chartPageUtils'

import { IProps, IState } from './TableContainer.types'
import { withErrorFallback } from '@core/hoc/withErrorFallback'

let unsubscribe: Function | undefined

class TableContainer extends Component<IProps, IState> {
  state = {
    data: [],
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

      if (state.data.length > 0 && tickerData[5] === state.data[0].id) {
        return null
      }

      const fall =
        state.data.length > 0 ? state.data[0].price > tickerData[3] : false
      const ticker = {
        fall,
        id: tickerData[5],
        size: tickerData[4],
        price: tickerData[3],
        time: new Date(tickerData[7]).toLocaleTimeString(),
      }

      // temporary fix you should remove it when backend will be fixed
      if (+ticker.size === 35.4 && ticker.time === '16:30:37') {
        return null
      }

      return {
        data: maximumItemsInArray([ticker, ...state.data], 100, 40),
        numbersAfterDecimalForPrice: getNumberOfDigitsAfterDecimal(
          [ticker, ...state.data],
          'price'
        ),
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
      prevProps.activeExchange.index !== this.props.activeExchange.index ||
      prevProps.currencyPair !== this.props.currencyPair
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
    const { data, ...rest } = this.props
    return (
      <TradeHistoryTable
        data={this.state.data}
        numbersAfterDecimalForPrice={this.state.numbersAfterDecimalForPrice}
        {...rest}
      />
    )
  }
}

export default withErrorFallback(TableContainer)
