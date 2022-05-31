import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'
import { DefaultTheme, useTheme } from 'styled-components'

import { ReusableTitle as Title } from '@sb/compositions/AnalyticsRoute/index.styles'
import { datesForQuery } from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapper'
import { useMarket, useMarkPrice } from '@sb/dexUtils/markets'
import { useInterval } from '@sb/dexUtils/useInterval'
import { formatNumberWithSpaces } from '@sb/dexUtils/utils'

import { getRINCirculationSupply } from '@core/api'
import { queryRendererHoc } from '@core/components/QueryRenderer/index'
import { marketDataByTickers } from '@core/graphql/queries/chart/marketDataByTickers'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

import {
  MarketStatsContainer,
  MobileMarketStatsContainer,
  PanelCard,
  PanelCardSubValue,
  PanelCardTitle,
  PanelCardValue,
} from '../../Chart.styles'

export interface MarketDataByTicker {
  tradesCount: number
  tradesDiff: number
  volume: number
  volumeChange: number
  lastPriceDiff: number
  minPrice: number
  maxPrice: number
}

interface IProps {
  theme: DefaultTheme
  symbol: string
  marketType: number
  marketDataByTickersQuery: {
    marketDataByTickers: MarketDataByTicker
  }
  marketDataByTickersQueryRefetch: (variables: { [c: string]: any }) => void
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
  isRINPair?: boolean
}

export const generateDatesForRequest = () => ({
  startTimestamp: `${datesForQuery.startOfTime()}`,
  endTimestamp: `${datesForQuery.endOfTime()}`,
  prevStartTimestamp: `${datesForQuery.prevStartTimestamp()}`,
  prevEndTimestamp: `${datesForQuery.prevEndTimestamp()}`,
})

const MarketStats: React.FC<IProps> = (props) => {
  const {
    marketDataByTickersQuery,
    marketDataByTickersQueryRefetch,
    symbol = ' _ ',
    marketType,
    isRINPair,
    pricePrecision,
  } = props

  const {
    marketDataByTickers: {
      volume = 0,
      lastPriceDiff = 0,
      minPrice = 0,
      maxPrice = 0,
    } = {},
  } = marketDataByTickersQuery || {
    marketDataByTickers: {
      tradesCount: 0,
      tradesDiff: 0,
      volume: 0,
      volumeChange: 0,
      minPrice: 0,
      maxPrice: 0,
    },
  }

  const theme = useTheme()

  useInterval(() => {
    const variables = {
      symbol: props.symbol,
      exchange: 'serum',
      marketType: props.marketType,
      ...generateDatesForRequest(),
    }
    marketDataByTickersQueryRefetch(variables)
  }, 5 * 60 * 1000)

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
      const CCAICircSupplyValue = await getRINCirculationSupply()
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
        <PanelCard marketType={marketType}>
          <PanelCardValue
            style={{
              color: showGreen ? theme.colors.green7 : theme.colors.red3,
              fontSize: '2.3rem',
              letterSpacing: '0.01rem',
              fontFamily: 'Avenir Next Demi',
            }}
          >
            {markPrice === 0 ? '--' : formatNumberWithSpaces(strippedMarkPrice)}
          </PanelCardValue>
        </PanelCard>
        <PanelCard marketType={marketType}>
          <PanelCardTitle>24h change</PanelCardTitle>
          <span style={{ display: 'flex', justifyContent: 'space-between' }}>
            <PanelCardValue
              style={{
                color:
                  +priceChangePercentage > 0
                    ? theme.colors.green7
                    : theme.colors.red3,
              }}
            >
              {formatNumberWithSpaces(strippedLastPriceDiff)}
            </PanelCardValue>
            <PanelCardSubValue
              style={{
                color:
                  +priceChangePercentage > 0
                    ? theme.colors.green7
                    : theme.colors.red3,
              }}
            >
              {!priceChangePercentage
                ? '--'
                : `${sign24hChange}${formatNumberWithSpaces(
                    stripDigitPlaces(+priceChangePercentage)
                  )}%`}
            </PanelCardSubValue>
          </span>
        </PanelCard>

        <PanelCard marketType={marketType}>
          <PanelCardTitle>24h high</PanelCardTitle>
          <PanelCardValue>
            {formatNumberWithSpaces(stripDigitPlaces(maxPrice, pricePrecision))}
          </PanelCardValue>
        </PanelCard>

        <PanelCard marketType={marketType}>
          <PanelCardTitle>24h low</PanelCardTitle>
          <PanelCardValue>
            {formatNumberWithSpaces(stripDigitPlaces(minPrice, pricePrecision))}
          </PanelCardValue>
        </PanelCard>
        <PanelCard marketType={marketType}>
          <PanelCardTitle>24hr volume</PanelCardTitle>
          <PanelCardValue>
            {formatNumberWithSpaces(stripDigitPlaces(volume, 2))} {quote}
          </PanelCardValue>
        </PanelCard>
        {isRINPair && (
          <>
            {/* <PanelCard marketType={marketType} >
              <PanelCardTitle >Circulating Supply</PanelCardTitle>
              <PanelCardValue >
                {formatNumberToUSFormat(stripDigitPlaces(circulatingSupply, 2))}{' '}
                CCAI
              </PanelCardValue>
            </PanelCard> */}
            <PanelCard marketType={marketType}>
              <PanelCardTitle>Marketcap</PanelCardTitle>
              <PanelCardValue>
                ${formatNumberWithSpaces(stripDigitPlaces(marketcap, 2))}
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
                ? theme.colors.green7
                : theme.colors.red3,
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
                ? theme.colors.green7
                : theme.colors.red3,
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
    variables: (props: IProps) => ({
      symbol: props.symbol,
      exchange: 'serum',
      marketType: props.marketType,
      ...generateDatesForRequest(),
    }),
    fetchPolicy: 'cache-and-network',
    withOutSpinner: true,
    withTableLoader: true,
    withoutLoading: true,
  })
)(MarketStats)
