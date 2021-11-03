import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getTotalVolumeLockedHistory } from '@core/graphql/queries/pools/getTotalVolumeLockedHistory'
import { msToNextHour } from '@core/utils/dateUtils'
import { getRandomInt } from '@core/utils/helpers'
import { Theme } from '@material-ui/core'
import { Block, BlockContent } from '@sb/components/Block'
import {
  dayDuration, endOfDayTimestamp,
  getTimezone
} from '@sb/compositions/AnalyticsRoute/components/utils'
import { Chart } from 'chart.js'
import React, { useEffect, useRef } from 'react'
import { compose } from 'recompose'
import { Line } from '../../Popups/index.styles'
import { ReloadTimerTillUpdate } from '../ReloadTimerTillUpdate/ReloadTimerTillUpdate'
import { Canvas, SubTitle, TitleContainer } from '../styles'
import { createTotalVolumeLockedChart, NUMBER_OF_DAYS_TO_SHOW } from '../utils'



const Chart = ({
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

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartRef = useRef<Chart | null>(null)


  useEffect(() => {
    if (!canvasRef.current) {
      return () => {
        return null
      }
    }
    chartRef.current = createTotalVolumeLockedChart({
      container: canvasRef.current,
      data,
      chart: chartRef.current
    })

    return () => chartRef.current?.destroy()
  }, [JSON.stringify(data)])

  return (
    <Block>
      <BlockContent>
        <TitleContainer>
          <SubTitle>Total Value Locked</SubTitle>
          <Line />
          <ReloadTimerTillUpdate
            duration={3600}
            margin={'0 0 0 2rem'}
            getSecondsTillNextUpdate={() => msToNextHour() / 1000}
          />
        </TitleContainer>
        <div>
          <Canvas height="250" ref={canvasRef}></Canvas>
        </div>
      </BlockContent>
    </Block>

  )
}

export const TotalVolumeLockedChart = compose(
  queryRendererHoc({
    query: getTotalVolumeLockedHistory,
    name: 'getTotalVolumeLockedHistoryQuery',
    variables: {
      timezone: getTimezone(),
      timestampFrom: endOfDayTimestamp() - dayDuration * NUMBER_OF_DAYS_TO_SHOW,
      timestampTo: endOfDayTimestamp(),
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000 * getRandomInt(1, 3),
  })
)(Chart)
