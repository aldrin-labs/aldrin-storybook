import React, { useEffect, useState } from 'react'
import { client } from '@core/graphql/apolloClient'

import {
  LastTradeContainer,
  LastTradeValue,
  LastTradePrice,
  ArrowIcon,
} from './LastTrade.styles'

import { OrderbookMode } from '../../OrderBookTableContainer.types'

import QueryRenderer from '@core/components/QueryRenderer'
import { MARKET_TICKERS, MOCKED_MARKET_TICKERS } from '@core/graphql/subscriptions/MARKET_TICKERS'
import { MARKET_QUERY } from '@core/graphql/queries/chart/MARKET_QUERY'

import { updateTradeHistoryQuerryFunction } from '@core/utils/chartPageUtils'

interface IProps {
  data: { marketTickers: [string] }
  group: number
  mode: OrderbookMode
}

const LastTrade = (props: IProps) => {
  const { updateTerminalPriceFromOrderbook } = props

  const [marketPrice, updateMarketPrice] = useState(0)
  let unsubscribeSpot: Function
  let unsubscribeFutures: Function

  // useEffect(() => {
  //   unsubscribeSpot && unsubscribeSpot()
  //   unsubscribeSpot = props.subscribeToMore()

  //   return () => {
  //     unsubscribeSpot && unsubscribeSpot()
  //   }
  // }, [props.marketType, props.exchange, props.symbol])

  // useEffect(() => {
  //   if (props.marketType === 1) {
  //     unsubscribeFutures && unsubscribeFutures.unsubscribe()

  //     unsubscribeFutures = client
  //       .subscribe({
  //         query: MARKET_TICKERS,
  //         variables: {
  //           symbol: props.symbol,
  //           exchange: props.exchange,
  //           marketType: String(0),
  //         },
  //       })
  //       .subscribe({
  //         next: (data) => {
  //           if (data && data.data && data.data.listenMarketTickers) {
  //             const marketPrice = data.data.listenMarketTickers[data.data.listenMarketTickers.length - 1].price

  //             updateMarketPrice(marketPrice)
  //           }
  //         },
  //       })
  //   }

  //   return () => {
  //     unsubscribeFutures && unsubscribeFutures.unsubscribe()
  //   }
  // }, [props.marketType, props.exchange, props.symbol])

  let price = 0
  let fall = false

  let spread = props.data.asks.getMaxKey() - props.data.bids.getMinKey()

  // try {
  //   const data = props.data.marketTickers[props.data.marketTickers.length - 1]
  //   if (data.pair === props.symbol || Number(data.marketType) === Number(props.marketType)) {
  //     price = data.price
  //     fall = !!(+data.fall)
  //   }
  // } catch (e) {}



  return (
    <LastTradeContainer
      onClick={() => updateTerminalPriceFromOrderbook(Number(price).toFixed(2))}
    >
      <div style={{ width: '50%', display: 'flex', justifyContent: 'space-around' }}>
      <LastTradePrice>
        spread
      </LastTradePrice>
      <LastTradePrice fall={fall}>
        {/* <ArrowIcon fall={fall} /> */}
        {Number(spread).toFixed(2)}
      </LastTradePrice>
      {/* {props.marketType === 1 && (
        <LastTradePrice>{Number(marketPrice).toFixed(2)}</LastTradePrice>
      )} */}
      </div>

      <div style={{ width: '50%', display: 'flex' }}>
      <LastTradePrice>
        updates per/sec
      </LastTradePrice>
      <LastTradePrice fall={fall}>
        {/* <ArrowIcon fall={fall} /> */}
        {props.marketOrders.asks.length + props.marketOrders.bids.length}
      </LastTradePrice>
      </div>
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
      // subscriptionArgs={{
        // subscription: MARKET_TICKERS,
        // variables: {
        //   symbol: props.symbol,
        //   exchange: props.exchange,
        //   marketType: String(props.marketType),
        // },
        // subscription: MOCKED_MARKET_TICKERS,
        // variables: { time: 10000 },
      //   updateQueryFunction: updateTradeHistoryQuerryFunction,
      // }}
      {...props}
    />
  )
}

export default APIWrapper
