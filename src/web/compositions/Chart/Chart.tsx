import React from 'react'
// import Joyride from 'react-joyride'
import { withTheme } from '@material-ui/styles'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'

import { Grid, Hidden } from '@material-ui/core'

import { CardsPanel } from './components'
import OnlyCharts from './OnlyCharts/OnlyCharts'
import DefaultView from './DefaultView/StatusWrapper'

// import { singleChartSteps } from '@sb/config/joyrideSteps'
// import TransparentExtendedFAB from '@sb/components/TransparentExtendedFAB'
// import { SingleChart } from '@sb/components/Chart'

import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { CHANGE_ACTIVE_EXCHANGE } from '@core/graphql/mutations/chart/changeActiveExchange'
import { CHANGE_VIEW_MODE } from '@core/graphql/mutations/chart/changeViewMode'
import { getChartData } from '@core/graphql/queries/chart/getChartData'
import { ADD_CHART } from '@core/graphql/mutations/chart/addChart'
import { MASTER_BUILD } from '@core/utils/config'
import { CHANGE_CURRENCY_PAIR } from '@core/graphql/mutations/chart/changeCurrencyPair'

import { removeTypenameFromObject } from '@core/utils/apolloUtils'

import withAuth from '@core/hoc/withAuth'
import {
  MainContainer,
  TablesContainer,
  TogglerContainer,
  GlobalStyles,
} from './Chart.styles'
import { IProps, IState } from './Chart.types'

@withTheme
class Chart extends React.Component<IProps, IState> {
  state: IState = {
    showTableOnMobile: 'ORDER',
    activeChart: 'candle',
    joyride: false,
    terminalViewMode: 'default',
  }

  static getDerivedStateFromProps(nextProps: IProps) {
    const {
      getChartDataQuery: {
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
    this.setState((prevState: IState) => ({
      showTableOnMobile:
        prevState.showTableOnMobile === 'ORDER' ? 'TRADE' : 'ORDER',
    }))
  }

  updateTerminalViewMode = (terminalViewMode: string) => {
    this.setState({ terminalViewMode })
  }

  handleJoyrideCallback = async (data: any) => {
    if (
      data.action === 'close' ||
      data.action === 'skip' ||
      data.status === 'finished'
    ) {
      const {
        updateTooltipSettingsMutation,
        getChartDataQuery: { getTooltipSettings },
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
    // i'll delete it with updating multichart, maybe it'll help me
    // <Toggler>
    //   <StyledSwitch
    //     data-e2e="switchChartPageMode"
    //     isActive={isSingleChart}
    //     onClick={async () => {
    //       if (charts === []) {
    //         await addChartMutation({
    //           variables: {
    //             chart: pair,
    //           },
    //         })
    //       }
    //       await changeViewModeMutation({
    //         variables: {
    //           view: 'default',
    //         },
    //       })
    //     }}
    //     style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
    //   >
    //     Single Chart
    //   </StyledSwitch>
    //   <StyledSwitch
    //     data-e2e="switchChartPageMode"
    //     isActive={!isSingleChart}
    //     onClick={async () => {
    //       await changeViewModeMutation({
    //         variables: {
    //           view: 'onlyCharts',
    //         },
    //       })
    //     }}
    //     style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
    //   >
    //     Multi Charts
    //   </StyledSwitch>
    // </Toggler>
  }

  render() {
    const { showTableOnMobile, terminalViewMode } = this.state

    const {
      getChartDataQuery: {
        getMyProfile: { _id },
        getTradingSettings: { selectedTradingKey } = {
          selectedTradingKey: '',
        },
        chart: {
          selectedKey,
          activeExchange,
          currencyPair: { pair },
          view,
          marketType,
        },
        app: { themeMode },
      },
      changeActiveExchangeMutation,
    } = this.props

    if (!pair) {
      return
    }

    return (
      <MainContainer fullscreen={view !== 'default'}>
        <GlobalStyles />
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
              <CardsPanel
                {...{
                  _id,
                  pair,
                  view,
                  themeMode,
                  activeExchange,
                  changeActiveExchangeMutation,
                }}
              />
            </Grid>
          </TogglerContainer>
        )}
        {view === 'default' && (
          <DefaultView
            id={_id}
            view={view}
            marketType={marketType}
            currencyPair={pair}
            themeMode={themeMode}
            selectedKey={selectedTradingKey ? { keyId: selectedTradingKey } : { keyId: '' }}
            activeExchange={activeExchange}
            terminalViewMode={terminalViewMode}
            updateTerminalViewMode={this.updateTerminalViewMode}
            showTableOnMobile={showTableOnMobile}
            activeChart={this.state.activeChart}
            changeTable={this.changeTable}
            chartProps={this.props}
            changeActiveExchangeMutation={changeActiveExchangeMutation}
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
      query: getChartData,
      name: 'getChartDataQuery',
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
    graphql(ADD_CHART, { name: 'addChartMutation' })
  )(withErrorFallback(Chart))
)
