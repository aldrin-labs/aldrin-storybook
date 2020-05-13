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
import { getMarkPrice } from '@core/graphql/queries/market/getMarkPrice'
import { LISTEN_MARK_PRICE } from '@core/graphql/subscriptions/LISTEN_MARK_PRICE'
import { LISTEN_FUNDING_RATE } from '@core/graphql/subscriptions/LISTEN_FUNDING_RATE'
import { getPrice } from '@core/graphql/queries/chart/getPrice'
import { LISTEN_PRICE } from '@core/graphql/subscriptions/LISTEN_PRICE'

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

class MarketStats extends React.PureComponent<IProps> {
  state = {
    key: 0,
  }

  getMarkPriceQueryUnsubscribe: null | (() => void) = null
  getPriceQueryUnsubscribe: null | (() => void) = null
  getFundingRateQueryUnsubscribe: null | (() => void) = null

  componentDidMount() {
    // subscribe
    this.getMarkPriceQueryUnsubscribe = this.props.getMarkPriceQuery.subscribeToMoreFunction()
    this.getPriceQueryUnsubscribe = this.props.getPriceQuery.subscribeToMoreFunction()
    this.getFundingRateQueryUnsubscribe = this.props.getFundingRateQuery.subscribeToMoreFunction()
  }

  componentDidUpdate(prevProps: IProps) {
    if (
      prevProps.symbol !== this.props.symbol ||
      prevProps.marketType !== this.props.marketType
    ) {
      //  unsubscribe from old params
      //  subscribe to new params and create new unsub link
      this.getMarkPriceQueryUnsubscribe && this.getMarkPriceQueryUnsubscribe()
      this.getMarkPriceQueryUnsubscribe = this.props.getMarkPriceQuery.subscribeToMoreFunction()

      this.getPriceQueryUnsubscribe && this.getPriceQueryUnsubscribe()
      this.getPriceQueryUnsubscribe = this.props.getPriceQuery.subscribeToMoreFunction()

      this.getFundingRateQueryUnsubscribe &&
        this.getFundingRateQueryUnsubscribe()
      this.getFundingRateQueryUnsubscribe = this.props.getFundingRateQuery.subscribeToMoreFunction()
    }
  }

  componentWillUnmount() {
    //  unsubscribe
    this.getMarkPriceQueryUnsubscribe && this.getMarkPriceQueryUnsubscribe()
    this.getPriceQueryUnsubscribe && this.getPriceQueryUnsubscribe()
    this.getFundingRateQueryUnsubscribe && this.getFundingRateQueryUnsubscribe()
  }

  render() {
    const {
      getMarketStatisticsByPairQuery,
      getFundingRateQuery,
      symbol = ' _ ',
      theme,
      marketType,
      getFundingRateQueryRefetch,
      getPriceQuery,
      getMarkPriceQuery,
      quantityPrecision,
      pricePrecision: pricePrecisionRaw,
    } = this.props

    const pricePrecision =
      pricePrecisionRaw === 0 || pricePrecisionRaw < 0 ? 8 : pricePrecisionRaw

    const { getPrice: lastMarketPrice = 0 } = getPriceQuery || { getPrice: 0 }
    const { getMarkPrice = { markPrice: 0 } } = getMarkPriceQuery || {
      getMarkPrice: { markPrice: 0 },
    }
    const { markPrice = 0 } = getMarkPrice || { markPrice: 0 }

    const {
      getMarketStatisticsByPair: {
        volume = 0,
        priceChange = 0,
        priceChangePercent = 0,
        highPrice = 0,
        lowPrice = 0,
      },
    } = getMarketStatisticsByPairQuery || {
      getMarketStatisticsByPair: {
        volume: 0,
        priceChange: 0,
        priceChangePercent: 0,
        highPrice: 0,
        lowPrice: 0,
      },
    }

    // const stableCoinsRegexp = new RegExp(stableCoins.join('|'), 'g')
    // const isStableCoinInPair = stableCoinsRegexp.test(symbol)
    // const roundingPrecision = isStableCoinInPair ? 2 : 8

    const [base, quote] = symbol.split('_')

    const {
      getFundingRate: { fundingTime = 0, fundingRate = 0 },
    } = getFundingRateQuery || {
      fundingTime: 0,
      fundingRate: 0,
    }

    const sign24hChange = +priceChangePercent > 0 ? `+` : ``

    return (
      <div style={{ display: 'flex', width: '100%' }} key={this.state.key}>
        <PanelCard style={{ minWidth: '21%', maxWidth: '21%' }}>
          <PanelCardTitle>Last price</PanelCardTitle>
          <span style={{ display: 'flex', justifyContent: 'space-between' }}>
            <PanelCardValue>
              {formatNumberToUSFormat(
                roundAndFormatNumber(markPrice, pricePrecision, false)
              )}
            </PanelCardValue>
            <PanelCardSubValue>
              {formatNumberToUSFormat(
                roundAndFormatNumber(lastMarketPrice, pricePrecision, false)
              )}
            </PanelCardSubValue>
          </span>
        </PanelCard>

        <PanelCard style={{ minWidth: '21%', maxWidth: '21%' }}>
          <PanelCardTitle>24h change</PanelCardTitle>
          <span style={{ display: 'flex', justifyContent: 'space-between' }}>
            <PanelCardValue
              color={
                +priceChange > 0
                  ? theme.customPalette.green.main
                  : theme.customPalette.red.main
              }
            >
              {formatNumberToUSFormat(
                stripDigitPlaces(priceChange, pricePrecision)
              )}
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
            {formatNumberToUSFormat(
              roundAndFormatNumber(highPrice, pricePrecision, false)
            )}
          </PanelCardValue>
        </PanelCard>

        <PanelCard>
          <PanelCardTitle>24h low</PanelCardTitle>
          <PanelCardValue>
            {formatNumberToUSFormat(
              roundAndFormatNumber(lowPrice, pricePrecision, false)
            )}
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
                {(+fundingRate * 100).toFixed(4)}
                {' %'}
              </PanelCardValue>
              <PanelCardSubValue style={{ minWidth: '57px' }}>
                {' '}
                <Timer
                  initialTime={+dayjs(fundingTime) - Date.now()}
                  formatValue={(value) => `${value < 10 ? `0${value}` : value}`}
                  direction="backward"
                  startImmediately={true}
                  checkpoints={[
                    {
                      time: 0,
                      callback: async () => {
                        console.log('funding rate finished')
                        await getFundingRateQueryRefetch()
                        await this.setState((prev) => ({ key: prev.key + 1 }))
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
      </div>
    )
  }
}

export default compose(
  withTheme(),
  queryRendererHoc({
    query: getMarkPrice,
    name: 'getMarkPriceQuery',
    variables: (props) => ({
      input: {
        exchange: props.exchange.symbol,
        symbol: props.symbol,
      },
    }),
    subscriptionArgs: {
      subscription: LISTEN_MARK_PRICE,
      variables: (props: any) => ({
        input: {
          exchange: props.exchange.symbol,
          symbol: props.symbol,
        },
      }),
      updateQueryFunction: updateMarkPriceQuerryFunction,
    },
    fetchPolicy: 'cache-and-network',
    withOutSpinner: true,
    withTableLoader: true,
  }),
  queryRendererHoc({
    query: getPrice,
    name: 'getPriceQuery',
    variables: (props) => ({
      exchange: props.exchange.symbol,
      pair: `${props.symbol}:${props.marketType}`,
    }),
    subscriptionArgs: {
      subscription: LISTEN_PRICE,
      variables: (props: any) => ({
        input: {
          exchange: props.exchange.symbol,
          pair: `${props.symbol}:${props.marketType}`,
        },
      }),
      updateQueryFunction: updatePriceQuerryFunction,
    },
    fetchPolicy: 'cache-and-network',
    withOutSpinner: true,
    withTableLoader: true,
  }),
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
    subscriptionArgs: {
      subscription: LISTEN_FUNDING_RATE,
      variables: (props: any) => ({
        input: {
          exchange: props.exchange.symbol,
          symbol: props.symbol,
        },
      }),
      updateQueryFunction: updateFundingRateQuerryFunction,
    },
    fetchPolicy: 'cache-and-network',
    withOutSpinner: true,
    withTableLoader: true,
  })
)(MarketStats)
