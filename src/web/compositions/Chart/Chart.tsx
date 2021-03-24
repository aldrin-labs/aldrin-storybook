import React, { useState, useEffect } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
// import Joyride from 'react-joyride'
import { withTheme } from '@material-ui/styles'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { client } from '@core/graphql/apolloClient'
import { isEqual } from 'lodash'
import Tour from 'reactour'
// import { Grid, Hidden } from '@material-ui/core'

import {
  tourConfig,
  FinishBtn,
  notificationTourConfig,
  WrapperForNotificationTour,
} from '@sb/components/ReactourOnboarding/ReactourOnboarding'
// import { CardsPanel } from './components'
import DefaultView from './DefaultView/StatusWrapper'
import { GET_THEME_MODE } from '@core/graphql/queries/app/getThemeMode'
import { getThemeMode } from '@core/graphql/queries/chart/getThemeMode'
import { GET_TOOLTIP_SETTINGS } from '@core/graphql/queries/user/getTooltipSettings'
import { getChartLayout } from '@core/graphql/queries/chart/getChartLayout'
import { updateTooltipSettings } from '@core/graphql/mutations/user/updateTooltipSettings'
import { changeChartLayout } from '@core/graphql/mutations/chart/changeChartLayout'
import { finishJoyride } from '@core/utils/joyride'
// import JoyrideOnboarding from '@sb/components/JoyrideOnboarding/JoyrideOnboarding'
import { getChartSteps } from '@sb/config/joyrideSteps'

import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { withAuthStatus } from '@core/hoc/withAuthStatus'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getChartData } from '@core/graphql/queries/chart/getChartData'
import { pairProperties } from '@core/graphql/queries/chart/getPairProperties'
import { getUserCustomMarkets } from '@core/graphql/queries/serum/getUserCustomMarkets'

import {
  prefetchCoinSelector,
  prefetchDifferentMarketForCoinSelector,
  prefetchPortfolio,
  prefetchPortfolioMainSpot,
  prefetchPortfolioMainFutures,
  prefetchDeposit,
  prefetchWithdrawal,
} from '@core/utils/prefetching'
import { checLoginStatusWrapper } from '@core/utils/loginUtils'

import withAuth from '@core/hoc/withAuth'
import { checkLoginStatus } from '@core/utils/loginUtils'
import {
  MainContainer,
  GlobalStyles,
} from '@sb/compositions/Chart/Chart.styles'
import { IProps } from './Chart.types'

import { useMarket } from '@sb/dexUtils/markets'

import { getDecimalCount } from '@sb/dexUtils/utils'
import { withMarketUtilsHOC } from '@core/hoc/withMarketUtilsHOC'
import { AWESOME_MARKETS } from '@sb/dexUtils/serum'
import { withPublicKey } from '@core/hoc/withPublicKey'
import { useWallet } from '@sb/dexUtils/wallet'

const arraysCustomMarketsMatch = (arr1, arr2) => {
  // Check if the arrays are the same length
  if (arr1.length !== arr2.length) return false

  // Check if all items exist and are in the same order
  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i].symbol !== arr2[i].symbol) return false
  }

  // Otherwise, return true
  return true
}

function ChartPageComponent(props: any) {
  const {
    theme,
    // getChartDataQuery: {
    //   getMyProfile: { _id } = { _id: '' },
    //   getTradingSettings: {
    //     selectedTradingKey,
    //     hedgeMode,
    //     isFuturesWarsKey,
    //   } = {
    //     selectedTradingKey: '',
    //     hedgeMode: false,
    //     isFuturesWarsKey: false,
    //   },
    //   marketByMarketType = [],
    //   chart: { activeExchange, currencyPair: { pair }, view } = {
    //     currencyPair: { pair: 'BTC_USDT' },
    //     activeExchange: { name: 'Binance', symbol: 'binance' },
    //     view: 'default',
    //   },
    // },
    getTooltipSettingsQuery: {
      getTooltipSettings = { chartPage: false, chartPagePopup: false },
    } = {
      getTooltipSettings: { chartPage: false, chartPagePopup: false },
    },
    getChartLayoutQuery: {
      chart: { layout } = {
        layout: {
          hideDepthChart: false,
          hideOrderbook: false,
          hideTradeHistory: false,
        },
      },
    } = {
      chart: {
        layout: {
          hideDepthChart: false,
          hideOrderbook: false,
          hideTradeHistory: false,
        },
      },
    },
    pairPropertiesQuery,
    marketType,
    selectedPair,
    authenticated,
    changeChartLayoutMutation,
    setCustomMarkets,
    getUserCustomMarketsQuery = { getUserCustomMarkets: [] },
    getUserCustomMarketsQueryRefetch,
    setMarketAddress,
    location,
    history,
    customMarkets,
    publicKey,
    connectWalletHash,
  } = props

  const [terminalViewMode, updateTerminalViewMode] = useState('default')
  const [stepIndex, updateStepIndex] = useState(0)
  const [key, updateKey] = useState(0)
  const [isTourOpen, setIsTourOpen] = useState(
    localStorage.getItem('isOnboardingDone') == 'null'
  )

  const { wallet } = useWallet()

  const isNotificationPassCondition = Date.now() < 1617027500000
  const [isNotificationTourOpen, setNotificationTourOpen] = useState(
    localStorage.getItem('isNotificationDone') == 'null'
  )

  useEffect(() => {
    return () => {
      document.title = 'Cryptocurrencies AI'
    }
  }, [props.marketType])

  useEffect(() => {
    const userMarkets = getUserCustomMarketsQuery.getUserCustomMarkets.map(
      ({ publicKey, marketId, isPrivate, ...rest }) => ({
        ...rest,
        name: rest.symbol,
        address: marketId,
        isCustomUserMarket: true,
        isPrivateCustomMarket: isPrivate,
      })
    )

    const savedCustomMarkets = localStorage.getItem('customMarkets') || '[]'

    const updatedMarkets = AWESOME_MARKETS.map((el) => ({
      ...el,
      address: el.address.toString(),
      programId: el.programId.toString(),
      isCustomUserMarket: true,
    }))

    const isDataChanged = !arraysCustomMarketsMatch(
      JSON.parse(savedCustomMarkets),
      [...updatedMarkets, ...userMarkets]
    )
    console.log('isDataChanged', isDataChanged)

    if (isDataChanged) setCustomMarkets([...updatedMarkets, ...userMarkets])
  }, [getUserCustomMarketsQuery.getUserCustomMarkets.length])

  const setCorrectMarketAddress = async () => {
    console.log(
      'location.pathname',
      location.pathname,
      location.pathname.split('/'),
      location.pathname.split('/')[3]
    )
    // probably broken here
    const pair = !!location.pathname.split('/')[3]
      ? location.pathname.split('/')[3]
      : 'SRM_USDT'

    const userMarkets = getUserCustomMarketsQuery.getUserCustomMarkets.map(
      ({ publicKey, marketId, isPrivate, ...rest }) => ({
        ...rest,
        name: rest.symbol,
        address: marketId,
        isCustomUserMarket: true,
        isPrivateCustomMarket: isPrivate,
      })
    )

    const updatedMarkets = AWESOME_MARKETS.map((el) => ({
      ...el,
      address: el.address.toString(),
      programId: el.programId.toString(),
      isCustomUserMarket: true,
    }))

    const allMarkets = [...props.markets, ...userMarkets, ...updatedMarkets]

    const selectedMarketFromUrl = allMarkets.find(
      (el) => el.name.split('/').join('_') === pair
    )

    if (!selectedMarketFromUrl) {
      await setMarketAddress(
        allMarkets
          .find((el) => el.name.split('/').join('_') === 'SRM_USDT')
          .address.toBase58()
      )

      await history.push('/chart/spot/SRM_USDT')

      return
    }

    await setMarketAddress(
      selectedMarketFromUrl.isCustomUserMarket
        ? selectedMarketFromUrl.address
        : selectedMarketFromUrl.address.toBase58()
    )
  }

  useEffect(() => {
    setCorrectMarketAddress()
  }, [])

  const closeChartPagePopup = () => {
    finishJoyride({
      updateTooltipSettingsMutation: props.updateTooltipSettingsMutation,
      getTooltipSettings,
      name: 'chartPagePopup',
    })
  }

  const { market } = useMarket()

  let minPriceDigits
  let quantityPrecision
  let pricePrecision
  let minSpotNotional
  let minFuturesStep
  let initialLeverage

  const isPairDataLoading = false

  quantityPrecision =
    market?.minOrderSize && getDecimalCount(market.minOrderSize)

  pricePrecision = market?.tickSize && getDecimalCount(market.tickSize)

  const accentColor = '#09ACC7'

  return (
    <MainContainer fullscreen={false}>
      {!isTourOpen && (
          <Tour
            className="my-helper"
            showCloseButton={false}
            nextButton={<FinishBtn>Next</FinishBtn>}
            prevButton={<a />}
            showNavigationNumber={false}
            showButtons={false}
            showCloseButton={false}
            showNavigation={false}
            lastStepNextButton={<div style={{ width: '100%' }}><FinishBtn>Finish123</FinishBtn></div>}
            steps={notificationTourConfig}
            accentColor={accentColor}
            isOpen={isNotificationTourOpen}
            onRequestClose={() => {
              setNotificationTourOpen(false)
              localStorage.setItem('isNotificationDone', 'true')
            }}
          />
      )}
      <Tour
        showCloseButton={false}
        nextButton={<FinishBtn>Next</FinishBtn>}
        prevButton={<a />}
        showNavigationNumber={true}
        showNavigation={true}
        lastStepNextButton={<FinishBtn>Finish</FinishBtn>}
        steps={tourConfig}
        accentColor={accentColor}
        isOpen={isTourOpen}
        onRequestClose={() => {
          setIsTourOpen(false)
          localStorage.setItem('isOnboardingDone', 'true')
        }}
      />
      {/* {view === 'default' && ( */}
      <DefaultView
        id={'_id'}
        view={'default'}
        layout={layout}
        theme={theme}
        publicKey={publicKey}
        authenticated={authenticated}
        marketType={marketType}
        currencyPair={selectedPair}
        maxLeverage={initialLeverage}
        pricePrecision={pricePrecision}
        quantityPrecision={quantityPrecision}
        minPriceDigits={minPriceDigits}
        minSpotNotional={minSpotNotional}
        minFuturesStep={minFuturesStep}
        isPairDataLoading={
          isPairDataLoading || !pricePrecision || !quantityPrecision
        }
        themeMode={theme.palette.type}
        selectedKey={{ hedgeMode: false }}
        activeExchange={'serum'}
        terminalViewMode={terminalViewMode}
        updateTerminalViewMode={(mode) => {
          if (mode === 'smartOrderMode') {
            finishJoyride({
              updateTooltipSettingsMutation:
                props.updateTooltipSettingsMutation,
              getTooltipSettings,
              name: 'chartPagePopup',
            })
          }

          updateTerminalViewMode(mode)
        }}
        chartProps={props}
        arrayOfMarketIds={[]}
        chartPagePopup={
          (getTooltipSettings.chartPagePopup === null ||
            getTooltipSettings.chartPagePopup) &&
          !getTooltipSettings.chartPage
        }
        closeChartPagePopup={closeChartPagePopup}
        changeChartLayoutMutation={changeChartLayoutMutation}
      />
      {/* )} */}
      {/* <JoyrideOnboarding
        continuous={true}
        stepIndex={stepIndex}
        showProgress={true}
        showSkipButton={true}
        key={key}
        steps={getChartSteps({ marketType })}
        open={getTooltipSettings.chartPage}
        handleJoyrideCallback={handleJoyrideCallback}
      /> */}
    </MainContainer>
  )
}

const ChartPage = React.memo(ChartPageComponent, (prev, next) => {
  // console.log('memo func chart page', prev, next)

  const isAuthenticatedUser = checkLoginStatus()

  if (!isAuthenticatedUser) {
    return false
  }

  const prevIsPairDataLoading =
    prev.loading ||
    !prev.pairPropertiesQuery.marketByName ||
    !prev.pairPropertiesQuery.marketByName[0] ||
    prev.pairPropertiesQuery.networkStatus === 2 ||
    prev.pairPropertiesQuery.marketByName[0].properties.binance.symbol !==
      prev.selectedPair.replace('_', '')

  const nextIsPairDataLoading =
    next.loading ||
    !next.pairPropertiesQuery.marketByName ||
    !next.pairPropertiesQuery.marketByName[0] ||
    next.pairPropertiesQuery.networkStatus === 2 ||
    next.pairPropertiesQuery.marketByName[0].properties.binance.symbol !==
      next.selectedPair.replace('_', '')

  const tooltipQueryChanged =
    (prev.getTooltipSettingsQuery.getTooltipSettings &&
      prev.getTooltipSettingsQuery.getTooltipSettings.chartPage) ===
      (next.getTooltipSettingsQuery.getTooltipSettings &&
        next.getTooltipSettingsQuery.getTooltipSettings.chartPage) &&
    (prev.getTooltipSettingsQuery.getTooltipSettings &&
      prev.getTooltipSettingsQuery.getTooltipSettings.chartPagePopup) ===
      (next.getTooltipSettingsQuery.getTooltipSettings &&
        next.getTooltipSettingsQuery.getTooltipSettings.chartPagePopup)

  return (
    // prev.marketType === next.marketType &&
    // prev.selectedPair === next.selectedPair &&
    // prev.getChartDataQuery.getTradingSettings.selectedTradingKey ===
    //   next.getChartDataQuery.getTradingSettings.selectedTradingKey &&
    // prev.getChartDataQuery.getTradingSettings.hedgeMode ===
    //   next.getChartDataQuery.getTradingSettings.hedgeMode &&
    // prevIsPairDataLoading === nextIsPairDataLoading &&
    // tooltipQueryChanged &&
    // prev.getChartLayoutQuery.chart.layout.hideDepthChart ===
    //   next.getChartLayoutQuery.chart.layout.hideDepthChart &&
    // prev.getChartLayoutQuery.chart.layout.hideOrderbook ===
    //   next.getChartLayoutQuery.chart.layout.hideOrderbook &&
    // prev.getChartLayoutQuery.chart.layout.hideTradeHistory ===
    //   next.getChartLayoutQuery.chart.layout.hideTradeHistory &&
    // prev.theme.palette.type === next.theme.palette.type &&
    // isEqual(prev.theme, next.theme) &&
    // isEqual(
    //   prev.pairPropertiesQuery.marketByName[0].properties,
    //   next.pairPropertiesQuery.marketByName[0].properties
    // )
    false
  )
})

// TODO: combine all queries to one
export default compose(
  withMarketUtilsHOC,
  withErrorFallback,
  withAuthStatus,
  withTheme(),
  withPublicKey,
  withRouter,
  // withAuth,
  // queryRendererHoc({
  //   skip: (props: any) => !props.authenticated,
  //   query: getChartData,
  //   name: 'getChartDataQuery',
  //   // fetchPolicy: 'cache-and-network',
  //   fetchPolicy: 'cache-first',
  //   variables: {
  //     marketType: 1, // hardcode here to get only futures marketIds'
  //   },
  // }),
  queryRendererHoc({
    query: getUserCustomMarkets,
    name: 'getUserCustomMarketsQuery',
    fetchPolicy: 'cache-first',
    variables: (props) => ({
      publicKey: props.publicKey,
    }),
  }),
  // queryRendererHoc({
  //   skip: (props: any) => !props.authenticated,
  //   query: GET_TOOLTIP_SETTINGS,
  //   name: 'getTooltipSettingsQuery',
  //   fetchPolicy: 'cache-first',
  //   withOutSpinner: true,
  //   withoutLoading: true,
  // }),
  // queryRendererHoc({
  //   query: pairProperties,
  //   name: 'pairPropertiesQuery',
  //   fetchPolicy: 'cache-first',
  //   withoutLoading: true,
  //   variables: (props: IProps) => ({
  //     marketName: props.selectedPair,
  //     marketType: props.marketType,
  //   }),
  // }),
  queryRendererHoc({
    query: getChartLayout,
    name: 'getChartLayoutQuery',
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
  }),
  graphql(updateTooltipSettings, {
    name: 'updateTooltipSettingsMutation',
  }),
  graphql(changeChartLayout, {
    name: 'changeChartLayoutMutation',
  })
)(ChartPage)
