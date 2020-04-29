import React from 'react'
import { compose } from 'recompose'
import dayjs from 'dayjs'
import { withTheme } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core'
import Timer from 'react-compound-timer'
import { TooltipCustom } from '@sb/components/index'

import stableCoins from '@core/config/stableCoins'
import { queryRendererHoc } from '@core/components/QueryRenderer/index'
import { getMarketStatisticsByPair } from '@core/graphql/queries/chart/getMarketStatisticsByPair'
import { getFundingRate } from '@core/graphql/queries/chart/getFundingRate'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
  stripTrailingZeros,
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
  getFundingRateQueryRefetch: () => void
}

class MarketStats extends React.PureComponent<IProps> {
  render() {
    const {
      getMarketStatisticsByPairQuery,
      getFundingRateQuery,
      symbol = ' _ ',
      theme,
      marketType,
      getFundingRateQueryRefetch,
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

    const stableCoinsRegexp = new RegExp(stableCoins.join('|'), 'g')
    const isStableCoinInPair = stableCoinsRegexp.test(symbol)
    const roundingPrecision = isStableCoinInPair ? 2 : 8

    const [base, quote] = symbol.split('_')

    const {
      getFundingRate: { fundingTime = 0, fundingRate = 0 },
    } = getFundingRateQuery || {
      fundingTime: 0,
      fundingRate: 0,
    }

    const sign24hChange = +priceChangePercent > 0 ? `+` : ``

    return (
      <>
        <PanelCard first>
          <PanelCardTitle>Last price</PanelCardTitle>
          <span>
            <PanelCardValue>
              {formatNumberToUSFormat(stripDigitPlaces(lastPrice, roundingPrecision))}
            </PanelCardValue>
            {/* <PanelCardSubValue>$9964.01</PanelCardSubValue> */}
          </span>
        </PanelCard>

        <PanelCard>
          <PanelCardTitle>24h change</PanelCardTitle>
          <span style={{ display: 'flex', justifyContent: 'space-between' }}>
            <PanelCardValue
              color={
                +priceChange > 0
                  ? theme.customPalette.green.main
                  : theme.customPalette.red.main
              }
            >
              {formatNumberToUSFormat(stripDigitPlaces(priceChange, roundingPrecision))}
            </PanelCardValue>
            <PanelCardSubValue
              color={
                +priceChangePercent > 0
                  ? theme.customPalette.green.main
                  : theme.customPalette.red.main
              }
            >
              {`${sign24hChange}
              ${formatNumberToUSFormat(
                stripDigitPlaces(+priceChangePercent)
              )}%`}
            </PanelCardSubValue>
          </span>
        </PanelCard>

        <PanelCard>
          <PanelCardTitle>24h high</PanelCardTitle>
          <PanelCardValue>
            {formatNumberToUSFormat(stripDigitPlaces(highPrice))}
          </PanelCardValue>
        </PanelCard>

        <PanelCard>
          <PanelCardTitle>24h low</PanelCardTitle>
          <PanelCardValue>
            {formatNumberToUSFormat(stripDigitPlaces(lowPrice))}
          </PanelCardValue>
        </PanelCard>

        <TooltipCustom
          title="Cryptocurrencies.ai is a Binance partner exchange"
          enterDelay={250}
          component={
            <PanelCard>
              <PanelCardTitle>24h volume</PanelCardTitle>
              <PanelCardValue>
                {formatNumberToUSFormat(stripDigitPlaces(volume))}
                {` ${marketType === 0 ? quote : base}`}
              </PanelCardValue>
            </PanelCard>
          }
        />

        {marketType === 1 && (
          <PanelCard
            style={{
              borderRight: '0',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <PanelCardTitle>Funding</PanelCardTitle>
            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <PanelCardValue
                color={
                  +fundingRate > 0
                    ? theme.customPalette.green.main
                    : theme.customPalette.red.main
                }
              >
                {formatNumberToUSFormat(stripTrailingZeros(fundingRate))}
              </PanelCardValue>
              <PanelCardSubValue style={{ padding: '0.1rem 1rem' }}>
                {' '}
                <Timer
                  initialTime={+dayjs(fundingTime).add(8, 'hour') - Date.now()}
                  direction="backward"
                  startImmediately={true}
                  checkpoints={[
                    {
                      time: 0,
                      callback: () => {
                        console.log('funding rate finished')
                        getFundingRateQueryRefetch()
                      },
                    },
                  ]}
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
    pollInterval: 30000,
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
