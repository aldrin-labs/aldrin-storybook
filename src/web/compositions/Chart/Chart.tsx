import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
// import Joyride from 'react-joyride'
import { withTheme } from '@material-ui/styles'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'

// import { Grid, Hidden } from '@material-ui/core'

// import { CardsPanel } from './components'
import OnlyCharts from './OnlyCharts/OnlyCharts'
import DefaultView from './DefaultView/StatusWrapper'

import { GET_TOOLTIP_SETTINGS } from '@core/graphql/queries/user/getTooltipSettings'
import { getChartLayout } from '@core/graphql/queries/chart/getChartLayout'
import { updateTooltipSettings } from '@core/graphql/mutations/user/updateTooltipSettings'
import { changeChartLayout } from '@core/graphql/mutations/chart/changeChartLayout'
import { finishJoyride } from '@core/utils/joyride'
import JoyrideOnboarding from '@sb/components/JoyrideOnboarding/JoyrideOnboarding'
import { getChartSteps } from '@sb/config/joyrideSteps'

import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { withAuthStatus } from '@core/hoc/withAuthStatus'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getChartData } from '@core/graphql/queries/chart/getChartData'
import { pairProperties } from '@core/graphql/queries/chart/getPairProperties'
import {
  prefetchCoinSelector,
  prefetchDifferentMarketForCoinSelector,
  prefetchPortfolio,
  prefetchPortfolioMainSpot,
  prefetchPortfolioMainFutures,
  prefetchDeposit,
} from '@core/utils/prefetching'
import { checLoginStatusWrapper } from '@core/utils/loginUtils'

import withAuth from '@core/hoc/withAuth'
import { checkLoginStatus } from '@core/utils/loginUtils'
import { MainContainer, GlobalStyles } from './Chart.styles'
import { IProps } from './Chart.types'

function ChartPageComponent(props: any) {
  const [terminalViewMode, updateTerminalViewMode] = useState('default')
  const [stepIndex, updateStepIndex] = useState(0)
  const [key, updateKey] = useState(0)

  useEffect(() => {
    const { marketType } = props
    setTimeout(() => {
      prefetchCoinSelector({ marketType, exchangeSymbol: 'binance' })
    }, 5000)

    // prefetch different market for coin selector
    setTimeout(() => {
      prefetchDifferentMarketForCoinSelector({
        marketType: marketType === 1 ? 0 : 1,
        exchangeSymbol: 'binance',
      })
    }, 15000)

    setTimeout(() => {
      checLoginStatusWrapper(prefetchPortfolio)
    }, 30000)

    setTimeout(() => {
      checLoginStatusWrapper(prefetchPortfolioMainSpot)
    }, 45000)

    setTimeout(() => {
      checLoginStatusWrapper(prefetchPortfolioMainFutures)
    }, 55000)

    setTimeout(() => {
      checLoginStatusWrapper(prefetchDeposit)
    }, 75000)

    return () => {
      document.title = 'Cryptocurrencies AI'
    }
  }, [props.marketType])

  const handleJoyrideCallback = (data) => {
    if (
      data.action === 'close' ||
      data.action === 'skip' ||
      data.status === 'finished'
    ) {
      const {
        updateTooltipSettingsMutation,
        getTooltipSettingsQuery: { getTooltipSettings },
      } = props

      finishJoyride({
        updateTooltipSettingsMutation,
        getTooltipSettings,
        name: 'chartPage',
      })
    }

    switch (data.action) {
      case 'next': {
        if (data.lifecycle === 'complete') {
          updateStepIndex(stepIndex + 1)
        }
        break
      }
      case 'prev': {
        if (data.lifecycle === 'complete') {
          updateStepIndex(stepIndex - 1)
        }
        break
      }
    }

    if (
      data.status === 'finished' ||
      (data.status === 'stop' && data.index !== data.size - 1) ||
      data.status === 'reset'
    ) {
      updateKey(key + 1)
    }
  }

  const closeChartPagePopup = () => {
    finishJoyride({
      updateTooltipSettingsMutation: props.updateTooltipSettingsMutation,
      getTooltipSettings,
      name: 'chartPagePopup',
    })
  }

  const {
    getChartDataQuery: {
      getMyProfile: { _id } = { _id: '' },
      getTradingSettings: {
        selectedTradingKey,
        hedgeMode,
        isFuturesWarsKey,
      } = {
        selectedTradingKey: '',
        hedgeMode: false,
        isFuturesWarsKey: false,
      },
      marketByMarketType = [],
      chart: { activeExchange, currencyPair: { pair }, view } = {
        currencyPair: { pair: 'BTC_USDT' },
        activeExchange: { name: 'Binance', symbol: 'binance' },
        view: 'default',
      },
      app: { themeMode } = { themeMode: 'light' },
    },
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
  } = props

  let minPriceDigits
  let quantityPrecision
  let pricePrecision
  let minSpotNotional
  let minFuturesStep

  // hacky way to redirect to default market if user selected wrong market in url
  if (
    pairPropertiesQuery.loading === false &&
    pairPropertiesQuery.marketByName.length === 0
  ) {
    const chartPageType = marketType === 0 ? 'spot' : 'futures'
    const pathToRedirect = `/chart/${chartPageType}/BTC_USDT`
    return <Redirect to={pathToRedirect} exact />
  }

  const isPairDataLoading =
    !pair ||
    props.loading ||
    !pairPropertiesQuery.marketByName ||
    !pairPropertiesQuery.marketByName[0] ||
    pairPropertiesQuery.networkStatus === 2 ||
    pairPropertiesQuery.marketByName[0].properties.binance.symbol !==
      selectedPair.replace('_', '')

  if (isPairDataLoading) {
    minPriceDigits = 0.00000001
    quantityPrecision = 3
    minSpotNotional = 10
    minFuturesStep = 0.001
  } else {
    minPriceDigits = +props.pairPropertiesQuery.marketByName[0].properties
      .binance.filters[0].minPrice

    quantityPrecision = +props.pairPropertiesQuery.marketByName[0].properties
      .binance.quantityPrecision

    pricePrecision = +props.pairPropertiesQuery.marketByName[0].properties
      .binance.pricePrecision

    minSpotNotional =
      +props.pairPropertiesQuery.marketByName[0].properties.binance.filters[3]
        .minNotional || 10

    minFuturesStep =
      +props.pairPropertiesQuery.marketByName[0].properties.binance.filters[1]
        .stepSize || 0.001
  }

  const arrayOfMarketIds = marketByMarketType.map((el) => el._id)
  const selectedKey = selectedTradingKey
    ? { keyId: selectedTradingKey, hedgeMode, isFuturesWarsKey }
    : { keyId: '', hedgeMode: false, isFuturesWarsKey: false }

  console.log('chart page rerender')

  return (
    <MainContainer fullscreen={view !== 'default'}>
      <GlobalStyles />
      {view === 'default' && (
        <DefaultView
          id={_id}
          view={view}
          layout={layout}
          authenticated={authenticated}
          marketType={marketType}
          currencyPair={selectedPair}
          pricePrecision={pricePrecision}
          quantityPrecision={quantityPrecision}
          minPriceDigits={minPriceDigits}
          minSpotNotional={minSpotNotional}
          minFuturesStep={minFuturesStep}
          isPairDataLoading={isPairDataLoading}
          themeMode={themeMode}
          selectedKey={selectedKey}
          activeExchange={activeExchange}
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
          arrayOfMarketIds={arrayOfMarketIds}
          chartPagePopup={
            (getTooltipSettings.chartPagePopup === null ||
              getTooltipSettings.chartPagePopup) &&
            !getTooltipSettings.chartPage
          }
          closeChartPagePopup={closeChartPagePopup}
          changeChartLayoutMutation={changeChartLayoutMutation}
        />
      )}
      <JoyrideOnboarding
        continuous={true}
        stepIndex={stepIndex}
        showProgress={true}
        showSkipButton={true}
        key={key}
        steps={getChartSteps({ marketType })}
        open={getTooltipSettings.chartPage}
        handleJoyrideCallback={handleJoyrideCallback}
      />
    </MainContainer>
  )
}

const ChartPage = React.memo(ChartPageComponent, (prev, next) => {
  console.log('memo func chart page')

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
    prev.marketType === next.marketType &&
    prev.selectedPair === next.selectedPair &&
    prev.getChartDataQuery.getTradingSettings.selectedTradingKey ===
      next.getChartDataQuery.getTradingSettings.selectedTradingKey &&
    prev.getChartDataQuery.getTradingSettings.hedgeMode ===
      next.getChartDataQuery.getTradingSettings.hedgeMode &&
    prevIsPairDataLoading === nextIsPairDataLoading &&
    tooltipQueryChanged &&
    prev.getChartLayoutQuery.chart.layout.hideDepthChart ===
      next.getChartLayoutQuery.chart.layout.hideDepthChart &&
    prev.getChartLayoutQuery.chart.layout.hideOrderbook ===
      next.getChartLayoutQuery.chart.layout.hideOrderbook &&
    prev.getChartLayoutQuery.chart.layout.hideTradeHistory ===
      next.getChartLayoutQuery.chart.layout.hideTradeHistory
  )
})

// TODO: combine all queries to one
export default compose(
  withErrorFallback,
  withAuthStatus,
  // withAuth,
  queryRendererHoc({
    skip: (props: any) => !props.authenticated,
    query: getChartData,
    name: 'getChartDataQuery',
    // fetchPolicy: 'cache-and-network',
    fetchPolicy: 'cache-first',
    variables: {
      marketType: 1, // hardcode here to get only futures marketIds'
    },
  }),
  queryRendererHoc({
    skip: (props: any) => !props.authenticated,
    query: GET_TOOLTIP_SETTINGS,
    name: 'getTooltipSettingsQuery',
    fetchPolicy: 'cache-first',
    withOutSpinner: true,
    withoutLoading: true,
  }),
  queryRendererHoc({
    query: pairProperties,
    name: 'pairPropertiesQuery',
    fetchPolicy: 'cache-first',
    withoutLoading: true,
    variables: (props: IProps) => ({
      marketName: props.selectedPair,
      marketType: props.marketType,
    }),
  }),
  queryRendererHoc({
    query: getChartLayout,
    name: 'getChartLayoutQuery',
    fetchPolicy: 'cache-first',
    withoutLoading: true,
  }),
  graphql(updateTooltipSettings, {
    name: 'updateTooltipSettingsMutation',
  }),
  graphql(changeChartLayout, {
    name: 'changeChartLayoutMutation',
  })
)(ChartPage)
