import React from 'react'
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

const datesForQuery = {
  startOfTime: dayjs()
    .startOf('hour')
    .subtract(24, 'hour')
    .valueOf(),

  endOfTime: dayjs()
    .startOf('hour')
    .valueOf(),

  prevStartTimestamp: dayjs()
    .startOf('hour')
    .subtract(48, 'hour')
    .valueOf(),

  prevEndTimestamp: dayjs()
    .startOf('hour')
    .subtract(24, 'hour')
    .valueOf(),
}

const MarketStats = (props) => {
  // state: { key: number; refetching: boolean } = {
  //   key: 0,
  //   refetching: false,
  // }

  // getMarkPriceQueryUnsubscribe: null | (() => void) = null
  // getPriceQueryUnsubscribe: null | (() => void) = null
  // getFundingRateQueryUnsubscribe: null | (() => void) = null

  // componentDidMount() {
  // subscribe
  // this.getMarkPriceQueryUnsubscribe = this.props.getMarkPriceQuery.subscribeToMoreFunction()
  // this.getPriceQueryUnsubscribe = this.props.getPriceQuery.subscribeToMoreFunction()
  // this.getFundingRateQueryUnsubscribe = this.props.getFundingRateQuery.subscribeToMoreFunction()
  // }

  // componentDidUpdate(prevProps: IProps) {
  //   if (
  //     prevProps.symbol !== this.props.symbol ||
  //     prevProps.marketType !== this.props.marketType
  //   ) {
  //     //  unsubscribe from old params
  //     //  subscribe to new params and create new unsub link
  //     this.getMarkPriceQueryUnsubscribe && this.getMarkPriceQueryUnsubscribe()
  //     this.getMarkPriceQueryUnsubscribe = this.props.getMarkPriceQuery.subscribeToMoreFunction()

  //     this.getPriceQueryUnsubscribe && this.getPriceQueryUnsubscribe()
  //     this.getPriceQueryUnsubscribe = this.props.getPriceQuery.subscribeToMoreFunction()

  //     this.getFundingRateQueryUnsubscribe &&
  //       this.getFundingRateQueryUnsubscribe()
  //     this.getFundingRateQueryUnsubscribe = this.props.getFundingRateQuery.subscribeToMoreFunction()
  //   }

  //   // for funding ime
  //   const {
  //     getFundingRate: { fundingTime: prevFundingTime = 0 } = {
  //       fundingTime: 0,
  //     },
  //   } = prevProps.getFundingRateQuery || {
  //     fundingTime: 0,
  //   }

  //   const {
  //     getFundingRate: { fundingTime: newFundingTime = 0 } = {
  //       fundingTime: 0,
  //     },
  //   } = this.props.getFundingRateQuery || {
  //     fundingTime: 0,
  //   }

  //   if (prevFundingTime === 0 && newFundingTime !== 0) {
  //     this.setState((prevState) => ({ key: prevState.key + 1 }))
  //   }
  // }

  // componentWillUnmount() {
  //   //  unsubscribe
  //   this.getMarkPriceQueryUnsubscribe && this.getMarkPriceQueryUnsubscribe()
  //   this.getPriceQueryUnsubscribe && this.getPriceQueryUnsubscribe()
  //   this.getFundingRateQueryUnsubscribe && this.getFundingRateQueryUnsubscribe()
  // }

  // render() {
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
    pricePrecision: pricePrecisionRaw,
  } = props

  const pricePrecision =
    pricePrecisionRaw === 0 || pricePrecisionRaw < 0 ? 8 : pricePrecisionRaw

  // const { getPrice: lastMarketPrice = 0 } = getPriceQuery || { getPrice: 0 }
  // const { getMarkPrice = { markPrice: 0 } } = getMarkPriceQuery || {
  //   getMarkPrice: { markPrice: 0 },
  // }
  // const { markPrice = 0 } = getMarkPrice || { markPrice: 0 }

  const {
    marketDataByTickers: {
      // symbol = '',
      tradesCount = 0,
      tradesDiff = 0,
      volume = 0,
      volumeChange = 0,
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

  // const stableCoinsRegexp = new RegExp(stableCoins.join('|'), 'g')
  // const isStableCoinInPair = stableCoinsRegexp.test(symbol)
  // const roundingPrecision = isStableCoinInPair ? 2 : 8

  const markPrice = useMarkPrice()
  const { market } = useMarket()
  let priceDecimalCount = market?.tickSize && getDecimalCount(market.tickSize)

  const [base, quote] = symbol.split('_')

  // const {
  //   getFundingRate: { fundingTime = 0, fundingRate = 0 } = {
  //     fundingTime: 0,
  //     fundingRate: 0,
  //   },
  // } = getFundingRateQuery || {
  //   getFundingRate: {
  //     fundingTime: 0,
  //     fundingRate: 0,
  //   },
  // }

  // if (
  //   (fundingTime == 0 || +dayjs(fundingTime) - Date.now() < 0) &&
  //   !this.state.refetching
  // ) {
  //   this.setState({ refetching: true })
  //   setTimeout(() => {
  //     getFundingRateQueryRefetch()
  //     this.setState((prev) => ({ key: prev.key + 1, refetching: false }))
  //   }, 3000)
  // }

  // const sign24hChange = +priceChangePercent > 0 ? `+` : ``

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      {marketType === 0 ? null : (
        <PanelCard marketType={marketType} theme={theme}>
          <PanelCardValue
            theme={theme}
            style={{
              whiteSpace: 'nowrap',
              fontSize: '2rem',
              textAlign: 'center',
            }}
          >
            {formatNumberToUSFormat(
              roundAndFormatNumber(markPrice, priceDecimalCount, false)
            )}
          </PanelCardValue>
        </PanelCard>
      )}

      <PanelCard marketType={marketType} theme={theme}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {marketType === 1 ? null : (
            <PanelCardTitle theme={theme} style={{ whiteSpace: 'nowrap' }}>
              Last price
            </PanelCardTitle>
          )}
          {marketType === 0 ? null : (
            <PanelCardTitle theme={theme} style={{ whiteSpace: 'nowrap' }}>
              Mark price
            </PanelCardTitle>
          )}
        </div>
        <span style={{ display: 'flex', justifyContent: 'space-between' }}>
          {marketType === 1 ? null : (
            <PanelCardValue theme={theme}>
              {formatNumberToUSFormat(
                roundAndFormatNumber(markPrice, priceDecimalCount, false)
              )}
            </PanelCardValue>
          )}

          {/* {marketType === 0 ? null : (
              <PanelCardValue theme={theme}>
                {formatNumberToUSFormat(
                  roundAndFormatNumber(markPrice, priceDecimalCount, false)
                )}
              </PanelCardValue>
            )} */}
        </span>
      </PanelCard>

      {/* <PanelCard marketType={marketType} theme={theme}>
        <PanelCardTitle theme={theme}>24h change</PanelCardTitle>
        <span style={{ display: 'flex', justifyContent: 'space-between' }}>
          <PanelCardValue
            theme={theme}
            // style={{
            //   color:
            //     +priceChange > 0
            //       ? theme.palette.green.main
            //       : theme.palette.red.main,
            // }}
          >
             {formatNumberToUSFormat(
              stripDigitPlaces(priceChange, priceDecimalCount)
            )} 
          </PanelCardValue>
          <PanelCardSubValue
            theme={theme}
            // style={{
            //   color:
            //     +priceChangePercent > 0
            //       ? theme.palette.green.main
            //       : theme.palette.red.main,
            // }}
          >
             {`${sign24hChange}
              ${formatNumberToUSFormat(
                stripDigitPlaces(+priceChangePercent)
              )}%`} 
          </PanelCardSubValue>
        </span>
      </PanelCard> */}

      {/* <PanelCard marketType={marketType} theme={theme}>
        <PanelCardTitle theme={theme}>24h high</PanelCardTitle>
        <PanelCardValue theme={theme}>
          {formatNumberToUSFormat(
            roundAndFormatNumber(
              maxPrice,
              priceDecimalCount,
              false
            )
          )}
        </PanelCardValue>
      </PanelCard> */}

      {/* <PanelCard marketType={marketType} theme={theme}>
        <PanelCardTitle theme={theme}>24h low</PanelCardTitle>
        <PanelCardValue theme={theme}>
          {formatNumberToUSFormat(
            roundAndFormatNumber(
              minPrice,
              priceDecimalCount,
              false
            )
          )}
        </PanelCardValue>
      </PanelCard> */}

      {/* <TooltipCustom
        title="Cryptocurrencies.ai is a Serum partner exchange"
        enterDelay={250}
        component={
          <PanelCard
            marketType={marketType}
            theme={theme}
            style={{
              borderRight: marketType === 0 ? '0' : theme.palette.border.main,
              position: 'relative',
            }}
          >
            <PanelCardTitle theme={theme}>24h volume</PanelCardTitle>
            <PanelCardValue theme={theme}>
              {formatNumberToUSFormat(stripDigitPlaces(volume))}
              {` ${marketType === 0 ? quote : base}`}
            </PanelCardValue>
             <SvgIcon
                style={{ position: 'absolute', right: '1rem' }}
                src={BinanceLogo}
              /> 
          </PanelCard>
        }
      /> */}

      {/* {marketType === 1 && (
          <PanelCard
            marketType={marketType}
            theme={theme}
            style={{
              borderRight: '0',
            }}
          >
            <PanelCardTitle theme={theme}>Funding</PanelCardTitle>
            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <PanelCardValue
                theme={theme}
                style={{
                  color: '#235DCF',
                  whiteSpace: 'nowrap',
                }}
              >
                {`${fundingRate > 0 ? '+ ' : ''}${(+fundingRate * 100).toFixed(
                  4
                )} %`}
              </PanelCardValue>
              <PanelCardSubValue
                theme={theme}
                style={{ minWidth: '57px', color: theme.palette.grey.text }}
              >
                {' '}
                <Timer
                  initialTime={+dayjs(fundingTime) - Date.now()}
                  formatValue={(value) => `${value < 10 ? `0${value}` : value}`}
                  direction="backward"
                  startImmediately={true}
                  checkpoints={[
                    {
                      time: 0,
                      callback: () => {
                        console.log('funding rate finished')
                        getFundingRateQueryRefetch()
                        this.setState((prev) => ({ key: prev.key + 1 }))
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
        )} */}
    </div>
  )
  // }
}

export default compose(
  // queryRendererHoc({
  //   query: getMarkPrice,
  //   name: 'getMarkPriceQuery',
  //   variables: (props) => ({
  //     input: {
  //       exchange: props.exchange.symbol,
  //       symbol: props.symbol,
  //     },
  //   }),
  //   subscriptionArgs: {
  //     subscription: LISTEN_MARK_PRICE,
  //     variables: (props: any) => ({
  //       input: {
  //         exchange: props.exchange.symbol,
  //         symbol: props.symbol,
  //       },
  //     }),
  //     updateQueryFunction: updateMarkPriceQuerryFunction,
  //   },
  //   fetchPolicy: 'cache-and-network',
  //   withOutSpinner: true,
  //   withTableLoader: true,
  //   withoutLoading: true,
  // }),
  // queryRendererHoc({
  //   query: getPrice,
  //   name: 'getPriceQuery',
  //   variables: (props) => ({
  //     exchange: props.exchange.symbol,
  //     pair: `${props.symbol}:${props.marketType}`,
  //   }),
  //   subscriptionArgs: {
  //     subscription: LISTEN_PRICE,
  //     variables: (props: any) => ({
  //       input: {
  //         exchange: props.exchange.symbol,
  //         pair: `${props.symbol}:${props.marketType}`,
  //       },
  //     }),
  //     updateQueryFunction: updatePriceQuerryFunction,
  //   },
  //   fetchPolicy: 'cache-and-network',
  //   withOutSpinner: true,
  //   withTableLoader: true,
  //   withoutLoading: true,
  // }),
  // queryRendererHoc({
  //   query: getMarketStatisticsByPair,
  //   name: 'getMarketStatisticsByPairQuery',
  //   variables: (props) => ({
  //     input: {
  //       exchange: props.exchange.symbol,
  //       symbol: props.symbol,
  //       marketType: props.marketType,
  //     },
  //   }),
  //   fetchPolicy: 'cache-and-network',
  //   pollInterval: 30000,
  //   withOutSpinner: true,
  //   withTableLoader: true,
  //   withoutLoading: true,
  // }),
  // queryRendererHoc({
  //   query: marketDataByTickers,
  //   name: 'marketDataByTickersQuery',
  //   variables: (props) => ({
  //     symbol: props.symbol,
  //     exchange: 'serum',
  //     marketType: props.marketType,
  //     startTimestamp: `${datesForQuery.startOfTime}`,
  //     endTimestamp: `${datesForQuery.endOfTime}`,
  //     prevStartTimestamp: `${datesForQuery.prevStartTimestamp}`,
  //     prevEndTimestamp: `${datesForQuery.prevEndTimestamp}`,
  //   }),
  //   fetchPolicy: 'cache-and-network',
  //   pollInterval: 30000,
  //   withOutSpinner: true,
  //   withTableLoader: true,
  //   withoutLoading: true,
  // })

  // queryRendererHoc({
  //   query: getFundingRate,
  //   name: 'getFundingRateQuery',
  //   variables: (props) => ({
  //     input: {
  //       exchange: props.exchange.symbol,
  //       symbol: props.symbol,
  //     },
  //   }),
  //   subscriptionArgs: {
  //     subscription: LISTEN_FUNDING_RATE,
  //     variables: (props: any) => ({
  //       input: {
  //         exchange: props.exchange.symbol,
  //         symbol: props.symbol,
  //       },
  //     }),
  //     updateQueryFunction: updateFundingRateQuerryFunction,
  //   },
  //   fetchPolicy: 'cache-and-network',
  //   withOutSpinner: true,
  //   withTableLoader: true,
  //   withoutLoading: true,
  // })
)(MarketStats)
