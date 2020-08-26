import React from 'react'
import { compose } from 'recompose'

import { queryRendererHoc } from '@core/components/QueryRenderer/index'

import {
  LastTradeContainer,
  LastTradeValue,
  LastTradePrice,
  ArrowIcon,
} from './LastTrade.styles'

import { OrderbookMode } from '../../OrderBookTableContainer.types'

import { getMarkPrice } from '@core/graphql/queries/market/getMarkPrice'
import { LISTEN_MARK_PRICE } from '@core/graphql/subscriptions/LISTEN_MARK_PRICE'
import { getPrice } from '@core/graphql/queries/chart/getPrice'
import { LISTEN_PRICE } from '@core/graphql/subscriptions/LISTEN_PRICE'

import {
  getAggregationsFromMinPriceDigits,
  getNumberOfDecimalsFromNumber,
} from '@core/utils/chartPageUtils'

import {
  updateMarkPriceQuerryFunction,
  updatePriceQuerryFunction,
} from '@sb/compositions/Chart/components/MarketStats/MarketStats.utils'

interface IProps {
  data: { marketTickers: [string] }
  group: number
  mode: OrderbookMode
  marketType: 0 | 1
  minPriceDigits: number
  getPriceQuery: {
    getPrice: number
    subscribeToMoreFunction: () => () => void
  }
  getFundingRateQueryRefetch: () => void
  getMarkPriceQuery: {
    getMarkPrice: {
      symbol: string
      markPrice: number
    }
    subscribeToMoreFunction: () => () => void
  }
  updateTerminalPriceFromOrderbook: (price: number | string) => void
}

const LastTrade = (props: IProps) => {
  const {
    updateTerminalPriceFromOrderbook,
    getPriceQuery,
    getMarkPriceQuery,
    marketType,
    theme,
  } = props

  const { getPrice: lastMarketPrice = 0 } = getPriceQuery || { getPrice: 0 }
  const { getMarkPrice = { markPrice: 0 } } = getMarkPriceQuery || {
    getMarkPrice: { markPrice: 0 },
  }
  const { markPrice = 0 } = getMarkPrice || { markPrice: 0 }

  const aggregation = getAggregationsFromMinPriceDigits(props.minPriceDigits)[0]
    .value

  return (
    <LastTradeContainer
      theme={theme}
      onClick={() =>
        updateTerminalPriceFromOrderbook(
          Number(markPrice).toFixed(getNumberOfDecimalsFromNumber(aggregation))
        )
      }
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-end',
        }}
      >
        {/* <LastTradePrice>
        spread
      </LastTradePrice> */}
        <LastTradePrice theme={theme}>
          {/* <ArrowIcon fall={fall} /> */}
          {Number(lastMarketPrice).toFixed(
            getNumberOfDecimalsFromNumber(aggregation)
          )}
        </LastTradePrice>
        {marketType === 1 && (
          <LastTradePrice theme={theme} style={{ fontSize: '1.2rem' }}>
            {Number(markPrice).toFixed(
              getNumberOfDecimalsFromNumber(aggregation)
            )}
          </LastTradePrice>
        )}
      </div>
    </LastTradeContainer>
  )
}

export default compose(
  queryRendererHoc({
    query: getMarkPrice,
    name: 'getMarkPriceQuery',
    variables: (props) => ({
      input: {
        exchange: props.exchange,
        symbol: props.symbol,
      },
    }),
    subscriptionArgs: {
      subscription: LISTEN_MARK_PRICE,
      variables: (props: any) => ({
        input: {
          exchange: props.exchange,
          symbol: props.symbol,
        },
      }),
      updateQueryFunction: updateMarkPriceQuerryFunction,
    },
    fetchPolicy: 'cache-and-network',
    withOutSpinner: true,
    withTableLoader: false,
  }),
  queryRendererHoc({
    query: getPrice,
    name: 'getPriceQuery',
    variables: (props) => ({
      exchange: props.exchange,
      pair: `${props.symbol}:${props.marketType}`,
    }),
    subscriptionArgs: {
      subscription: LISTEN_PRICE,
      variables: (props: any) => ({
        input: {
          exchange: props.exchange,
          pair: `${props.symbol}:${props.marketType}`,
        },
      }),
      updateQueryFunction: updatePriceQuerryFunction,
    },
    fetchPolicy: 'cache-and-network',
    withOutSpinner: true,
    withTableLoader: false,
  })
)(LastTrade)
