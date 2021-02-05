import React from 'react'
import { compose } from 'recompose'
import { Theme } from '@material-ui/core'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getMarkPrice } from '@core/graphql/queries/market/getMarkPrice'
import { getNumberOfDecimalsFromNumber } from '@core/utils/chartPageUtils'

import {
  LastTradeContainer,
  LastTradeValue,
  LastTradePrice,
} from './LastTrade.styles'
const MemoizedLastTradePrice = React.memo(LastTradePrice)

const lastTradePriceStyles = (theme) => ({
  fontSize: '1.1rem',
  color: theme.palette.grey.onboard,
  fontFamily: 'DM Sans',
  fontWeight: 'normal',
  paddingRight: '1rem',
})

export interface IProps {
  theme: Theme
  markPrice: number
  aggregation: any
  getMarkPriceQuery: {
    getMarkPrice: {
      markPrice: number
    }
  }
}

const MarkPriceBlockOrderBook = ({
  theme,
  aggregation,
  getMarkPriceQuery,
  isPairDataLoading
}: IProps) => {
  const { getMarkPrice = { markPrice: 0 } } = getMarkPriceQuery || {
    getMarkPrice: { markPrice: 0 },
  }
  let { markPrice = 0 } = getMarkPrice || { markPrice: 0 }

  return (
    <MemoizedLastTradePrice theme={theme} style={lastTradePriceStyles(theme)}>
      {isPairDataLoading ? '--' : Number(markPrice).toFixed(getNumberOfDecimalsFromNumber(aggregation))}
    </MemoizedLastTradePrice>
  )
}

const MemoizedMarkPriceBlock = React.memo(MarkPriceBlockOrderBook)

export default React.memo(
  compose(
    queryRendererHoc({
      query: getMarkPrice,
      name: 'getMarkPriceQuery',
      fetchPolicy: 'cache-only',
      withOutSpinner: true,
      withTableLoader: true,
      withoutLoading: true,
      variables: (props) => ({
        input: {
          exchange: props.exchange,
          symbol: props.symbol,
        },
      }),
    })
  )(MemoizedMarkPriceBlock)
)
