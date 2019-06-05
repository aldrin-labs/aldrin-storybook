import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Slide } from '@material-ui/core'
import Joyride from 'react-joyride'

import * as actions from '@core/redux/chart/actions'
import WarningMessageSnack from '@sb/components/WarningMessageSnack/WarningMessageSnack'
import IndividualChart from './IndividualChart/IndividualChart'

import { IProps, IChart } from './OnlyCharts.types'
import { multiChartsSteps } from '@sb/config/joyrideSteps'
import { withErrorFallback } from '@core/hoc/withErrorFallback'

import { graphql } from 'react-apollo'

import { compose } from 'recompose'
import { GET_CHARTS } from '@core/graphql/queries/chart/getCharts'
import { ADD_CHART } from '@core/graphql/mutations/chart/addChart'
import { REMOVE_CHART } from '@core/graphql/mutations/chart/removeChart'
import { GET_LAYOUTS } from '@core/graphql/queries/chart/getLayouts'
import { ACTIVE_LAYOUT } from '@core/graphql/queries/chart/activeLayout'
import { SAVE_LAYOUT } from '@core/graphql/mutations/chart/saveLayout'
import { removeTypenameFromObject } from '@core/utils/apolloUtils'

import { queryRendererHoc } from '@core/components/QueryRenderer/index'
import { updateTooltipSettings } from '@core/graphql/mutations/user/updateTooltipSettings'
import { GET_TOOLTIP_SETTINGS } from '@core/graphql/queries/user/getTooltipSettings'

class OnlyCharts extends Component<IProps> {
  componentDidMount() {
    const { mainPair, getCharts, addChartMutation } = this.props
    const {
      multichart: { charts },
    } = getCharts
    if (charts.length === 0) {
      addChartMutation({
        variables: {
          chart: mainPair,
        },
      })
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
            multiChartPage: false,
          },
        },
      })
    }
  }

  removeChart = async (index) => {
    await this.props.removeChartMutation({
      variables: {
        index: index,
      },
    })
  }

  saveLayout = (name: String) => {
    const {
      getCharts: {
        multichart: { charts },
      },
      saveLayoutMutation,
    } = this.props

    saveLayoutMutation({
      variables: {
        name,
        charts: charts,
      },
    })
  }

  render() {
    const {
      openedWarning,
      removeWarningMessage,
      theme,
      view,
      getCharts: {
        multichart: { charts },
      },
      activeLayout: {
        multichart: { activeLayout },
      },
      userId,
      themeMode,
      getTooltipSettingsQuery: { getTooltipSettings },
    } = this.props
    return (
      <>
        <Joyride
          showProgress={true}
          showSkipButton={true}
          continuous={true}
          steps={multiChartsSteps}
          run={getTooltipSettings.multiChartPage}
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
              .filter((chart) => chart)
              .map((chart: IChart, i: number) => (
                <IndividualChart
                  key={chart}
                  theme={theme}
                  removeChart={this.removeChart}
                  index={i}
                  chartsCount={charts.length}
                  {/* TODO: Check this currencyPair={chart} */}
                  currencyPair={chart}
                  userId={userId}
                  themeMode={themeMode}
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
  openedWarning: store.chart.warningMessageOpened,
})

const mapDispatchToProps = (dispatch: any) => ({
  removeWarningMessage: () => dispatch(actions.removeWarningMessage()),
})

export default compose(
  queryRendererHoc({
    query: ACTIVE_LAYOUT,
    withOutSpinner: false,
    withTableLoader: false,
    name: 'activeLayout',
  }),
  queryRendererHoc({
    query: GET_CHARTS,
    withOutSpinner: false,
    withTableLoader: false,
    name: 'getCharts',
  }),
  queryRendererHoc({
    query: GET_TOOLTIP_SETTINGS,
    name: 'getTooltipSettingsQuery',
  }),
  graphql(updateTooltipSettings, { name: 'updateTooltipSettingsMutation' }),
  graphql(ADD_CHART, { name: 'addChartMutation' }),
  graphql(REMOVE_CHART, { name: 'removeChartMutation' }),
  graphql(SAVE_LAYOUT, { name: 'saveLayoutMutation' }),
  graphql(updateTooltipSettings, { name: 'updateTooltipSettingsMutation' }),
  graphql(ADD_CHART, { name: 'addChartMutation' }),
  withErrorFallback
)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OnlyCharts)
)
