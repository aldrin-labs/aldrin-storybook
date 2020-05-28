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
import { updateTooltipSettings } from '@core/graphql/mutations/user/updateTooltipSettings'
import { finishJoyride } from '@core/utils/joyride'
import JoyrideOnboarding from '@sb/components/JoyrideOnboarding/JoyrideOnboarding'
import { getChartSteps } from '@sb/config/joyrideSteps'

import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getChartData } from '@core/graphql/queries/chart/getChartData'
import { pairProperties } from '@core/graphql/queries/chart/getPairProperties'
import {
  prefetchCoinSelector,
  prefetchDifferentMarketForCoinSelector,
} from '@core/utils/prefetching'

import withAuth from '@core/hoc/withAuth'
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
    getTooltipSettingsQuery: { getTooltipSettings = { chartPage: false } } = {
      getTooltipSettings: { chartPage: false },
    },
    pairPropertiesQuery,
    marketType,
    selectedPair,
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

  return (
    <MainContainer fullscreen={view !== 'default'}>
      <GlobalStyles />
      {view === 'default' && (
        <DefaultView
          id={_id}
          view={view}
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
          updateTerminalViewMode={updateTerminalViewMode}
          chartProps={props}
          arrayOfMarketIds={arrayOfMarketIds}
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

  return (
    prev.marketType === next.marketType &&
    prev.selectedPair === next.selectedPair &&
    prev.getChartDataQuery.getTradingSettings.selectedTradingKey ===
      next.getChartDataQuery.getTradingSettings.selectedTradingKey &&
    prev.getChartDataQuery.getTradingSettings.hedgeMode ===
      next.getChartDataQuery.getTradingSettings.hedgeMode &&
    prevIsPairDataLoading === nextIsPairDataLoading
  )
})

// TODO: combine all queries to one
export default compose(
  withErrorFallback,
  withAuth,
  queryRendererHoc({
    // skip: true,
    query: getChartData,
    name: 'getChartDataQuery',
    // fetchPolicy: 'cache-and-network',
    fetchPolicy: 'cache-first',
    variables: {
      marketType: 1, // hardcode here to get only futures marketIds'
    },
  }),
  queryRendererHoc({
    // skip: true,
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
    withoutLoading: true,
  }),
  graphql(updateTooltipSettings, {
    name: 'updateTooltipSettingsMutation',
  })
)(ChartPage)
