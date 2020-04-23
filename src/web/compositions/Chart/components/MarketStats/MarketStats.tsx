import React from 'react'
import { compose } from 'recompose'
import dayjs from 'dayjs'
import { withTheme } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core'
import Timer from 'react-compound-timer'
import { TooltipCustom } from '@sb/components/index'

import { queryRendererHoc } from '@core/components/QueryRenderer/index'
import { getMarketStatisticsByPair } from '@core/graphql/queries/chart/getMarketStatisticsByPair'
import { getFundingRate } from '@core/graphql/queries/chart/getFundingRate'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

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
  }
}

class MarketStats extends React.PureComponent<IProps> {
  render() {
    const {
      getMarketStatisticsByPairQuery,
      getFundingRateQuery,
      symbol = ' _ ',
      theme,
      marketType,
    } = this.props

    const {
      getMarketStatisticsByPair: {
        lastPrice = 0,
        volume = 0,
        priceChange = 0,
        priceChangePercent = 0,
        highPrice = 0,
        lowPrice = 0,
      },
    } = getMarketStatisticsByPairQuery || {
      getMarketStatisticsByPair: {
        lastPrice: 0,
        volume: 0,
        priceChange: 0,
        priceChangePercent: 0,
        highPrice: 0,
        lowPrice: 0,
      },
    }

    const [base, quote] = symbol.split('_')

    const {
      getFundingRate: { fundingTime = 0, fundingRate = 0 },
    } = getFundingRateQuery || {
      fundingTime: 0,
      fundingRate: 0,
    }

    return (
      <>
        <PanelCard first>
          <PanelCardTitle>Last price</PanelCardTitle>
          <span>
            <PanelCardValue>{formatNumberToUSFormat(lastPrice)}</PanelCardValue>
            {/* <PanelCardSubValue>$9964.01</PanelCardSubValue> */}
          </span>
        </PanelCard>

        <PanelCard>
          <PanelCardTitle>24h change</PanelCardTitle>
          <span>
            <PanelCardValue
              color={
                +priceChange > 0
                  ? theme.customPalette.green.main
                  : theme.customPalette.red.main
              }
            >
              {formatNumberToUSFormat(priceChange)}
            </PanelCardValue>
            <PanelCardSubValue
              color={
                +priceChangePercent > 0
                  ? theme.customPalette.green.main
                  : theme.customPalette.red.main
              }
            >
              {`${formatNumberToUSFormat(
                stripDigitPlaces(+priceChangePercent)
              )}%`}
            </PanelCardSubValue>
          </span>
        </PanelCard>

        <PanelCard>
          <PanelCardTitle>24h high</PanelCardTitle>
          <PanelCardValue>{formatNumberToUSFormat(highPrice)}</PanelCardValue>
        </PanelCard>

        <PanelCard>
          <PanelCardTitle>24h low</PanelCardTitle>
          <PanelCardValue>{formatNumberToUSFormat(lowPrice)}</PanelCardValue>
        </PanelCard>

        <TooltipCustom
          title="Cryptocurrencies.ai is a Binance partner exchange"
          enterDelay={250}
          component={
            <PanelCard>
              <PanelCardTitle>24h volume</PanelCardTitle>
              <PanelCardValue>
                {formatNumberToUSFormat(volume)}
                {` ${quote}`}
              </PanelCardValue>
            </PanelCard>
          }
        />

        {marketType === 1 && (
          <PanelCard style={{ borderRight: '0' }}>
            <PanelCardTitle>Funding</PanelCardTitle>
            <span>
              <PanelCardValue
                color={
                  +fundingRate > 0
                    ? theme.customPalette.green.main
                    : theme.customPalette.red.main
                }
              >
                {formatNumberToUSFormat(fundingRate)}
              </PanelCardValue>
              <PanelCardSubValue style={{ padding: 0 }}>
                {' '}
                <Timer
                  initialTime={+dayjs(fundingTime).add(8, 'hour') - Date.now()}
                  direction="backward"
                  startImmediately={true}
                >
                  {() => (
                    <React.Fragment>
                      <Timer.Hours />
                      {':'}
                      <Timer.Minutes />
                      {':'}
                      <Timer.Seconds />
                    </React.Fragment>
                  )}
                </Timer>
              </PanelCardSubValue>
            </span>
          </PanelCard>
        )}
      </>
    )
  }
}

export default compose(
  withTheme(),
  queryRendererHoc({
    query: getMarketStatisticsByPair,
    name: 'getMarketStatisticsByPairQuery',
    variables: (props) => ({
      input: {
        exchange: props.exchange.symbol,
        symbol: props.symbol,
        marketType: props.marketType,
      },
    }),
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000,
    withOutSpinner: true,
    withTableLoader: true,
  }),
  queryRendererHoc({
    query: getFundingRate,
    name: 'getFundingRateQuery',
    variables: (props) => ({
      input: {
        exchange: props.exchange.symbol,
        symbol: props.symbol,
      },
    }),
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000,
    withOutSpinner: true,
    withTableLoader: true,
  })
)(MarketStats)
