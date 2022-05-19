import { COLORS } from '@variables/variables'
import Chart from 'chart.js/auto'
import React, { useEffect, useRef } from 'react'
import { compose } from 'recompose'

import { Block, BlockContent } from '@sb/components/Block'
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

import { Line } from '../Popups/index.styles'
import { ReloadTimerTillUpdate } from './ReloadTimerTillUpdate'
import { Canvas, SubTitle, TitleContainer, DataContainer } from './styles'
import { TotalVolumeLockedChartProps } from './types'
import { createTotalVolumeLockedChart, NUMBER_OF_DAYS_TO_SHOW } from './utils'

const ChartInner: React.FC<TotalVolumeLockedChartProps> = (props) => {
  const { getTotalVolumeLockedHistoryQuery } = props

  const data =
    getTotalVolumeLockedHistoryQuery?.getTotalVolumeLockedHistory?.volumes

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) {
      return () => {}
    }
    const reDraw = () => {
      try {
        chartRef.current = createTotalVolumeLockedChart({
          container: canvasRef.current,
          data,
          chart: chartRef.current,
        })
      } catch (e) {
        console.warn('Erorr on chart update:', e)
        chartRef.current = null
        setTimeout(reDraw, 1_000)
      }
    }

    if (data.length > 0) {
      reDraw()
    }

    return () => {
      chartRef.current?.destroy()
    }
  }, [JSON.stringify(data)])

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
    loaderColor: COLORS.white,
  })
)(ChartInner)

export const TotalVolumeLockedChart: React.FC = () => {
  return (
    <Block>
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
    </Block>
  )
}
