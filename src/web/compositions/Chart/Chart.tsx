import React from 'react'
// import Joyride from 'react-joyride'
import { withTheme } from '@material-ui/styles'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'

import { Grid, Hidden } from '@material-ui/core'

// import { Aggregation } from './Tables/Tables'
import AutoSuggestSelect from './Inputs/AutoSuggestSelect/AutoSuggestSelect'
import OnlyCharts from './OnlyCharts/OnlyCharts'
import DefaultView from './DefaultView/StatusWrapper'

// import { singleChartSteps } from '@sb/config/joyrideSteps'
import PillowButton from '@sb/components/SwitchOnOff/PillowButton'
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
import LayoutSelector from '@core/components/LayoutSelector'
import KeySelector from '@core/components/KeySelector'
import SelectExchange from './Inputs/SelectExchange/SelectExchange'

import {
  MainContainer,
  TablesContainer,
  TogglerContainer,
  PanelWrapper,
  PanelCard,
  PanelCardTitle,
  PanelCardValue,
  PanelCardSubValue,
  CustomCard,
} from './Chart.styles'
import { IProps, IState } from './Chart.types'


@withTheme
class Chart extends React.Component<IProps, IState> {
  state: IState = {
    aggregation: 0.01,
    showTableOnMobile: 'ORDER',
    activeChart: 'candle',
    joyride: false,
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
    this.setState((prevState: IProps) => ({
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

  renderTables: any = () => {
    const { aggregation, showTableOnMobile } = this.state
    const {
      getChartDataQuery: {
        chart: {
          activeExchange,
          currencyPair: { pair },
        },
      },
      theme,
    } = this.props

    let quote
    if (pair) {
      quote = pair.split('_')[1]
    }

    const symbol = pair || ''
    const exchange = activeExchange.symbol

    return (
      <TablesContainer item container direction="column" xs={7}>
        {/* <Joyride
          showProgress={true}
          showSkipButton={true}
          continuous={true}
          steps={singleChartSteps}
          run={this.state.joyride && getTooltipSettings.chartPage}
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
        /> */}

        {/* <Aggregation
            {...{
              theme,
              aggregation: this.state.aggregation,
              onButtonClick: this.setAggregation,
              key: 'aggregation_component',
            }}
          /> */}
      </TablesContainer>
    )
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

  renderTogglerBody = () => {
    const {
      getChartDataQuery: {
        getMyProfile: { _id },
        chart: {
          activeExchange,
          currencyPair: { pair },
          view,
        },
        app: { themeMode },
      },
      changeActiveExchangeMutation,
    } = this.props
    // const { activeChart } = this.state

    const selectStyles = {
      height: '100%',
      background: '#FFFFFF',
      marginRight: '.8rem',
      cursor: 'pointer',
      padding: 0,
      backgroundColor: '#fff',
      border: '0.1rem solid #e0e5ec',
      borderRadius: '0.75rem',
      boxShadow: '0px 0px 1.2rem rgba(8, 22, 58, 0.1)',
      width: '8.5%',
      '& div': {
        cursor: 'pointer',
        color: '#16253D',
        textTransform: 'uppercase',
        fontWeight: 'bold',
      },
      '& svg': {
        color: '#7284A0',
      },
      '.custom-select-box__control': {
        padding: '0 .75rem',
      },
      '.custom-select-box__menu': {
        minWidth: '130px',
        marginTop: '0',
        borderRadius: '0',
        boxShadow: '0px 4px 8px rgba(10,19,43,0.1)',
      },
    }

    return (
      <>
        <PanelWrapper>
          {view === 'onlyCharts' && (
            <LayoutSelector userId={_id} themeMode={themeMode} />
          )}

          <SelectExchange
            style={{ height: '100%' }}
            changeActiveExchangeMutation={changeActiveExchangeMutation}
            activeExchange={activeExchange}
            currencyPair={pair}
            selectStyles={selectStyles}
          />

          {view === 'default' && (
            <KeySelector
              exchange={activeExchange}
              selectStyles={{ ...selectStyles, width: '17%' }}
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

          <CustomCard style={{ display: 'flex', width: '50%' }}>
            <PanelCard first>
              <PanelCardTitle>Last price</PanelCardTitle>
              <span>
                <PanelCardValue color="#B93B2B">9,964.01</PanelCardValue>
                <PanelCardSubValue>$9964.01</PanelCardSubValue>
              </span>
            </PanelCard>

            <PanelCard>
              <PanelCardTitle>24h change</PanelCardTitle>
              <span>
                <PanelCardValue color="#2F7619">101.12</PanelCardValue>
                <PanelCardSubValue color="#2F7619">+1.03%</PanelCardSubValue>
              </span>
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

            <PanelCard style={{ borderRight: '0' }}>
              <PanelCardTitle>24h change</PanelCardTitle>
              <span>
                <PanelCardValue color="#2F7619">101.12</PanelCardValue>
                <PanelCardSubValue color="#2F7619">+1.03%</PanelCardSubValue>
              </span>
            </PanelCard>
          </CustomCard>

          <PillowButton
            firstHalfText={'single chart'}
            secondHalfText={'multichart'}
            activeHalf={'first'}
            changeHalf={() => { }}
            buttonAdditionalStyle={{ height: '100%', padding: '0 1rem' }}
          />

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
        </PanelWrapper>
      </>
    )
  }

  render() {
    const { aggregation, showTableOnMobile } = this.state

    const {
      getChartDataQuery: {
        getMyProfile: { _id },
        chart: {
          selectedKey,
          activeExchange,
          currencyPair: { pair },
          view,
        },
        app: { themeMode },
      },
    } = this.props

    if (!pair) {
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
            id={_id}
            currencyPair={pair}
            themeMode={themeMode}
            selectedKey={selectedKey}
            aggregation={aggregation}
            activeExchange={activeExchange}
            showTableOnMobile={showTableOnMobile}
            activeChart={this.state.activeChart}
            changeTable={this.changeTable}
            renderTogglerBody={this.renderTogglerBody}
            chartProps={this.props}
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
