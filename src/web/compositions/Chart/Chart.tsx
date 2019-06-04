import React from 'react'
import { connect } from 'react-redux'
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
import * as actions from '@core/redux/chart/actions'
import * as userActions from '@core/redux/user/actions'
import { ORDERS_MARKET_QUERY } from '@core/graphql/queries/chart/ORDERS_MARKET_QUERY'

import { MARKET_QUERY } from '@core/graphql/queries/chart/MARKET_QUERY'
import { MARKET_ORDERS } from '@core/graphql/subscriptions/MARKET_ORDERS'
import { MARKET_TICKERS } from '@core/graphql/subscriptions/MARKET_TICKERS'
import { GET_THEME_MODE } from '@core/graphql/queries/app/getThemeMode'
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
  Container,
  ChartsContainer,
  DepthChartContainer,
  MainContainer,
  TablesBlockWrapper,
  TablesContainer,
  Toggler,
  TogglerContainer,
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

@withTheme()
class Chart extends React.Component<IProps, IState> {
  state: IState = {
    view: 'default',
    aggregation: 0.01,
    showTableOnMobile: 'ORDER',
    activeChart: 'candle',
    joyride: false,
  }

  static getDerivedStateFromProps(nextProps: IProps) {
    const [base, quote] = nextProps.currencyPair.split('_')
    /* tslint:disable-next-line:no-object-mutation */
    document.title = `${base} to ${quote} | CCAI`
    return null
  }

  componentDidMount() {
    if (!this.state.joyride) {
      setTimeout(() => {
        this.setState({ joyride: true })
      }, 1000)
    }
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

  renderTables: any = () => {
    const { aggregation, showTableOnMobile } = this.state
    const { currencyPair } = this.props

    let quote
    if (currencyPair) {
      quote = currencyPair.split('_')[1]
    }

    const {
      activeExchange,
      theme,
      getTooltipSettingsQuery: { getTooltipSettings },
    } = this.props

    const symbol = currencyPair || ''
    const exchange = activeExchange.symbol

    return (
      <TablesContainer item sm={4} style={{ flex: 'auto' }}>
        <Joyride
          showProgress={true}
          showSkipButton={true}
          continuous={true}
          steps={singleChartSteps}
          run={this.state.joyride && getTooltipSettings.chartPage}
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
        <TablesBlockWrapper
          key={`orderbook_table`}
          background={theme.palette.background.default}
          variant={{
            show: showTableOnMobile === 'ORDER',
          }}
        >
          {/*{MASTER_BUILD && <ComingSoon />}*/}
          {/*<QueryRenderer*/}
          {/*component={OrderBookTable}*/}
          {/*withOutSpinner*/}
          {/*query={ORDERS_MARKET_QUERY}*/}
          {/*fetchPolicy="network-only"*/}
          {/*variables={{ symbol, exchange }}*/}
          {/*subscriptionArgs={{*/}
          {/*subscription: MARKET_ORDERS,*/}
          {/*variables: { symbol, exchange },*/}
          {/*updateQueryFunction: updateOrderBookQuerryFunction,*/}
          {/*}}*/}
          {/*{...{*/}
          {/*quote,*/}
          {/*symbol,*/}
          {/*activeExchange,*/}
          {/*currencyPair,*/}
          {/*aggregation,*/}
          {/*onButtonClick: this.changeTable,*/}
          {/*setOrders: this.props.setOrders,*/}
          {/*...this.props,*/}
          {/*key: 'orderbook_table_query_render',*/}
          {/*}}*/}
          {/*/>*/}

          {/*<Aggregation*/}
          {/*{...{*/}
          {/*theme,*/}
          {/*aggregation: this.state.aggregation,*/}
          {/*onButtonClick: this.setAggregation,*/}
          {/*key: 'aggregation_component',*/}
          {/*}}*/}
          {/*/>*/}
        </TablesBlockWrapper>

        <TablesBlockWrapper
          key={`tradehistory_table`}
          className="ExchangesTable"
          background={theme.palette.background.default}
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
              currencyPair,
              key: 'tradeyistory_table_query_render',
            }}
          />
        </TablesBlockWrapper>
      </TablesContainer>
    )
  }

  renderOnlyCharts = () => {
    const {
      getMyProfile: {
        getMyProfile: { _id },
      },
      themeMode,
    } = this.props

    return (
      <OnlyCharts
        {...{
          theme: this.props.theme,
          mainPair: this.props.currencyPair,
          view: this.props.view,
          userId: _id,
          themeMode: themeMode,
        }}
      />
    )
  }

  renderToggler = () => {
    const {
      toggleView,
      view,
      currencyPair,
      getCharts: {
        multichart: { charts },
      },
      addChartMutation,
    } = this.props
    const defaultView = view === 'default'

    return (
      <Toggler>
        <Fab
          data-e2e="switchChartPageMode"
          size="small"
          style={{
            height: 36,
          }}
          variant="extended"
          color="secondary"
          onClick={async () => {
            if (defaultView && charts === []) {
              await addChartMutation({
                variables: {
                  chart: currencyPair,
                },
              })
            }
            toggleView(defaultView ? 'onlyCharts' : 'default')
          }}
        >
          {defaultView ? 'Multi Charts' : ' Single Chart'}
        </Fab>
      </Toggler>
    )
  }

  renderTogglerBody = () => {
    const {
      view,
      currencyPair,
      activeExchange,
      getMyProfile: {
        getMyProfile: { _id },
      },
      themeMode,
    } = this.props
    const { activeChart } = this.state

    const toggler = this.renderToggler()

    return (
      <>
        {view === 'onlyCharts' && (
          <LayoutSelector userId={_id} themeMode={themeMode} />
        )}

        <SelectExchange
          selectExchange={this.props.selectExchange}
          activeExchange={activeExchange}
          currencyPair={currencyPair}
        />

        {view === 'default' && <KeySelector exchange={activeExchange} />}

        <AutoSuggestSelect
          value={view === 'default' && currencyPair}
          id={'currencyPair'}
          view={view}
          activeExchange={activeExchange}
        />

        {view === 'default' && (
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
        )}
        <Hidden smDown>{toggler}</Hidden>
      </>
    )
  }

  render() {
    const {
      view,
      currencyPair,
      getMyProfile: {
        getMyProfile: { _id },
      },
      activeExchange,
      getSelectedKeyQuery: {
        chart: { selectedKey },
      },
      getThemeModeQuery,
    } = this.props

    const themeMode =
      getThemeModeQuery &&
      getThemeModeQuery.app &&
      getThemeModeQuery.app.themeMode

    if (!currencyPair) {
      return
    }

    return (
      <MainContainer fullscreen={view !== 'default'}>
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
            currencyPair={currencyPair}
            id={_id}
            themeMode={themeMode}
            activeExchange={activeExchange}
            activeChart={this.state.activeChart}
            renderTogglerBody={this.renderTogglerBody}
            renderTables={this.renderTables}
            MASTER_BUILD={MASTER_BUILD}
          />
        )}
        {view === 'onlyCharts' && this.renderOnlyCharts()}
      </MainContainer>
    )
  }
}

const mapStateToProps = (store: any) => ({
  activeExchange: store.chart.activeExchange,
  view: store.chart.view,
  currencyPair: store.chart.currencyPair,
})

const mapDispatchToProps = (dispatch: any) => ({
  selectExchange: (ex: any) => dispatch(actions.selectExchange(ex)),
  toggleView: (view: 'default' | 'onlyCharts') =>
    dispatch(actions.toggleView(view)),
  setOrders: (payload: any) => dispatch(actions.setOrders(payload)),
})

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
    graphql(updateTooltipSettings, { name: 'updateTooltipSettingsMutation' }),
    graphql(ADD_CHART, { name: 'addChartMutation' })
  )(
    withErrorFallback(
      connect(
        mapStateToProps,
        mapDispatchToProps
      )(Chart)
    )
  )
)
