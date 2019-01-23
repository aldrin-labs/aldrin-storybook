import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Slide } from '@material-ui/core'
import Joyride from 'react-joyride'

import * as actions from '@core/redux/chart/actions'
import WarningMessageSnack from '@storybook/components/WarningMessageSnack/WarningMessageSnack'
import IndividualChart from './IndividualChart/IndividualChart'
import * as userActions from '@core/redux/user/actions'

import { IProps, IChart } from './OnlyCharts.types'
import { multiChartsSteps } from '@storybook/config/joyrideSteps'
import { withErrorFallback } from '@core/hoc/withErrorFallback'

class OnlyCharts extends Component<IProps> {
  componentDidMount() {
    const { charts, addChart, mainPair } = this.props
    if (charts.length === 0) {
      addChart(mainPair)
    }
  }

  handleJoyrideCallback = (data) => {
    if (
      data.action === 'close' ||
      data.action === 'skip' ||
      data.status === 'finished'
    )
      this.props.hideToolTip('multiChartPage')
  }

  render() {
    const {
      charts,
      removeChart,
      openedWarning,
      removeWarningMessage,
      theme,
      view,
      demoMode,
    } = this.props

    return (
      <>
        <Joyride
          showProgress={true}
          showSkipButton={true}
          continuous={true}
          steps={multiChartsSteps}
          run={demoMode.multiChartPage}
          callback={this.handleJoyrideCallback}
          styles={{
            options: {
              backgroundColor: theme.palette.getContrastText(
                theme.palette.primary.main
              ),
              primaryColor: theme.palette.secondary.main,
              textColor: theme.palette.primary.main,
            },
            tooltip: {
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.fontSize,
            },
          }}
        />
        <Slide
          direction="left"
          timeout={500}
          in={true}
          mountOnEnter={true}
          unmountOnExit={true}
        >
          <ChartContainer
            data-e2e="chart-container"
            fullscreen={view !== 'default'}
            chartsCount={charts.length || 1}
          >
            {charts
              .filter((chart) => chart.id && chart.pair)
              .map((chart: IChart, i: number) => (
                <IndividualChart
                  key={chart.id}
                  theme={theme}
                  removeChart={removeChart}
                  index={i}
                  chartsCount={charts.length}
                  currencyPair={chart.pair}
                />
              ))}
            <WarningMessageSnack
              open={openedWarning}
              onCloseClick={removeWarningMessage}
              messageText={'You can create up to 8 charts.'}
            />
          </ChartContainer>
        </Slide>
      </>
    )
  }
}

const ChartContainer = styled.div`
  margin-top: ${(props: { chartsCount?: number; fullscreen: boolean }) => {
    if (
      !props.fullscreen &&
      (props.chartsCount === 3 || props.chartsCount === 4)
    ) {
      return '10vh'
    }
    return 0
  }};
  overflow: hidden;
  max-height: ${(props) =>
    props.fullscreen ? '100vh' : 'calc(100vh - 59px - 80px)'};
  width: 100%;
  display: grid;
  grid-template-columns: repeat(
    ${(props: { chartsCount?: number }) => {
      if (props.chartsCount && props.chartsCount <= 3) {
        return `${props.chartsCount}, ${100 / props.chartsCount}%`
      }
      return '4, 25%'
    }}
  );
  grid-template-rows: repeat(
    ${(props: { chartsCount?: number; fullscreen: boolean }) => {
      if (props.fullscreen) {
        if (props.chartsCount && props.chartsCount > 4) {
          return '2, calc(50vh - 30px)'
        }

        return '1, calc(100vh - 60px)'
      }
      if (props.chartsCount && props.chartsCount > 4) {
        return '2, 41.5vh'
      }
      if (props.chartsCount === 3 || props.chartsCount === 4) {
        return '1, 60vh'
      }
      return '1, 80vh'
    }}
  );
`

const mapStateToProps = (store: any) => ({
  charts: store.chart.charts,
  currencyPair: store.chart.currencyPair,
  isShownMocks: store.user.isShownMocks,
  openedWarning: store.chart.warningMessageOpened,
  demoMode: store.user.toolTip,
})

const mapDispatchToProps = (dispatch: any) => ({
  removeChart: (i: number) => dispatch(actions.removeChart(i)),
  addChart: (baseQuote: string) => dispatch(actions.addChart(baseQuote)),
  removeWarningMessage: () => dispatch(actions.removeWarningMessage()),
  hideToolTip: (tab: string) => dispatch(userActions.hideToolTip(tab)),
})

export default withErrorFallback(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OnlyCharts)
)
