import React, { useEffect } from 'react'
import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer'

import {
  endOfDayTimestamp,
  dayDuration,
  getTimezone,
} from '@sb/compositions/AnalyticsRoute/components/utils'

import { Theme } from '@material-ui/core'

import {
  WhiteTitle,
  HeaderContainer,
  ChartContainer,
  RowContainer,
} from '@sb/compositions/AnalyticsRoute/index.styles'

import { getTotalVolumeLockedHistory } from '@core/graphql/queries/pools/getTotalVolumeLockedHistory'
import { createTotalVolumeLockedChart } from '../utils'
import { Line } from '../../Popups/index.styles'

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
      <HeaderContainer theme={theme} justify="space-between">
        <RowContainer margin="0 2rem 0 2rem" style={{ flexWrap: 'nowrap' }}>
          <WhiteTitle
            style={{ marginRight: '2rem' }}
            theme={theme}
            color={theme.palette.white.text}
          >
            {title}
          </WhiteTitle>
          <Line />
        </RowContainer>
      </HeaderContainer>
      <ChartContainer>
        <canvas id="TotalVolumeLockedChart" />
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
      timestampFrom: endOfDayTimestamp() - dayDuration * 6,
      timestampTo: endOfDayTimestamp(),
    },
    fetchPolicy: 'cache-and-network',
  })
)(TotalVolumeLockedChart)
