import Chart from 'chart.js/auto'
import React, { useEffect, useRef } from 'react'
import { compose } from 'recompose'
import { useTheme } from 'styled-components'

import { BlockContent } from '@sb/components/Block'
import { queryRendererHoc } from '@sb/components/QueryRenderer'
import {
  dayDuration,
  endOfDayTimestamp,
  getTimezone,
  startOfDayTimestamp,
} from '@sb/compositions/AnalyticsRoute/components/utils'

import { getTotalVolumeLockedHistory } from '@core/graphql/queries/pools/getTotalVolumeLockedHistory'
import { msToNextHour } from '@core/utils/dateUtils'
import { getRandomInt } from '@core/utils/helpers'

import { useThemeName } from '../../../App/themes'
import { Line } from '../Popups/index.styles'
import { ReloadTimerTillUpdate } from './ReloadTimerTillUpdate'
import {
  Canvas,
  SubTitle,
  TitleContainer,
  DataContainer,
  SBlock,
} from './styles'
import { TotalVolumeLockedChartProps } from './types'
import { createTotalVolumeLockedChart, NUMBER_OF_DAYS_TO_SHOW } from './utils'

const ChartInner: React.FC<TotalVolumeLockedChartProps> = (props) => {
  const { getTotalVolumeLockedHistoryQuery } = props

  const data =
    getTotalVolumeLockedHistoryQuery?.getTotalVolumeLockedHistory?.volumes

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartRef = useRef<Chart | null>(null)
  const theme = useTheme()
  const themeName = useThemeName()

  const reDraw = () => {
    try {
      chartRef.current = createTotalVolumeLockedChart({
        container: canvasRef.current,
        data,
        chart: chartRef.current,
        theme,
      })
    } catch (e) {
      console.warn('Erorr on chart update:', e)
      chartRef.current = null
      setTimeout(reDraw, 1_000)
    }
  }

  useEffect(() => {
    if (!canvasRef.current) {
      return () => {}
    }

    if (data.length > 0) {
      reDraw()
    }

    return () => {
      chartRef.current?.destroy()
    }
  }, [JSON.stringify(data)])

  useEffect(() => {
    if (chartRef.current) {
      reDraw()
    }
  }, [theme, themeName])
  return (
    <div>
      <Canvas height="250" ref={canvasRef} />
    </div>
  )
}

const TotalVolumeLockedChartInner = compose(
  queryRendererHoc({
    query: getTotalVolumeLockedHistory,
    name: 'getTotalVolumeLockedHistoryQuery',
    variables: {
      timezone: getTimezone(),
      timestampFrom:
        startOfDayTimestamp() - dayDuration * NUMBER_OF_DAYS_TO_SHOW,
      timestampTo: endOfDayTimestamp(),
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000 * getRandomInt(1, 3),
    loaderColor: (props) => props.theme.colors.white1,
  })
)(ChartInner)

export const TotalVolumeLockedChart: React.FC = () => {
  return (
    <SBlock>
      <BlockContent>
        <TitleContainer>
          <SubTitle>Total Value Locked</SubTitle>
          <Line />
          <ReloadTimerTillUpdate
            duration={3600}
            margin="0 0 0 2rem"
            getSecondsTillNextUpdate={() => msToNextHour() / 1000}
          />
        </TitleContainer>
        <DataContainer>
          <TotalVolumeLockedChartInner />
        </DataContainer>
      </BlockContent>
    </SBlock>
  )
}
