import React, { useState, useEffect } from 'react'
import { compose } from 'recompose'
import dayjs from 'dayjs'
import { withTheme } from '@material-ui/core/styles'
import SvgIcon from '@sb/components/SvgIcon'
import { Theme } from '@material-ui/core'
import Timer from 'react-compound-timer'
import { TooltipCustom } from '@sb/components/index'
import BinanceLogo from '@icons/binanceLogo.svg'
import { queryRendererHoc } from '@core/components/QueryRenderer/index'
import { getMarketStatisticsByPair } from '@core/graphql/queries/chart/getMarketStatisticsByPair'
import { getFundingRate } from '@core/graphql/queries/chart/getFundingRate'
import { getMarkPrice } from '@core/graphql/queries/market/getMarkPrice'
import { LISTEN_MARK_PRICE } from '@core/graphql/subscriptions/LISTEN_MARK_PRICE'
import { LISTEN_FUNDING_RATE } from '@core/graphql/subscriptions/LISTEN_FUNDING_RATE'
import { getPrice } from '@core/graphql/queries/chart/getPrice'
import { LISTEN_PRICE } from '@core/graphql/subscriptions/LISTEN_PRICE'

import { marketDataByTickers } from '@core/graphql/queries/chart/marketDataByTickers'

import {
  formatNumberToUSFormat,
  stripDigitPlaces,
  roundAndFormatNumber,
} from '@core/utils/PortfolioTableUtils'

import {
  updateFundingRateQuerryFunction,
  updateMarkPriceQuerryFunction,
  updatePriceQuerryFunction,
} from './MarketStats.utils'

import { useMarkPrice, useMarket } from '@sb/dexUtils/markets'

import { getDecimalCount } from '@sb/dexUtils/utils'
import { datesForQuery } from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapper'

import {
  PanelCard,
  PanelCardTitle,
  PanelCardValue,
  PanelCardSubValue,
} from '../../Chart.styles'

export interface IProps {
  theme: Theme
  symbol: string
  marketType: number
  marketDataByTickersQuery: {
    marketDataByTickers: {}
  }
  getMarketStatisticsByPairQuery: {
    getMarketStatisticsByPair: {
      exchange: string
      symbol: string
      lastPrice: string
      volume: string
      priceChange: string
      priceChangePercent: string
      highPrice: string
      lowPrice: string
    }
  }
  getFundingRateQuery: {
    getFundingRate: {
      exchange: string
      symbol: string
      fundingTime: number
      fundingRate: string
    }
    subscribeToMoreFunction: () => () => void
  }
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
  quantityPrecision: number
  pricePrecision: number
}

const MarketStats = (props) => {
  const {
    getMarketStatisticsByPairQuery,
    marketDataByTickersQuery,
    getFundingRateQuery,
    symbol = ' _ ',
    theme,
    marketType,
    getFundingRateQueryRefetch,
    getPriceQuery,
    getMarkPriceQuery,
    quantityPrecision,
    pricePrecision,
  } = props

  const {
    marketDataByTickers: {
      // symbol = '',
      tradesCount = 0,
      tradesDiff = 0,
      volume = 0,
      volumeChange = 0,
      lastPriceDiff = 0,
      minPrice = 0,
      maxPrice = 0,
      // closePrice = 0
    } = {
      // symbol: '',
      tradesCount: 0,
      tradesDiff: 0,
      volume: 0,
      volumeChange: 0,
      minPrice: 0,
      maxPrice: 0,
      // closePrice: 0
    },
  } = marketDataByTickersQuery || {
    marketDataByTickers: {
      // symbol: '',
      tradesCount: 0,
      tradesDiff: 0,
      volume: 0,
      volumeChange: 0,
      minPrice: 0,
      maxPrice: 0,
      // closePrice: 0
    },
  }

  const { market } = useMarket()
  const [previousPrice, savePreviousPrice] = useState(0)
  const [showGreen, updateToGreen] = useState(false)
  const markPrice = useMarkPrice() || 0

  useEffect(() => {
    if (markPrice > previousPrice) {
      updateToGreen(true)
    } else {
      updateToGreen(false)
    }

    savePreviousPrice(markPrice)
  }, [markPrice])

  const bigPrecision = market?.tickSize > 1 ? market?.tickSize : null

  const strippedLastPriceDiff = +stripDigitPlaces(
    lastPriceDiff,
    pricePrecision,
    bigPrecision
  )
  const strippedMarkPrice = +stripDigitPlaces(
    markPrice,
    pricePrecision,
    bigPrecision
  )

  const [base, quote] = symbol.split('_')

  const prevClosePrice = strippedMarkPrice - strippedLastPriceDiff

  const priceChangePercentage = !prevClosePrice
    ? 0
    : (markPrice - prevClosePrice) / (prevClosePrice / 100)

  const sign24hChange = +priceChangePercentage > 0 ? `+` : ``

  return (
    <div style={{ display: 'flex' }}>
      <PanelCard marketType={marketType} theme={theme}>
        <PanelCardValue
          theme={theme}
          style={{
            color: showGreen
              ? theme.palette.green.main
              : theme.palette.red.main,
            fontSize: '2.3rem',
            letterSpacing: '0.01rem',
            fontFamily: 'Avenir Next Demi',
          }}
        >
          {markPrice === 0 ? '--' : formatNumberToUSFormat(strippedMarkPrice)}
        </PanelCardValue>
      </PanelCard>
      <PanelCard marketType={marketType} theme={theme}>
        <PanelCardTitle theme={theme}>24h change</PanelCardTitle>
        <span style={{ display: 'flex', justifyContent: 'space-between' }}>
          <PanelCardValue
            theme={theme}
            style={{
              color:
                +priceChangePercentage > 0
                  ? theme.palette.green.main
                  : theme.palette.red.main,
            }}
          >
            {formatNumberToUSFormat(strippedLastPriceDiff)}
          </PanelCardValue>
          <PanelCardSubValue
            theme={theme}
            style={{
              color:
                +priceChangePercentage > 0
                  ? theme.palette.green.main
                  : theme.palette.red.main,
            }}
          >
            {!priceChangePercentage
              ? '--'
              : `${sign24hChange}${formatNumberToUSFormat(
                stripDigitPlaces(+priceChangePercentage)
              )}%`}
          </PanelCardSubValue>
        </span>
      </PanelCard>

      <PanelCard marketType={marketType} theme={theme}>
        <PanelCardTitle theme={theme}>24h high</PanelCardTitle>
        <PanelCardValue theme={theme}>
          {formatNumberToUSFormat(stripDigitPlaces(maxPrice, pricePrecision))}
        </PanelCardValue>
      </PanelCard>

      <PanelCard marketType={marketType} theme={theme}>
        <PanelCardTitle theme={theme}>24h low</PanelCardTitle>
        <PanelCardValue theme={theme}>
          {formatNumberToUSFormat(stripDigitPlaces(minPrice, pricePrecision))}
        </PanelCardValue>
      </PanelCard>
      <PanelCard marketType={marketType} theme={theme}>
        <PanelCardTitle theme={theme}>24hr volume</PanelCardTitle>
        <PanelCardValue theme={theme}>
          {formatNumberToUSFormat(stripDigitPlaces(volume, 2))} {quote}
        </PanelCardValue>
      </PanelCard>
    </div>
  )
}

export default compose(
  queryRendererHoc({
    query: marketDataByTickers,
    name: 'marketDataByTickersQuery',
    variables: (props) => ({
      symbol: props.symbol,
      exchange: 'serum',
      marketType: props.marketType,
      startTimestamp: `${datesForQuery.startOfTime}`,
      endTimestamp: `${datesForQuery.endOfTime}`,
      prevStartTimestamp: `${datesForQuery.prevStartTimestamp}`,
      prevEndTimestamp: `${datesForQuery.prevEndTimestamp}`,
    }),
    fetchPolicy: 'cache-and-network',
    pollInterval: 30000,
    withOutSpinner: true,
    withTableLoader: true,
    withoutLoading: true,
  })
)(MarketStats)
