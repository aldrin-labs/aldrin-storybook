import React from 'react'
import { connect } from 'react-redux'
import Joyride from 'react-joyride'
import { withTheme } from '@material-ui/styles'
import { setTimeout } from 'timers'

import { Button, Fade, Card, Grid, Hidden } from '@material-ui/core'

import {
  OrderBookTable,
  Aggregation,
  TradeHistoryTable,
  ExchangesTable,
} from './Tables/Tables'
import { orders } from './mocks'
import AutoSuggestSelect from './Inputs/AutoSuggestSelect/AutoSuggestSelect'
import OnlyCharts from './OnlyCharts/OnlyCharts'
import MainDepthChart from './DepthChart/MainDepthChart/MainDepthChart'

import { singleChartSteps } from '@storybook/config/joyrideSteps'
import TransparentExtendedFAB from '@storybook/components/TransparentExtendedFAB'
import TablePlaceholderLoader from '@storybook/components/TablePlaceholderLoader'
import { SingleChart } from '@storybook/components/Chart'

import QueryRenderer from '@core/components/QueryRenderer'
import * as actions from '@core/redux/chart/actions'
import * as userActions from '@core/redux/user/actions'
import { ORDERS_MARKET_QUERY } from '@core/graphql/queries/chart/ORDERS_MARKET_QUERY'
import { MARKET_QUERY } from '@core/graphql/queries/chart/MARKET_QUERY'
import { exchangeQuery } from '@core/graphql/queries/chart/exchangeQuery'
import { MARKET_ORDERS } from '@core/graphql/subscriptions/MARKET_ORDERS'
import { MARKET_TICKERS } from '@core/graphql/subscriptions/MARKET_TICKERS'
import {
  updateTradeHistoryQuerryFunction,
  updateOrderBookQuerryFunction,
} from '@core/utils/chartPageUtils'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import withAuth from '@core/hoc/withAuth'

import {
  Container,
  ChartsContainer,
  DepthChartContainer,
  MainContainer,
  TablesBlockWrapper,
  TablesContainer,
  Toggler,
  TogglerContainer,
} from './Chart.styles'
import { IProps, IState } from './Chart.types'

class Chart extends React.Component<IProps, IState> {
  state = {
    view: 'default',
    orders,
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

  sortOrders = (index: number) => {
    const { orders, currentSort } = this.state

    const newOrders = orders.slice().sort((a, b) => {
      if (currentSort && currentSort.index === index) {
        if (currentSort.arg === 'ASC') {
          this.setState({ currentSort: { index, arg: 'DESC' } })
          return b[index] - a[index]
        } else {
          this.setState({ currentSort: { index, arg: 'ASC' } })
          return a[index] - b[index]
        }
      }
      this.setState({ currentSort: { index, arg: 'ASC' } })
      return a[index] - b[index]
    })

    this.setState({ orders: newOrders })
  }

  changeExchange = (i: any) => {
    this.props.selectExchange(i)
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

  handleJoyrideCallback = (data) => {
    if (
      data.action === 'close' ||
      data.action === 'skip' ||
      data.status === 'finished'
    )
      this.props.hideToolTip('chartPage')
  }

  renderTables: any = () => {
    const { aggregation, showTableOnMobile } = this.state
    const { currencyPair } = this.props

    let quote
    if (currencyPair) {
      quote = currencyPair.split('_')[1]
    }

    const { activeExchange, theme, demoMode } = this.props
    const { changeExchange } = this

    const symbol = currencyPair || ''
    const exchange =
      activeExchange && activeExchange.exchange
        ? activeExchange.exchange.symbol
        : ''

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
              onButtonClick: this.changeTable,
              roundTill: this.roundTill,
              activeExchange,
              currencyPair,
              aggregation,
              quote,
              setOrders: this.props.setOrders,
              symbol,
              exchange,
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
            component={ExchangesTable}
            query={exchangeQuery}
            variables={{ marketName: currencyPair }}
            placeholder={TablePlaceholderLoader}
            {...{
              activeExchange,
              changeExchange,
              quote,
              theme,
              onButtonClick: this.changeTable,
              ...this.props,
            }}
          />

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
              activeExchange,
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
    const { currencyPair, theme } = this.props

    if (!currencyPair) {
      return
    }
    const [base, quote] = currencyPair.split('_')

    return (
      <Container container spacing={16}>
        <ChartsContainer item sm={8}>
          {activeChart === 'candle' ? (
            <SingleChart additionalUrl={`/?symbol=${base}/${quote}`} />
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
    )
  }

  renderOnlyCharts = () => (
    <OnlyCharts
      {...{
        theme: this.props.theme,
        mainPair: this.props.currencyPair,
        view: this.props.view,
      }}
    />
  )

  renderToggler = () => {
    const { toggleView, view, isNoCharts, currencyPair, addChart } = this.props

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
          onClick={() => {
            toggleView(defaultView ? 'onlyCharts' : 'default')
            if (defaultView && isNoCharts) addChart(currencyPair)
          }}
        >
          {defaultView ? 'Multi Charts' : ' Single Chart'}
        </Button>
      </Toggler>
    )
  }

  render() {
    const { view, currencyPair, activeExchange, theme } = this.props
    const { activeChart } = this.state
    const { palette } = theme

    if (!currencyPair) {
      return
    }
    const [base, quote] = currencyPair.split('_')
    const toggler = this.renderToggler()

    return (
      <MainContainer fullscreen={view !== 'default'}>
        <TogglerContainer container className="AutoSuggestSelect">
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
            <AutoSuggestSelect
              value={view === 'default' && currencyPair}
              id={'currencyPair'}
              view={view}
              exchange={activeExchange}
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
  activeExchange: store.chart.activeExchange,
  isNoCharts: store.chart.charts.length === 0,
  demoMode: store.user.toolTip,
  view: store.chart.view,
  currencyPair: store.chart.currencyPair,
  isShownMocks: store.user.isShownMocks,
})

const mapDispatchToProps = (dispatch: any) => ({
  selectExchange: (ex: any) => dispatch(actions.selectExchange(ex)),
  toggleView: (view: 'default' | 'onlyCharts') =>
    dispatch(actions.toggleView(view)),
  selectCurrencies: (baseQuote: string) =>
    dispatch(actions.selectCurrencies(baseQuote)),
  addChart: (payload) => dispatch(actions.addChart(payload)),
  setOrders: (payload) => dispatch(actions.setOrders(payload)),
  hideToolTip: (tab: string) => dispatch(userActions.hideToolTip(tab)),
})
const ThemeWrapper = (props) => <Chart {...props} />
const ThemedChart = withTheme()(ThemeWrapper)

export default withAuth(
  withErrorFallback(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(ThemedChart)
  )
)
