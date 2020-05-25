import React from 'react'
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
import { MASTER_BUILD } from '@core/utils/config'

import {
  prefetchCoinSelector,
  prefetchDifferentMarketForCoinSelector,
} from '@core/utils/prefetching'

// import { removeTypenameFromObject } from '@core/utils/apolloUtils'

import withAuth from '@core/hoc/withAuth'
import {
  MainContainer,
  // TablesContainer,
  // TogglerContainer,
  GlobalStyles,
} from './Chart.styles'
import { IProps, IState } from './Chart.types'

@withTheme()
class Chart extends React.PureComponent<IProps, IState> {
  state: IState = {
    showTableOnMobile: 'ORDER',
    activeChart: 'candle',
    joyride: false,
    terminalViewMode: 'default',
    stepIndex: 0,
    key: 0,
  }

  componentDidMount() {
    // prefetching coin selector after some time
    const { marketType } = this.props
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
  }

  componentWillUnmount() {
    /* tslint:disable-next-line:no-object-mutation */
    document.title = 'Cryptocurrencies AI'
  }

  changeTable = () => {
    this.setState((prevState: IState) => ({
      showTableOnMobile:
        prevState.showTableOnMobile === 'ORDER' ? 'TRADE' : 'ORDER',
    }))
  }

  updateTerminalViewMode = (terminalViewMode: string) => {
    this.setState({ terminalViewMode })
  }

  handleJoyrideCallback = (data: any) => {
    if (
      data.action === 'close' ||
      data.action === 'skip' ||
      data.status === 'finished'
    ) {
      const {
        updateTooltipSettingsMutation,
        getTooltipSettingsQuery: { getTooltipSettings },
      } = this.props

      finishJoyride({
        updateTooltipSettingsMutation,
        getTooltipSettings,
        name: 'chartPage',
      })
    }

    switch (data.action) {
      case 'next': {
        if (data.lifecycle === 'complete') {
          this.setState((prev) => ({ stepIndex: prev.stepIndex + 1 }))
        }
        break
      }
      case 'prev': {
        if (data.lifecycle === 'complete') {
          this.setState((prev) => ({ stepIndex: prev.stepIndex - 1 }))
        }
        break
      }
    }

    if (
      data.status === 'finished' ||
      (data.status === 'stop' && data.index !== data.size - 1) ||
      data.status === 'reset'
    ) {
      const oldKey = this.state.key
      this.setState({ key: oldKey + 1 })
    }
  }
  renderOnlyCharts = () => {
    const {
      getChartDataQuery: {
        getMyProfile: { _id },
        chart: {
          currencyPair: { pair },
          view,
        },
        app: { themeMode },
      },
      theme,
      selectedPair,
    } = this.props

    return (
      <OnlyCharts
        {...{
          theme: theme,
          mainPair: selectedPair,
          view: view,
          userId: _id,
          themeMode: themeMode,
        }}
      />
    )
  }

  render() {
    const { showTableOnMobile, terminalViewMode } = this.state

    const {
      getChartDataQuery: {
        getMyProfile: { _id } = { _id: '' },
        getTradingSettings: { selectedTradingKey, hedgeMode } = {
          selectedTradingKey: '',
          hedgeMode: false,
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
    } = this.props

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
      this.props.loading ||
      !pairPropertiesQuery.marketByName ||
      !pairPropertiesQuery.marketByName[0] ||
      pairPropertiesQuery.networkStatus === 2

    if (isPairDataLoading) {
      minPriceDigits = 0.00000001
      quantityPrecision = 3
      minSpotNotional = 10
      minFuturesStep = 0.001
    } else {
      minPriceDigits = +this.props.pairPropertiesQuery.marketByName[0]
        .properties.binance.filters[0].minPrice

      quantityPrecision = +this.props.pairPropertiesQuery.marketByName[0]
        .properties.binance.quantityPrecision

      pricePrecision = +this.props.pairPropertiesQuery.marketByName[0]
        .properties.binance.pricePrecision

      minSpotNotional =
        +this.props.pairPropertiesQuery.marketByName[0].properties.binance
          .filters[3].minNotional || 10

      minFuturesStep =
        +this.props.pairPropertiesQuery.marketByName[0].properties.binance
          .filters[1].stepSize || 0.001
    }

    const arrayOfMarketIds = marketByMarketType.map((el) => el._id)

    return (
      <MainContainer fullscreen={view !== 'default'}>
        <GlobalStyles />
        {/* {view === 'onlyCharts' && (
          <TogglerContainer container>
            <Grid
              spacing={16}
              item
              sm={view === 'default' ? 8 : 12}
              xs={view === 'default' ? 8 : 12}
              container
              justify="flex-end"
            >
              <CardsPanel
                {...{
                  _id,
                  pair: selectedPair,
                  view,
                  themeMode,
                  activeExchange,
                  marketType,
                }}
              />
            </Grid>
          </TogglerContainer>
        )} */}
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
            selectedKey={
              selectedTradingKey
                ? { keyId: selectedTradingKey, hedgeMode }
                : { keyId: '', hedgeMode: false }
            }
            activeExchange={activeExchange}
            terminalViewMode={terminalViewMode}
            updateTerminalViewMode={this.updateTerminalViewMode}
            showTableOnMobile={showTableOnMobile}
            activeChart={this.state.activeChart}
            changeTable={this.changeTable}
            chartProps={this.props}
            arrayOfMarketIds={arrayOfMarketIds}
            MASTER_BUILD={MASTER_BUILD}
          />
        )}
        {/* {view === 'onlyCharts' && this.renderOnlyCharts()} */}
        <JoyrideOnboarding
          continuous={true}
          stepIndex={this.state.stepIndex}
          showProgress={true}
          showSkipButton={true}
          key={this.state.key}
          steps={getChartSteps({ marketType })}
          open={getTooltipSettings.chartPage}
          handleJoyrideCallback={this.handleJoyrideCallback}
        />
      </MainContainer>
    )
  }
}

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
  }),
  queryRendererHoc({
    query: pairProperties,
    name: 'pairPropertiesQuery',
    fetchPolicy: 'cache-first',
    variables: (props: IProps) => ({
      marketName: props.selectedPair,
      marketType: props.marketType,
    }),
  }),
  graphql(updateTooltipSettings, {
    name: 'updateTooltipSettingsMutation',
  })
)(Chart)
