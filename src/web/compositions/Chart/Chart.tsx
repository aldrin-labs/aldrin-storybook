import React, { useState, useEffect, useMemo } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import { withTheme } from '@material-ui/styles'
import { compose, shallowEqual } from 'recompose'
import { graphql } from 'react-apollo'
import { isEqual } from 'lodash'
import { difference, shallowDifference } from '@core/utils/difference'

import { DefaultView } from './DefaultView/DefaultView'

import { getChartLayout } from '@core/graphql/queries/chart/getChartLayout'
import { updateTooltipSettings } from '@core/graphql/mutations/user/updateTooltipSettings'
import { selectTradingPair } from '@core/graphql/mutations/user/selectTradingPair'
import { changeChartLayout } from '@core/graphql/mutations/chart/changeChartLayout'
import { finishJoyride } from '@core/utils/joyride'
import { withSelectedPair } from '@core/hoc/withSelectedPair'
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
  prefetchWithdrawal,
  prefetchFuturesTransactions,
  prefetchSpotTransactions,
  prefetchTooltips,
} from '@core/utils/prefetching'
import { checkLoginStatusWrapper } from '@core/utils/loginUtils'

import withAuth from '@core/hoc/withAuth'
import { checkLoginStatus } from '@core/utils/loginUtils'
import { MainContainer, GlobalStyles } from './Chart.styles'
import { IProps } from './Chart.types'

export function ChartPageComponent(props: any) {
  const [terminalViewMode, updateTerminalViewMode] = useState('onlyTables')

  const { authenticated } = props

  useEffect(() => {
    const { marketType } = props
    setTimeout(() => {
      prefetchCoinSelector({ marketType, exchangeSymbol: 'binance' })
    }, 5000)

    setTimeout(() => {
       if (authenticated) {
          prefetchTooltips()
       }
    }, 6500)

    // prefetch different market for coin selector
    setTimeout(() => {
      prefetchDifferentMarketForCoinSelector({
        marketType: marketType === 1 ? 0 : 1,
        exchangeSymbol: 'binance',
      })
    }, 15000)

    setTimeout(() => {
      checkLoginStatusWrapper(prefetchPortfolio)
    }, 30000)

    setTimeout(() => {
      checkLoginStatusWrapper(prefetchPortfolioMainSpot)
    }, 45000)

    setTimeout(() => {
      checkLoginStatusWrapper(prefetchPortfolioMainFutures)
    }, 55000)

    setTimeout(() => {
      checkLoginStatusWrapper(prefetchDeposit)
    }, 75000)

    setTimeout(() => {
      checkLoginStatusWrapper(prefetchWithdrawal)
    }, 95000)

    setTimeout(() => {
      if (marketType === 1) {
        checkLoginStatusWrapper(prefetchFuturesTransactions)
      } else if (marketType === 0) {
        checkLoginStatusWrapper(prefetchSpotTransactions)
      }
    }, 95000)

    return () => {
      document.title = 'Cryptocurrencies AI'
    }
  }, [props.marketType])


  const {
    theme,
    pathname,
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
    },
    getChartLayoutQuery: {
      chart: { layout } = {
        layout: {
          hideDepthChart: true,
          hideOrderbook: false,
          hideTradeHistory: false,
          hideTradingViewChart: false,
        },
      },
    } = {
      chart: {
        layout: {
          hideDepthChart: true,
          hideOrderbook: false,
          hideTradeHistory: false,
          hideTradingViewChart: false,
        },
      },
    },
    pairPropertiesQuery,
    marketType,
    selectedPair,
    changeChartLayoutMutation,
  } = props

  let minPriceDigits
  let quantityPrecision
  let pricePrecision
  let minSpotNotional
  let minFuturesStep
  let initialLeverage

  // hacky way to redirect to default market if user selected wrong market in url
  // or we have no pair in url
  if (
    (pairPropertiesQuery.loading === false &&
      pairPropertiesQuery.marketByName.length === 0) ||
    !pathname.split('/')[3]
  ) {
    const chartPageType = marketType === 0 ? 'spot' : 'futures'
    const pathToRedirect = `/chart/${chartPageType}/${selectedPair}`
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
    initialLeverage = 125
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

    initialLeverage =
      (props.pairPropertiesQuery.marketByName[0].leverageBrackets &&
        +props.pairPropertiesQuery.marketByName[0].leverageBrackets.binance[0]
          .initialLeverage) ||
      125
  }

  const arrayOfMarketIds = marketByMarketType.map((el: { _id: string }) => el._id)
  const selectedKey = selectedTradingKey
    ? { keyId: selectedTradingKey, hedgeMode, isFuturesWarsKey }
    : { keyId: '', hedgeMode: false, isFuturesWarsKey: false }


  const memoizatedUpdateTerminalViewMode = useMemo(() => (mode: string) => { /// need to replace it
    if (mode === 'smartOrderMode') {
      finishJoyride({
        updateTooltipSettingsMutation:
          props.updateTooltipSettingsMutation,
        // we have old value here after changing, it produce strange behavior
        getTooltipSettings: null,
        name: 'chartPagePopup',
      })
    }

    updateTerminalViewMode(mode)
  }, [])  
  
  console.log('Chart RENDER')  

  return (
    <MainContainer fullscreen={view !== 'default'}>
      <GlobalStyles />
      {view === 'default' && (
        <DefaultView
          id={_id}
          view={view}
          layout={layout}
          theme={theme}
          authenticated={authenticated}
          marketType={marketType}
          currencyPair={selectedPair}
          maxLeverage={initialLeverage}
          minPriceDigits={minPriceDigits}
          minSpotNotional={minSpotNotional}
          minFuturesStep={minFuturesStep}
          isPairDataLoading={isPairDataLoading}
          themeMode={theme.palette.type}
          selectedKey={selectedKey}
          activeExchange={activeExchange}
          terminalViewMode={terminalViewMode}
          updateTerminalViewMode={memoizatedUpdateTerminalViewMode}
          arrayOfMarketIds={arrayOfMarketIds}
          changeChartLayoutMutation={changeChartLayoutMutation}
        />
      )}
    </MainContainer>
  )
}

const ChartPage = React.memo(ChartPageComponent, (prev, next) => {
  const isAuthenticatedUser = checkLoginStatus()

  if (!isAuthenticatedUser) {
    return false
  }

  console.log('Chart diff: ', difference(prev, next))
  console.log('Chart shallowDifference: ', shallowDifference(prev, next))
  console.log('Chart shallowEqual diff result:', shallowEqual(prev, next))

  return shallowEqual(prev, next)
})

// const MemoizedChartPage = React.memo(ChartPage)

// TODO: combine all queries to one
export default compose(
  withErrorFallback,
  withAuthStatus,
  withTheme(),
  withRouter,
  queryRendererHoc({
    skip: (props: any) => !props.authenticated,
    query: getChartData,
    name: 'getChartDataQuery',
    fetchPolicy: 'cache-first',
    variables: {
      marketType: 1, // hardcode here to get only futures marketIds'
    },
  }),
  graphql(selectTradingPair, { name: 'selectTradingPairMutation' }),
  withSelectedPair,
  queryRendererHoc({
    query: getChartLayout,
    name: 'getChartLayoutQuery',
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
  graphql(updateTooltipSettings, {
    name: 'updateTooltipSettingsMutation',
  }),
  graphql(changeChartLayout, {
    name: 'changeChartLayoutMutation',
  })
)(ChartPage)
