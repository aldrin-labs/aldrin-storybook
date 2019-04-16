import React from 'react'
import { connect } from 'react-redux'
import Joyride from 'react-joyride'
import { withTheme } from '@material-ui/styles'
import { setTimeout } from 'timers'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'

import { Button, Fade, Grid, Hidden } from '@material-ui/core'

import { OrderBookTable, Aggregation, TradeHistoryTable } from './Tables/Tables'
import AutoSuggestSelect from './Inputs/AutoSuggestSelect/AutoSuggestSelect'
import OnlyCharts from './OnlyCharts/OnlyCharts'
import MainDepthChart from './DepthChart/MainDepthChart/MainDepthChart'

import { singleChartSteps } from '@sb/config/joyrideSteps'
import TransparentExtendedFAB from '@sb/components/TransparentExtendedFAB'
import TablePlaceholderLoader from '@sb/components/TablePlaceholderLoader'
import { SingleChart } from '@sb/components/Chart'

import QueryRenderer, { queryRendererHoc } from '@core/components/QueryRenderer'
import * as actions from '@core/redux/chart/actions'
import * as userActions from '@core/redux/user/actions'
import { ORDERS_MARKET_QUERY } from '@core/graphql/queries/chart/ORDERS_MARKET_QUERY'

import { keysNames } from '@core/graphql/queries/chart/keysNames'

import { MARKET_QUERY } from '@core/graphql/queries/chart/MARKET_QUERY'
import { MARKET_ORDERS } from '@core/graphql/subscriptions/MARKET_ORDERS'
import { MARKET_TICKERS } from '@core/graphql/subscriptions/MARKET_TICKERS'
import {
  updateTradeHistoryQuerryFunction,
  updateOrderBookQuerryFunction,
} from '@core/utils/chartPageUtils'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import withAuth from '@core/hoc/withAuth'
import LayoutSelector from '@core/components/LayoutSelector'
import TradingComponent from '@core/components/TradingComponent'
import TradingTable from '@sb/components/TradingTable/TradingTable'
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
} from './Chart.styles'
import { IProps, IState } from './Chart.types'

import { GET_CHARTS } from '@core/graphql/queries/chart/getCharts'
import { GET_MY_PROFILE } from '@core/graphql/queries/profile/getMyProfile'
import { ADD_CHART } from '@core/graphql/mutations/chart/addChart'
import { MASTER_BUILD } from '@core/utils/config'

@withTheme()

class Chart extends React.Component<IProps, IState> {
  state: IState = {
    orders: [],
    view: 'default',
    exchangeTableCollapsed: true,
    aggregation: 0.01,
    showTableOnMobile: 'ORDER',
    activeChart: 'candle',
    exchanges: [],
    tradeHistory: [],
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

  roundTill = (n: number, initial: string): number => {
    //  need testing. Not working on all numbers
    // sorry have not much time
    // also working only on aggregation <=10
    // and keeps floor of number instead of round it
    let s = 0

    if (this.state.aggregation <= 5.0) {
      s = -4
    } else {
      s = -5
    }

    let agg = Number(
      initial
        .split('')
        .slice(s)
        .join('')
    )
    /* tslint:disable */
    while (n < agg) {
      agg = agg - n
    }
    /* tslint:enable */

    return +initial - agg
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

  handleJoyrideCallback = (data: any) => {
    if (
      data.action === 'close' ||
      data.action === 'skip' ||
      data.status === 'finished'
    ) {
      this.props.hideToolTip('chartPage')
    }
  }

  renderTables: any = () => {
    const { aggregation, showTableOnMobile } = this.state
    const { currencyPair } = this.props

    let quote
    if (currencyPair) {
      quote = currencyPair.split('_')[1]
    }

    const { activeExchange, theme, demoMode } = this.props

    const symbol = currencyPair || ''
    const exchange = activeExchange.symbol

    return (
      <TablesContainer item sm={4}>
        <Joyride
          showProgress={true}
          showSkipButton={true}
          continuous={true}
          steps={singleChartSteps}
          run={this.state.joyride && demoMode.chartPage}
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
          blur={false}
          background={theme.palette.background.default}
          rightBorderColor={theme.palette.divider}
          variant={{
            show: showTableOnMobile === 'ORDER',
          }}
        >
          <QueryRenderer
            component={OrderBookTable}
            withOutSpinner
            query={ORDERS_MARKET_QUERY}
            fetchPolicy="network-only"
            variables={{ symbol, exchange }}
            placeholder={TablePlaceholderLoader}
            subscriptionArgs={{
              subscription: MARKET_ORDERS,
              variables: { symbol, exchange },
              updateQueryFunction: updateOrderBookQuerryFunction,
            }}
            {...{
              quote,
              symbol,
              activeExchange,
              currencyPair,
              aggregation,
              onButtonClick: this.changeTable,
              roundTill: this.roundTill,
              setOrders: this.props.setOrders,
              ...this.props,
            }}
          />

          <Aggregation
            {...{
              theme,
              aggregation: this.state.aggregation,
              onButtonClick: this.setAggregation,
            }}
          />
        </TablesBlockWrapper>

        <TablesBlockWrapper
          className="ExchangesTable"
          blur={false}
          background={theme.palette.background.default}
          rightBorderColor={theme.palette.divider}
          variant={{
            show: showTableOnMobile === 'TRADE',
          }}
        >
          <QueryRenderer
            component={TradeHistoryTable}
            query={MARKET_QUERY}
            variables={{ symbol, exchange }}
            placeholder={() => (
              <TablePlaceholderLoader margin={'20% 0px 0px'} />
            )}
            subscriptionArgs={{
              subscription: MARKET_TICKERS,
              variables: { symbol, exchange },
              updateQueryFunction: updateTradeHistoryQuerryFunction,
            }}
            {...{
              quote,
              theme,
              currencyPair,
              symbol,
              exchange,
              ...this.props,
            }}
          />
        </TablesBlockWrapper>
      </TablesContainer>
    )
  }

  renderDefaultView = () => {
    const { activeChart } = this.state
    const {
      currencyPair,
      theme,
      getMyProfile: {
        getMyProfile: { _id },
      },
      themeMode,
      activeExchange,
      keysNames: { myPortfolios },
    } = this.props

    if (!currencyPair) {
      return
    }
    const [base, quote] = currencyPair.split('_')

    const filteredKeys = myPortfolios[0].keys.filter(key => key.exchange === activeExchange.name)

    const activeKey = filteredKeys.length ? filteredKeys[0] : ''

    return (
      <div>
      <Container container spacing={16}>
        <ChartsContainer item sm={8}>
          {activeChart === 'candle' ? (
            <SingleChart
              additionalUrl={`/?symbol=${base}/${quote}&user_id=${_id}&theme=${themeMode}`}
            />
          ) : (
            <Fade timeout={1000} in={activeChart === 'depth'}>
              <DepthChartContainer data-e2e="mainDepthChart">
                <MainDepthChart
                  {...{
                    theme,
                    base,
                    quote,
                    animated: false,
                  }}
                />
              </DepthChartContainer>
            </Fade>
          )}
        </ChartsContainer>
        {this.renderTables()}
      </Container>
      <Container container spacing={16}>
        <TradingTabelContainer item sm={8}>
          {MASTER_BUILD && <ComingSoon />}
          <TradingTable />
        </TradingTabelContainer>
        <TradingTerminalContainer item sm={4}>
          {MASTER_BUILD && <ComingSoon />}
          <TradingComponent
          activeKey={activeKey}
          activeExchange={activeExchange}
          pair={[base, quote]}
        />
        </TradingTerminalContainer>
      </Container>
    </div>
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
        <Button
          data-e2e="switchChartPageMode"
          size="small"
          style={{
            height: 36,
          }}
          variant="extendedFab"
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
        </Button>
      </Toggler>
    )
  }

  render() {
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

    if (!currencyPair) {
      return
    }

    const toggler = this.renderToggler()

    return (
      <MainContainer fullscreen={view !== 'default'}>
        <TogglerContainer container>
          <Grid
            spacing={16}
            item
            sm={view === 'default' ? 8 : 12}
            xs={view === 'default' ? 8 : 12}
            style={{ margin: '0 -8px', height: '100%' }}
            container
            alignItems="center"
            justify="flex-end"
          >
            {view === 'onlyCharts' && (
              <LayoutSelector userId={_id} themeMode={themeMode} />
            )}

            <SelectExchange
              selectExchange={this.props.selectExchange}
              activeExchange={activeExchange}
              currencyPair={currencyPair}
            />

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
          </Grid>
        </TogglerContainer>
        {view === 'default' && this.renderDefaultView()}
        {view === 'onlyCharts' && this.renderOnlyCharts()}
      </MainContainer>
    )
  }
}

const mapStateToProps = (store: any) => ({
  demoMode: store.user.toolTip,
  activeExchange: store.chart.activeExchange,
  view: store.chart.view,
  currencyPair: store.chart.currencyPair,
  themeMode: store.ui.theme,
})

const mapDispatchToProps = (dispatch: any) => ({
  selectExchange: (ex: any) => dispatch(actions.selectExchange(ex)),
  toggleView: (view: 'default' | 'onlyCharts') =>
    dispatch(actions.toggleView(view)),
  setOrders: (payload: any) => dispatch(actions.setOrders(payload)),
  hideToolTip: (tab: string) => dispatch(userActions.hideToolTip(tab)),
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
      query: keysNames,
      withOutSpinner: false,
      withTableLoader: false,
      name: 'keysNames',
    }),
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
