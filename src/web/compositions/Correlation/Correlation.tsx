import * as React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Joyride from 'react-joyride'

import QueryRenderer from '@core/components/QueryRenderer'
import { CorrelationMatrixMockData } from './mocks'
import { CorrelationMatrix } from '@storybook/components/index'
import { IProps } from './Correlation.types'
import {
  toggleCorrelationTableFullscreen,
  setCorrelationPeriod as setCorrelationPeriodAction,
} from '@core/redux/portfolio/actions'
import { getCorrelationQuery } from '@core/graphql/queries/portfolio/correlation/getCorrelationQuery'
import { swapDates } from '@core/utils/PortfolioTableUtils'
import { PTWrapper as PTWrapperRaw } from '@storybook/styles/cssUtils'
import { testJSON } from '@core/utils/chartPageUtils'
import { CustomError } from '@storybook/components/index'
import { portfolioCorrelationSteps } from '@storybook/config/joyrideSteps'
import * as actions from '@core/redux/user/actions'
import { MASTER_BUILD } from '@core/utils/config'

const Correlation = (props: IProps) => {
  const {
    children,
    isFullscreenEnabled,
    period,
    setCorrelationPeriodToStore,
    theme,
    startDate,
    endDate,
  } = props

  let dataRaw = {}
  if (
    props.data.myPortfolios &&
    props.data.myPortfolios.length > 0 &&
    typeof props.data.myPortfolios[0].correlationMatrixByDay === 'string' &&
    props.data.myPortfolios[0].correlationMatrixByDay.length > 0
  ) {
    const matrix = props.data.myPortfolios[0].correlationMatrixByDay
    dataRaw = testJSON(matrix) ? JSON.parse(matrix) : matrix
  } else {
    return <CustomError error={'wrongShape'} />
  }

  return (
    <>
      {children}
      <CorrelationMatrix
        fullScreenChangeHandler={props.toggleFullscreen}
        isFullscreenEnabled={isFullscreenEnabled || false}
        data={dataRaw}
        theme={theme}
        setCorrelationPeriod={setCorrelationPeriodToStore}
        period={period}
        dates={{ startDate, endDate }}
      />
    </>
  )
}

const CorrelationWrapper = (props: IProps) => {
  const { isShownMocks, children, theme, tab } = props
  let { startDate, endDate } = props
  let key = 0

  // startDate must be less always
  //  but if somehow not I will swap them
  if (startDate > endDate) {
    startDate = swapDates({ startDate, endDate }).startDate
    endDate = swapDates({ startDate, endDate }).endDate
  }

  const handleJoyrideCallback = (data) => {
    if (
      data.action === 'close' ||
      data.action === 'skip' ||
      data.status === 'finished'
    )
      props.hideToolTip('Correlation')
    if (data.status === 'finished') {
      key = key + 1
    }
  }

  return (
    <PTWrapper>
      <Joyride
        steps={portfolioCorrelationSteps}
        run={props.toolTip.portfolioCorrelation && tab === 'correlation'}
        callback={handleJoyrideCallback}
        key={key}
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
      {isShownMocks && !MASTER_BUILD ? (
        <Correlation
          key="=/"
          data={{
            myPortfolios: [
              {
                correlationMatrixByDay: JSON.stringify(
                  CorrelationMatrixMockData
                ),
              },
            ],
          }}
          theme={theme}
          children={children}
          {...props}
        />
      ) : (
        <QueryRenderer
          key="=/asfasd"
          fetchPolicy="network-only"
          component={Correlation}
          query={getCorrelationQuery}
          variables={{
            startDate,
            endDate,
          }}
          {...props}
        />
      )}
    </PTWrapper>
  )
}

const PTWrapper = styled(PTWrapperRaw)`
  width: 98%;
`

const mapStateToProps = (store: any) => ({
  isShownMocks: store.user.isShownMocks,
  isFullscreenEnabled: store.portfolio.correlationTableFullscreenEnabled,
  startDate: store.portfolio.correlationStartDate,
  endDate: store.portfolio.correlationEndDate,
  period: store.portfolio.correlationPeriod,
  toolTip: store.user.toolTip,
})

const mapDispatchToProps = (dispatch: any) => ({
  toggleFullscreen: (data: any) => dispatch(toggleCorrelationTableFullscreen()),
  setCorrelationPeriodToStore: (payload: object) =>
    dispatch(setCorrelationPeriodAction(payload)),
  hideToolTip: (tab: string) => dispatch(actions.hideToolTip(tab)),
})

const storeComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(CorrelationWrapper)

export default storeComponent
