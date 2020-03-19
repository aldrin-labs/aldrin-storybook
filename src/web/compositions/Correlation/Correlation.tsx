import * as React from 'react'
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
import { combineTableData } from '@core/utils/PortfolioTableUtils'
import { PTWrapper as PTWrapperRaw } from '@sb/styles/cssUtils'
import { testJSON } from '@core/utils/chartPageUtils'
import { CustomError } from '@sb/components/index'
import { portfolioCorrelationSteps } from '@sb/config/joyrideSteps'
import { MASTER_BUILD } from '@core/utils/config'
import { getCorrelationPeriod } from '@core/graphql/queries/portfolio/correlation/getCorrelationPeriod'
import { updateCorrelationPeriod } from '@core/graphql/mutations/portfolio/correlation/updateCorrelationPeriod'
import { updateTooltipSettings } from '@core/graphql/mutations/user/updateTooltipSettings'
import { GET_TOOLTIP_SETTINGS } from '@core/graphql/queries/user/getTooltipSettings'
import { GET_MOCKS_MODE } from '@core/graphql/queries/app/getMocksMode'
import { removeTypenameFromObject } from '@core/utils/apolloUtils'
import { updateTooltipMutation } from '@core/utils/TooltipUtils'

const Correlation = (props: IProps) => {
  const {
    children,
    getCorrelationPeriodQuery: {
      portfolioCorrelation: { startDate, endDate, period },
    },
    updateCorrelationPeriodMutation,
    getCorrelationAndPortfolioAssetsQuery,
    dustFilter,
  } = props

  let dataRaw = {}
  if (
    getCorrelationAndPortfolioAssetsQuery.myPortfolios &&
    getCorrelationAndPortfolioAssetsQuery.myPortfolios.length > 0 &&
    typeof getCorrelationAndPortfolioAssetsQuery.myPortfolios[0]
      .correlationMatrixByDay === 'string' &&
    getCorrelationAndPortfolioAssetsQuery.myPortfolios[0].correlationMatrixByDay
      .length > 0
  ) {
    const matrix =
      getCorrelationAndPortfolioAssetsQuery.myPortfolios[0]
        .correlationMatrixByDay
    dataRaw = testJSON(matrix) ? JSON.parse(matrix) : matrix

    const dustFiltredCoinList = combineTableData(
      getCorrelationAndPortfolioAssetsQuery.myPortfolios[0].portfolioAssets,
      dustFilter,
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
    children,
    theme,
    getCorrelationPeriodQuery: {
      portfolioCorrelation: { startDate, endDate },
    },
    getTooltipSettingsQuery: { getTooltipSettings },
    updateTooltipSettingsMutation,
    getMocksModeQuery: {
      app: { mocksEnabled },
    },
  } = props
  let key = 0

  const handleJoyrideCallback = async (data: any) => {
    if (
      data.action === 'close' ||
      data.action === 'skip' ||
      data.status === 'finished'
    ) {
      await updateTooltipSettingsMutation({
        variables: {
          settings: {
            ...removeTypenameFromObject(getTooltipSettings),
            portfolioCorrelation: false,
          },
        },
      })
    }

    if (data.status === 'finished') {
      key = key + 1
    }
  }

  return (
    <PTWrapper>
      {mocksEnabled && !MASTER_BUILD ? (
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
          name={`getCorrelationAndPortfolioAssetsQuery`}
          variables={{
            startDate,
            endDate,
          }}
          {...props}
        />
      )}

      <Joyride
        steps={portfolioCorrelationSteps}
        // run={getTooltipSettings.portfolioCorrelation}
        run={false}
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
  margin-left: -4%;
`

export default compose(
  withTheme(),
  queryRendererHoc({
    query: getCorrelationPeriod,
    name: 'getCorrelationPeriodQuery',
  }),
  queryRendererHoc({
    query: GET_TOOLTIP_SETTINGS,
    name: 'getTooltipSettingsQuery',
  }),
  queryRendererHoc({
    query: GET_MOCKS_MODE,
    name: 'getMocksModeQuery',
  }),
  graphql(updateTooltipSettings, {
    name: 'updateTooltipSettingsMutation',
    options: {
      update: updateTooltipMutation,
    },
  }),
  graphql(updateCorrelationPeriod, {
    name: 'updateCorrelationPeriodMutation',
  })
)(CorrelationWrapper)
