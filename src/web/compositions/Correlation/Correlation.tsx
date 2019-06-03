import * as React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Joyride from 'react-joyride'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { withTheme } from '@material-ui/styles'

import QueryRenderer, { queryRendererHoc } from '@core/components/QueryRenderer'
import { CorrelationMatrixMockData } from './mocks'
import { CorrelationMatrix } from '@sb/components/index'
import { IProps } from './Correlation.types'
import { getCorrelationAndPortfolioAssetsQuery } from '@core/graphql/queries/portfolio/correlation/getCorrelationAndPortfolioAssetsQuery'
import { combineTableData, swapDates } from '@core/utils/PortfolioTableUtils'
import { PTWrapper as PTWrapperRaw } from '@sb/styles/cssUtils'
import { testJSON } from '@core/utils/chartPageUtils'
import { CustomError } from '@sb/components/index'
import { portfolioCorrelationSteps } from '@sb/config/joyrideSteps'
import * as actions from '@core/redux/user/actions'
import { MASTER_BUILD } from '@core/utils/config'
import { getCorrelationPeriod } from '@core/graphql/queries/portfolio/correlation/getCorrelationPeriod'
import { updateCorrelationPeriod } from '@core/graphql/mutations/portfolio/correlation/updateCorrelationPeriod'

const Correlation = (props: IProps) => {
  const {
    children,
    getCorrelationPeriodQuery: {
      portfolioCorrelation: { startDate, endDate, period },
    },
    updateCorrelationPeriodMutation,
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

    const dustFiltredCoinList = combineTableData(
      props.data.myPortfolios[0].portfolioAssets,
      props.dustFilter,
      true
    ).map((el) => el.coin)

    const processedHeadValues = dataRaw.header.map((el) => ({
      coin: el,
      isActive: dustFiltredCoinList.includes(el),
    }))

    const filtredRealValues = dataRaw.values
      .filter((el, i) => processedHeadValues[i].isActive)
      .map((arr) =>
        arr
          .map((el, i) => (processedHeadValues[i].isActive ? el : null))
          .filter((el) => +el)
      )

    dataRaw.values = filtredRealValues
    dataRaw.header = processedHeadValues
      .filter((el) => el.isActive)
      .map((el) => el.coin)
  } else {
    return <CustomError error={'wrongShape'} />
  }

  return (
    <>
      {children}
      <CorrelationMatrix
        data={dataRaw}
        updateCorrelationPeriodMutation={updateCorrelationPeriodMutation}
        period={period}
        dates={{ startDate, endDate }}
      />
    </>
  )
}

const CorrelationWrapper = (props: IProps) => {
  const {
    isShownMocks,
    children,
    theme,
    getCorrelationPeriodQuery: {
      portfolioCorrelation: { startDate, endDate },
    },
  } = props
  let key = 0

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
          children={children}
          {...props}
        />
      ) : (
        <QueryRenderer
          key="=/asfasd"
          fetchPolicy="network-only"
          component={Correlation}
          query={getCorrelationAndPortfolioAssetsQuery}
          variables={{
            startDate,
            endDate,
          }}
          {...props}
        />
      )}

      <Joyride
        steps={portfolioCorrelationSteps}
        run={props.toolTip.portfolioCorrelation}
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
    </PTWrapper>
  )
}

const PTWrapper = styled(PTWrapperRaw)`
  width: 98%;
`

const mapStateToProps = (store: any) => ({
  isShownMocks: store.user.isShownMocks,
  toolTip: store.user.toolTip,
})

const mapDispatchToProps = (dispatch: any) => ({
  toggleFullscreen: (data: any) => dispatch(toggleCorrelationTableFullscreen()),
  setCorrelationPeriodToStore: (payload: object) =>
    dispatch(setCorrelationPeriodAction(payload)),
  hideToolTip: (tab: string) => dispatch(actions.hideToolTip(tab)),
})

export default compose(
  withTheme(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  queryRendererHoc({
    query: getCorrelationPeriod,
    name: 'getCorrelationPeriodQuery',
  }),
  graphql(updateCorrelationPeriod, {
    name: 'updateCorrelationPeriodMutation',
  })
)(CorrelationWrapper)
