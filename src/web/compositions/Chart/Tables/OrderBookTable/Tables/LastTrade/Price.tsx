import React, { useState, useEffect } from 'react'
import { compose } from 'recompose'
import { Theme } from '@material-ui/core'
import GreenArrow from '@icons/greenArrow.svg'
import RedArrow from '@icons/redArrow.svg'
import SvgIcon from '@sb/components/SvgIcon'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getPrice } from '@core/graphql/queries/chart/getPrice'
import { getNumberOfDecimalsFromNumber } from '@core/utils/chartPageUtils'

import {
  LastTradeContainer,
  LastTradeValue,
  LastTradePrice,
} from './LastTrade.styles'
const MemoizedLastTradePrice = React.memo(LastTradePrice)
fontSize: '1.2rem'

export interface IProps {
  theme: Theme
  markPrice: number
  aggregation: any
  getPriceQuery: {
    getPrice: number
  }
}

const PriceBlockOrderBook = ({ theme, aggregation, getPriceQuery }: IProps) => {
  const { getPrice: lastMarketPrice = 0 } = getPriceQuery || { getPrice: 0 }
  const [previousPrice, savePreviousPrice] = useState(0)
  const [showGreen, updateToGreen] = useState(false)

  useEffect(() => {
    if (lastMarketPrice > previousPrice) {
      updateToGreen(true)
    } else {
      updateToGreen(false)
    }

    savePreviousPrice(lastMarketPrice)
  }, [lastMarketPrice])

  return (
    <MemoizedLastTradePrice
      theme={theme}
      style={{
        color: showGreen ? theme.palette.green.main : theme.palette.red.main,
        fontSize: '2rem',
        letterSpacing: '0.2rem',
        fontWeight: 'bolder',
        fontFamily: 'DM Sans',
      }}
    >
      {Number(lastMarketPrice).toFixed(
        getNumberOfDecimalsFromNumber(aggregation)
      )}{' '}
      {showGreen ? (
        <SvgIcon src={GreenArrow} height="12px" width="12px" />
      ) : (
        <SvgIcon src={RedArrow} height="12px" width="12px" />
      )}
    </MemoizedLastTradePrice>
  )
}

const MemoizedPriceBlock = React.memo(PriceBlockOrderBook)

export default React.memo(
  compose(
    queryRendererHoc({
      query: getPrice,
      name: 'getPriceQuery',
      fetchPolicy: 'cache-only',
      withOutSpinner: true,
      withTableLoader: false,
      withoutLoading: true,
      variables: (props) => ({
        exchange: props.exchange,
        pair: `${props.symbol}:${props.marketType}`,
      }),
    })
  )(MemoizedPriceBlock)
)
