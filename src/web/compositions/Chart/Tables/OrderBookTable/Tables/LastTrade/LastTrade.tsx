import React from 'react'

import {
  LastTradeContainer,
  LastTradeValue,
  LastTradePrice,
  ArrowIcon,
} from './LastTrade.styles'

import { OrderbookMode } from '../../OrderBookTableContainer.types'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { addMainSymbol } from '@sb/components/index'

import QueryRenderer from '@core/components/QueryRenderer'
import { MARKET_TICKERS } from '@core/graphql/subscriptions/MARKET_TICKERS'
import { MARKET_QUERY } from '@core/graphql/queries/chart/MARKET_QUERY'

import { updateTradeHistoryQuerryFunction } from '@core/utils/chartPageUtils'

import { getPriceFromLastTrade } from '@core/utils/chartPageUtils'

interface IProps {
  data: { marketTickers: [string] }
  group: number
  mode: OrderbookMode
}

class LastTrade extends React.Component<IProps> {
  state = {
    prevTradePrice: 0,
    currentTradePrice: 0,
  }

  unsubscribeFunction: null | Function = null

  static getDerivedStateFromProps(props: IProps, state) {
    const { data } = props
    const lastTradePrice = getPriceFromLastTrade(data)

    return {
      prevTradePrice: state.currentTradePrice,
      currentTradePrice: lastTradePrice,
    }
  }

  componentDidMount() {
    this.unsubscribeFunction = this.props.subscribeToMore()
  }

  componentWillUnmount = () => {
    // unsubscribe subscription
    if (this.unsubscribeFunction !== null) {
      this.unsubscribeFunction()
    }
  }
  render() {
    const { mode } = this.props

    if (mode !== 'both') {
      return null
    }

    const { prevTradePrice, currentTradePrice } = this.state
    const fall = prevTradePrice > currentTradePrice

    return (
      <LastTradeContainer>
        <LastTradeValue fall={fall}>
          <ArrowIcon fall={fall} />
          {addMainSymbol(stripDigitPlaces(currentTradePrice, 2), true)}
        </LastTradeValue>
        <LastTradePrice>
          {addMainSymbol(stripDigitPlaces(currentTradePrice, 2), true)}
        </LastTradePrice>
      </LastTradeContainer>
    )
  }
}

const APIWrapper = (props) => {
  return (
    <QueryRenderer
      component={LastTrade}
      withOutSpinner
      query={MARKET_QUERY}
      variables={{ symbol: props.symbol, exchange: props.exchange }}
      subscriptionArgs={{
        subscription: MARKET_TICKERS,
        variables: { symbol: props.symbol, exchange: props.exchange },
        updateQueryFunction: updateTradeHistoryQuerryFunction,
      }}
      {...props}
    />
  )
}

export default APIWrapper
