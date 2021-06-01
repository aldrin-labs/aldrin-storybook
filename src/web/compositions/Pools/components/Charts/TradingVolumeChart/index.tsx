import React, { useEffect } from 'react'
import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { Theme } from '@material-ui/core'

import {
  WhiteTitle,
  HeaderContainer,
  Row,
  ChartContainer,
} from '@sb/compositions/AnalyticsRoute/index.styles'

import { createTradingVolumeChart } from '../utils'
import { getTradingVolumeHistory } from '@core/graphql/queries/pools/getTradingVolumeHistory'
import {
  dayDuration,
  endOfDayTimestamp,
  getTimezone,
} from '@sb/compositions/AnalyticsRoute/components/utils'

const TradingVolumeChart = ({
  theme,
  id,
  title,
  getTradingVolumeHistoryQuery,
}: {
  theme: Theme
  id: string
  title: string
  getTradingVolumeHistoryQuery: any
}) => {
  const data = getTradingVolumeHistoryQuery?.getTradingVolumeHistory?.volumes
  useEffect(() => {
    createTradingVolumeChart({ theme, id, data })

    // @ts-ignore - we set it in create chart function above
    return () => window[`TradingVolumeChart-${id}`].destroy()
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
        <canvas id="TradingVolumeChart"></canvas>
      </ChartContainer>
    </>
  )
}

export default compose(
  queryRendererHoc({
    query: getTradingVolumeHistory,
    name: 'getTradingVolumeHistoryQuery',
    variables: {
      timezone: getTimezone(),
      timestampFrom: endOfDayTimestamp - dayDuration * 6,
      timestampTo: endOfDayTimestamp,
    },
    fetchPolicy: 'cache-and-network',
  })
)(TradingVolumeChart)
