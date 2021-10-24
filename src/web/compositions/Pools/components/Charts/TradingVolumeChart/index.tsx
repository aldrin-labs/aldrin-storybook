import React, { useEffect } from 'react'
import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { Theme } from '@material-ui/core'

import {
  WhiteTitle,
  HeaderContainer,
  Row,
  ChartContainer,
  RowContainer,
} from '@sb/compositions/AnalyticsRoute/index.styles'

import { createTradingVolumeChart } from '../utils'
import { getTradingVolumeHistory } from '@core/graphql/queries/pools/getTradingVolumeHistory'
import {
  dayDuration,
  endOfDayTimestamp,
  getTimezone,
} from '@sb/compositions/AnalyticsRoute/components/utils'

import dayjs from 'dayjs'
import { Line } from '../../Popups/index.styles'
import { ReloadTimer } from '@sb/compositions/Rebalance/components/ReloadTimer'
import { estimatedTime, msToNextHour } from '@core/utils/dateUtils'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { ReloadTimerTillUpdate } from '../ReloadTimerTillUpdate/ReloadTimerTillUpdate'

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
    createTradingVolumeChart({
      theme,
      id,
      data: [...data].sort((a, b) => {
        return dayjs(a.date).unix() - dayjs(b.date).unix()
      }),
    })

    // @ts-ignore - we set it in create chart function above
    return () => window[`TradingVolumeChart-${id}`].destroy()
  }, [id])

  return (
    <>
      <HeaderContainer theme={theme} justify={'space-between'}>
        <RowContainer margin={'0 2rem 0 2rem'} style={{ flexWrap: 'nowrap' }}>
          <WhiteTitle
            style={{ marginRight: '2rem' }}
            theme={theme}
            color={theme.palette.white.text}
          >
            {title}
          </WhiteTitle>
          <ReloadTimerTillUpdate
            getSecondsTillNextUpdate={() => msToNextHour() / 1000}
          />
          <Line />
        </RowContainer>
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
      timestampFrom: endOfDayTimestamp() - dayDuration * 6,
      timestampTo: endOfDayTimestamp(),
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000,
  })
)(TradingVolumeChart)
