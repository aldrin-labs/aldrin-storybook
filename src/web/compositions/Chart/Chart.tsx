import React from 'react'
import Joyride from 'react-joyride'
import { withTheme } from '@material-ui/styles'
import { setTimeout } from 'timers'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'

import { Fade, Grid, Hidden, Fab } from '@material-ui/core'

import { OrderBookTable, Aggregation, TradeHistoryTable } from './Tables/Tables'
import AutoSuggestSelect from './Inputs/AutoSuggestSelect/AutoSuggestSelect'
import OnlyCharts from './OnlyCharts/OnlyCharts'
import MainDepthChart from './DepthChart/MainDepthChart/MainDepthChart'

import { singleChartSteps } from '@sb/config/joyrideSteps'
import TransparentExtendedFAB from '@sb/components/TransparentExtendedFAB'
import { SingleChart } from '@sb/components/Chart'

import QueryRenderer, { queryRendererHoc } from '@core/components/QueryRenderer'
import { ORDERS_MARKET_QUERY } from '@core/graphql/queries/chart/ORDERS_MARKET_QUERY'

import { MARKET_QUERY } from '@core/graphql/queries/chart/MARKET_QUERY'
import { MARKET_ORDERS } from '@core/graphql/subscriptions/MARKET_ORDERS'
import { MARKET_TICKERS } from '@core/graphql/subscriptions/MARKET_TICKERS'
import { GET_THEME_MODE } from '@core/graphql/queries/app/getThemeMode'
import { GET_ACTIVE_EXCHANGE } from '@core/graphql/queries/chart/getActiveExchange'
import { CHANGE_ACTIVE_EXCHANGE } from '@core/graphql/mutations/chart/changeActiveExchange'
import { CHANGE_VIEW_MODE } from '@core/graphql/mutations/chart/changeViewMode'

import { removeTypenameFromObject } from '@core/utils/apolloUtils'

import {
  updateTradeHistoryQuerryFunction,
  updateOrderBookQuerryFunction,
} from '@core/utils/chartPageUtils'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import withAuth from '@core/hoc/withAuth'
import LayoutSelector from '@core/components/LayoutSelector'
import TradingComponent from '@core/components/TradingComponent'
import TradingTable from '@sb/components/TradingTable/TradingTable'
import KeySelector from '@core/components/KeySelector'
import SelectExchange from './Inputs/SelectExchange/SelectExchange'
import ComingSoon from '@sb/components/ComingSoon'

import {
  ChartMediaQueryForLg,
  Container,
  ChartsContainer,
  DepthChartContainer,
  MainContainer,
  TablesBlockWrapper,
  TablesContainer,
  Toggler,
  StyledSwitch,
  TogglerContainer,
  OrderbookContainer,
  TradeHistoryWrapper,
  WatchListContainer,
  PanelCard,
  PanelCardTitle,
  PanelCardValue,
  PanelCardSubValue,
  TradingTabelContainer,
  TradingTerminalContainer,
  ChartGridContainer,
} from './Chart.styles'
import { IProps, IState } from './Chart.types'

import { GET_CHARTS } from '@core/graphql/queries/chart/getCharts'
import { GET_MY_PROFILE } from '@core/graphql/queries/profile/getMyProfile'
import { ADD_CHART } from '@core/graphql/mutations/chart/addChart'
import { MASTER_BUILD } from '@core/utils/config'

import DefaultView from './DefaultView/StatusWrapper'
import { getSelectedKey } from '@core/graphql/queries/chart/getSelectedKey'
import { updateTooltipSettings } from '@core/graphql/mutations/user/updateTooltipSettings'
import { GET_TOOLTIP_SETTINGS } from '@core/graphql/queries/user/getTooltipSettings'
import { GET_CURRENCY_PAIR } from '@core/graphql/queries/chart/getCurrencyPair'
import { CHANGE_CURRENCY_PAIR } from '@core/graphql/mutations/chart/changeCurrencyPair'
import { GET_VIEW_MODE } from '@core/graphql/queries/chart/getViewMode'
import { updateTooltipMutation } from '@core/utils/TooltipUtils'

@withTheme()
class Chart extends React.Component<IProps, IState> {
  state: IState = {
    aggregation: 0.01,
    showTableOnMobile: 'ORDER',
    activeChart: 'candle',
    joyride: false,
  }

  static getDerivedStateFromProps(nextProps: IProps) {
    const {
      getCurrencyPairQuery: {
        chart: {
          currencyPair: { pair },
        },
      },
    } = nextProps

    const [base, quote] = pair.split('_')
    /* tslint:disable-next-line:no-object-mutation */
    document.title = `${base} to ${quote} | CCAI`
    return null
  }

  componentWillUnmount() {
    /* tslint:disable-next-line:no-object-mutation */
    document.title = 'Cryptocurrencies AI'
  }

  changeTable = () => {
    this.setState((prevState) => ({
      showTableOnMobile:
        prevState.showTableOnMobile === 'ORDER' ? 'TRADE' : 'ORDER',
    }))
  }

  setAggregation = () => {
    const { aggregation } = this.state
    switch (aggregation) {
      case 0.01:
        this.setState({ aggregation: 0.05 })
        break
      case 0.05:
        this.setState({ aggregation: 0.1 })
        break
      case 0.1:
        this.setState({ aggregation: 0.5 })
        break
      case 0.5:
        this.setState({ aggregation: 1 })
        break
      case 1:
        this.setState({ aggregation: 2.5 })
        break
      case 2.5:
        this.setState({ aggregation: 5 })
        break
      case 5:
        this.setState({ aggregation: 10 })
        break
      case 10:
        this.setState({ aggregation: 0.01 })
        break
      default:
        this.setState({ aggregation: 0.01 })

        break
    }
  }

  handleJoyrideCallback = async (data: any) => {
    if (
      data.action === 'close' ||
      data.action === 'skip' ||
      data.status === 'finished'
    ) {
      const {
        updateTooltipSettingsMutation,
        getTooltipSettingsQuery: { getTooltipSettings },
      } = this.props

      await updateTooltipSettingsMutation({
        variables: {
          settings: {
            ...removeTypenameFromObject(getTooltipSettings),
            chartPage: false,
          },
        },
      })
    }
  }

  renderDepthAndList = () => {
    return (
      <Grid item container direction="column" xs={5}>
        <DepthChartContainer>depth chart</DepthChartContainer>
        <WatchListContainer>watch list</WatchListContainer>
      </Grid>
    )
  }

  renderTables: any = () => {
    const { aggregation, showTableOnMobile } = this.state
    const {
      getCurrencyPairQuery: {
        chart: {
          currencyPair: { pair },
        },
      },
    } = this.props

    let quote
    if (pair) {
      quote = pair.split('_')[1]
    }

    const {
      theme,
      getTooltipSettingsQuery: { getTooltipSettings },
      getActiveExchangeQuery: {
        chart: { activeExchange },
      },
    } = this.props

    const symbol = pair || ''
    const exchange = activeExchange.symbol
    console.log('theme', theme)

    return (
      <TablesContainer item container direction="column" xs={7}>
        <Joyride
          showProgress={true}
          showSkipButton={true}
          continuous={true}
          steps={singleChartSteps}
          // run={this.state.joyride && getTooltipSettings.chartPage}
          run={false}
          callback={this.handleJoyrideCallback}
          styles={{
            options: {
              backgroundColor: theme.palette.common.white,
              primaryColor: theme.palette.secondary.main,
              textColor: theme.palette.common.black,
            },
            tooltip: {
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.fontSize,
            },
          }}
        />
        <OrderbookContainer key={`orderbook_table`}>
          <QueryRenderer
            component={OrderBookTable}
            withOutSpinner
            query={ORDERS_MARKET_QUERY}
            fetchPolicy="network-only"
            variables={{ symbol, exchange }}
            subscriptionArgs={{
              subscription: MARKET_ORDERS,
              variables: { symbol, exchange },
              updateQueryFunction: updateOrderBookQuerryFunction,
            }}
            {...{
              quote,
              symbol,
              activeExchange,
              currencyPair: pair,
              aggregation,
              onButtonClick: this.changeTable,
              setOrders: this.props.setOrders,
              ...this.props,
              key: 'orderbook_table_query_render',
            }}
          />
        </OrderbookContainer>

        {/* <Aggregation
            {...{
              theme,
              aggregation: this.state.aggregation,
              onButtonClick: this.setAggregation,
              key: 'aggregation_component',
            }}
          /> */}

        <TradeHistoryWrapper
          key={`tradehistory_table`}
          className="ExchangesTable"
          variant={{
            show: showTableOnMobile === 'TRADE',
          }}
        >
          <QueryRenderer
            component={TradeHistoryTable}
            query={MARKET_QUERY}
            variables={{ symbol, exchange }}
            subscriptionArgs={{
              subscription: MARKET_TICKERS,
              variables: { symbol, exchange },
              updateQueryFunction: updateTradeHistoryQuerryFunction,
            }}
            {...{
              quote,
              activeExchange,
              currencyPair: pair,
              key: 'tradeyistory_table_query_render',
            }}
          />
        </TradeHistoryWrapper>
      </TablesContainer>
    )
  }

  renderOnlyCharts = () => {
    const {
      getMyProfile: {
        getMyProfile: { _id },
      },
      theme,
      themeMode,
      getCurrencyPairQuery: {
        chart: {
          currencyPair: { pair },
        },
      },
      getViewModeQuery: {
        chart: { view },
      },
    } = this.props

    return (
      <OnlyCharts
        {...{
          theme: theme,
          mainPair: pair,
          view: view,
          userId: _id,
          themeMode: themeMode,
        }}
      />
    )
  }

  renderToggler = () => {
    const {
      changeViewModeMutation,
      getViewModeQuery: {
        chart: { view },
      },
      getCurrencyPairQuery: {
        chart: {
          currencyPair: { pair },
        },
      },
      getCharts: {
        multichart: { charts },
      },
      addChartMutation,
    } = this.props
    const isSingleChart = view === 'default'

    return (
      <Toggler>
        <StyledSwitch
          data-e2e="switchChartPageMode"
          isActive={isSingleChart}
          onClick={async () => {
            if (charts === []) {
              await addChartMutation({
                variables: {
                  chart: pair,
                },
              })
            }

            await changeViewModeMutation({
              variables: {
                view: 'default',
              },
            })
          }}
          style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
        >
          Single Chart
        </StyledSwitch>

        <StyledSwitch
          data-e2e="switchChartPageMode"
          isActive={!isSingleChart}
          onClick={async () => {
            await changeViewModeMutation({
              variables: {
                view: 'onlyCharts',
              },
            })
          }}
          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
        >
          Multi Charts
        </StyledSwitch>
      </Toggler>
    )
  }

  renderTogglerBody = () => {
    const {
      getCurrencyPairQuery: {
        chart: {
          currencyPair: { pair },
        },
      },
      getActiveExchangeQuery: {
        chart: { activeExchange },
      },
      getMyProfile: {
        getMyProfile: { _id },
      },
      getViewModeQuery: {
        chart: { view },
      },
      themeMode,
      changeActiveExchangeMutation,
    } = this.props
    const { activeChart } = this.state

    const toggler = this.renderToggler()

    const selectStyles = {
      border: 'none',
      background: '#FFFFFF',
      marginRight: '8px',
      cursor: 'pointer',
      '& div': {
        cursor: 'pointer',
        color: '#16253D',
        textTransform: 'uppercase',
        fontWeight: 'bold',
      },
      '& svg': {
        color: '#7284A0',
      },
      '.custom-select-box__menu': {
        minWidth: '130px',
        marginTop: '0',
        borderRadius: '0',
        boxShadow: '0px 4px 8px rgba(10,19,43,0.1)',
        left: '-16px',
      },
    }

    return (
      <>
        {view === 'onlyCharts' && (
          <LayoutSelector userId={_id} themeMode={themeMode} />
        )}

        <SelectExchange
          changeActiveExchangeMutation={changeActiveExchangeMutation}
          activeExchange={activeExchange}
          currencyPair={pair}
          selectStyles={selectStyles}
        />

        {view === 'default' && (
          <KeySelector
            exchange={activeExchange}
            selectStyles={selectStyles}
            isAccountSelect={true}
          />
        )}

        <AutoSuggestSelect
          value={view === 'default' && pair}
          id={'currencyPair'}
          view={view}
          activeExchange={activeExchange}
          selectStyles={selectStyles}
        />

        <PanelCard first>
          <PanelCardTitle>Last price</PanelCardTitle>
          <PanelCardValue color="#B93B2B">9,964.01</PanelCardValue>
          <PanelCardSubValue>$9964.01</PanelCardSubValue>
        </PanelCard>

        <PanelCard>
          <PanelCardTitle>24h change</PanelCardTitle>
          <PanelCardValue color="#2F7619">101.12</PanelCardValue>
          <PanelCardSubValue color="#2F7619">+1.03%</PanelCardSubValue>
        </PanelCard>

        <PanelCard>
          <PanelCardTitle>24h high</PanelCardTitle>
          <PanelCardValue>10,364.01</PanelCardValue>
        </PanelCard>

        <PanelCard>
          <PanelCardTitle>24h low</PanelCardTitle>
          <PanelCardValue>9,525.00</PanelCardValue>
        </PanelCard>

        <PanelCard>
          <PanelCardTitle>24h volume</PanelCardTitle>
          <PanelCardValue>427,793,139.70</PanelCardValue>
        </PanelCard>

        {/* {view === 'default' && (
          <TransparentExtendedFAB
            onClick={() => {
              this.setState((prevState) => ({
                activeChart:
                  prevState.activeChart === 'candle' ? 'depth' : 'candle',
              }))
            }}
          >
            {activeChart === 'candle' ? 'orderbook' : 'chart'}
          </TransparentExtendedFAB>
        )} */}

        <Hidden smDown>{toggler}</Hidden>
      </>
    )
  }

  render() {
    const {
      getMyProfile: {
        getMyProfile: { _id },
      },
      getSelectedKeyQuery: {
        chart: { selectedKey },
      },
      getThemeModeQuery,
      getActiveExchangeQuery: {
        chart: { activeExchange },
      },
      getCurrencyPairQuery: {
        chart: {
          currencyPair: { pair },
        },
      },
      getViewModeQuery: {
        chart: { view },
      },
      theme,
    } = this.props

    const themeMode =
      getThemeModeQuery &&
      getThemeModeQuery.app &&
      getThemeModeQuery.app.themeMode

    if (!pair) {
      return
    }
    console.log(getThemeModeQuery)
    return (
      <MainContainer fullscreen={view !== 'default'}>
        <ChartMediaQueryForLg />
        {view === 'onlyCharts' && (
          <TogglerContainer container>
            <Grid
              spacing={16}
              item
              sm={view === 'default' ? 8 : 12}
              xs={view === 'default' ? 8 : 12}
              container
              alignItems="left"
              justify="flex-end"
            >
              {this.renderTogglerBody()}
            </Grid>
          </TogglerContainer>
        )}
        {view === 'default' && (
          <DefaultView
            selectedKey={selectedKey}
            currencyPair={pair}
            id={_id}
            themeMode={themeMode}
            activeExchange={activeExchange}
            activeChart={this.state.activeChart}
            renderTogglerBody={this.renderTogglerBody}
            renderTables={this.renderTables}
            renderDepthAndList={this.renderDepthAndList}
            MASTER_BUILD={MASTER_BUILD}
          />
        )}
        {view === 'onlyCharts' && this.renderOnlyCharts()}
      </MainContainer>
    )
  }
}

export default withAuth(
  compose(
    queryRendererHoc({
      query: GET_MY_PROFILE,
      withOutSpinner: false,
      withTableLoader: false,
      name: 'getMyProfile',
    }),
    queryRendererHoc({
      query: GET_CHARTS,
      withOutSpinner: false,
      withTableLoader: false,
      name: 'getCharts',
    }),
    queryRendererHoc({
      query: getSelectedKey,
      name: 'getSelectedKeyQuery',
    }),
    queryRendererHoc({
      query: GET_THEME_MODE,
      name: 'getThemeModeQuery',
    }),
    queryRendererHoc({
      query: GET_TOOLTIP_SETTINGS,
      name: 'getTooltipSettingsQuery',
    }),
    queryRendererHoc({
      query: GET_ACTIVE_EXCHANGE,
      name: 'getActiveExchangeQuery',
    }),
    queryRendererHoc({
      query: GET_CURRENCY_PAIR,
      name: 'getCurrencyPairQuery',
    }),
    queryRendererHoc({
      query: GET_VIEW_MODE,
      name: 'getViewModeQuery',
    }),
    graphql(CHANGE_CURRENCY_PAIR, {
      name: 'changeCurrencyPairMutation',
    }),
    graphql(CHANGE_ACTIVE_EXCHANGE, {
      name: 'changeActiveExchangeMutation',
    }),
    graphql(CHANGE_VIEW_MODE, {
      name: 'changeViewModeMutation',
    }),
    graphql(updateTooltipSettings, {
      name: 'updateTooltipSettingsMutation',
      options: {
        update: updateTooltipMutation,
      },
    }),
    graphql(ADD_CHART, { name: 'addChartMutation' })
  )(withErrorFallback(Chart))
)

// queryrender na save
// .0 доабвлять к числам
// zero values error
// popup for property
// name order - popup
