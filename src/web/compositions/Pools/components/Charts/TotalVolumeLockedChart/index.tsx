import React, { useEffect } from 'react'
import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer'

import {
  endOfDayTimestamp,
  dayDuration,
  generateIDFromValues,
  getTimezone,
} from '@sb/compositions/AnalyticsRoute/components/utils'

import { Theme } from '@material-ui/core'

import {
  WhiteTitle,
  HeaderContainer,
  Row,
  ChartContainer,
} from '@sb/compositions/AnalyticsRoute/index.styles'

import { createTotalVolumeLockedChart } from '../utils'
import { getTotalVolumeLockedHistory } from '@core/graphql/queries/pools/getTotalVolumeLockedHistory'

const TotalVolumeLockedChart = ({
  theme,
  id,
  title,
  getTotalVolumeLockedHistoryQuery,
}: {
  theme: Theme
  id: string
  title: string
  getTotalVolumeLockedHistoryQuery: any
}) => {
  const data =
    getTotalVolumeLockedHistoryQuery?.getTotalVolumeLockedHistory?.volumes

  useEffect(() => {
    createTotalVolumeLockedChart({ theme, id, data })

    // @ts-ignore - we set it in create chart function above
    return () => window[`TotalVolumeLockedChart-${id}`].destroy()
  }, [id])

  return (
    <>
      <HeaderContainer theme={theme} justify={'space-between'}>
        <Row margin={'0 0 0 2rem'}>
          <WhiteTitle theme={theme} color={theme.palette.white.text}>
            {title}
          </WhiteTitle>
        </Row>
      </HeaderContainer>
      <ChartContainer>
        <canvas id="TotalVolumeLockedChart"></canvas>
      </ChartContainer>
    </>
  )
}

export default compose(
  queryRendererHoc({
    query: getTotalVolumeLockedHistory,
    name: 'getTotalVolumeLockedHistoryQuery',
    variables: {
      timezone: getTimezone(),
      timestampFrom: endOfDayTimestamp - dayDuration * 6,
      timestampTo: endOfDayTimestamp,
    },
    fetchPolicy: 'cache-and-network',
  })
)(TotalVolumeLockedChart)
