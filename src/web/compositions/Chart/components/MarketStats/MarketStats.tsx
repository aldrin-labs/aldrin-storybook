import React, { useState, useEffect } from 'react'
import { compose } from 'recompose'

import { Theme } from '@material-ui/core'

import { queryRendererHoc } from '@core/components/QueryRenderer/index'

import { marketDataByTickers } from '@core/graphql/queries/chart/marketDataByTickers'
import { getCCAICirculationSupply } from '@sb/compositions/AnalyticsRoute/components/CirculationSupply'

import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

import { useMarkPrice, useMarket } from '@sb/dexUtils/markets'

import { datesForQuery } from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapper'

import {
  PanelCard,
  PanelCardTitle,
  PanelCardValue,
  PanelCardSubValue,
  MobileMarketStatsContainer,
  MarketStatsContainer,
} from '../../Chart.styles'
import { ReusableTitle as Title } from '@sb/compositions/AnalyticsRoute/index.styles'
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
    isCCAIPair,
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
  const [circulatingSupply, setCirculatingSupply] = useState(0)
  const markPrice = useMarkPrice() || 0

  useEffect(() => {
    if (markPrice > previousPrice) {
      updateToGreen(true)
    } else {
      updateToGreen(false)
    }

    savePreviousPrice(markPrice)
  }, [markPrice])

  useEffect(() => {
    const getCCAISupply = async () => {
      const CCAICircSupplyValue = await getCCAICirculationSupply()
      setCirculatingSupply(CCAICircSupplyValue)
    }
    getCCAISupply()
  }, [])

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

  const marketcap = circulatingSupply * markPrice

  return (
    <>
      <MarketStatsContainer>
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
        {isCCAIPair && (
          <>
            <PanelCard marketType={marketType} theme={theme}>
              <PanelCardTitle theme={theme}>Circulating Supply</PanelCardTitle>
              <PanelCardValue theme={theme}>
                {formatNumberToUSFormat(stripDigitPlaces(circulatingSupply, 2))}{' '}
                CCAI
              </PanelCardValue>
            </PanelCard>
            <PanelCard marketType={marketType} theme={theme}>
              <PanelCardTitle theme={theme}>Marketcap</PanelCardTitle>
              <PanelCardValue theme={theme}>
                ${formatNumberToUSFormat(stripDigitPlaces(marketcap, 2))}
              </PanelCardValue>
            </PanelCard>
          </>
        )}
      </MarketStatsContainer>
      <MobileMarketStatsContainer>
        <Title
          style={{
            color:
              +priceChangePercentage > 0
                ? theme.palette.green.main
                : theme.palette.red.main,
            fontSize: '2rem',
            margin: '0 2.5rem 0 0',
          }}
        >
          {`${sign24hChange}${formatNumberToUSFormat(
            strippedLastPriceDiff
          )}  ${quote}`}
        </Title>
        <Title
          style={{
            color:
              +priceChangePercentage > 0
                ? theme.palette.green.main
                : theme.palette.red.main,
            fontSize: '2rem',
          }}
        >
          {!priceChangePercentage
            ? '--'
            : `${sign24hChange}${formatNumberToUSFormat(
                stripDigitPlaces(+priceChangePercentage)
              )}%`}
        </Title>
      </MobileMarketStatsContainer>
    </>
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
