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

interface IProps {
  data: { marketTickers: [string] }
  group: number
  mode: OrderbookMode
}

class LastTrade extends React.Component<IProps> {

  unsubscribeFunction: null | Function = null

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

    const data = JSON.parse(this.props.data.marketTickers[0])
    const price = data[4]
    const fall = data[9]

    return (
      <LastTradeContainer>
        <LastTradeValue fall={fall}>
          <ArrowIcon fall={fall} />
          {addMainSymbol(stripDigitPlaces(price, 2), true)}
        </LastTradeValue>
        <LastTradePrice>
          {addMainSymbol(stripDigitPlaces(price, 2), true)}
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
      fetchPolicy="cache-only"
      variables={{ symbol: props.symbol, exchange: props.exchange }}
      subscriptionArgs={{
        subscription: MARKET_TICKERS,
        variables: {
          symbol: props.symbol,
          exchange: props.exchange,
          marketType: String(props.marketType),
        },
        updateQueryFunction: updateTradeHistoryQuerryFunction,
      }}
      {...props}
    />
  )
}

export default APIWrapper
