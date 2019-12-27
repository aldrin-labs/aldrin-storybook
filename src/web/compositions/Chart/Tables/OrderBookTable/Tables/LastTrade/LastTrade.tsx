import React, { useEffect } from 'react'

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

const LastTrade = (props: IProps) => {
  const { updateTerminalPriceFromOrderbook } = props

  let unsubscribe = undefined

  useEffect(() => {
    unsubscribe && unsubscribe()
    unsubscribe = props.subscribeToMore()

    return () => {
      unsubscribe()
    }
  }, [props.marketType, props.exchange, props.currencyPair])

  let price = 0
  let fall = false

  try {
    const data = JSON.parse(props.data.marketTickers[0])
    if (data[1] === props.symbol || data[2] === props.marketType) {
      price = data[4]
      fall = data[9]
    }
  } catch (e) {}

  return (
    <LastTradeContainer
      onClick={() => updateTerminalPriceFromOrderbook(Number(price).toFixed(2))}
    >
      <LastTradeValue fall={fall}>
        <ArrowIcon fall={fall} />
        {addMainSymbol(Number(price).toFixed(2), true)}
      </LastTradeValue>
      <LastTradePrice>
        {addMainSymbol(Number(price).toFixed(2), true)}
      </LastTradePrice>
    </LastTradeContainer>
  )
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
