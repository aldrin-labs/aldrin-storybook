import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getTradingVolumeHistory } from '@core/graphql/queries/pools/getTradingVolumeHistory'
import { msToNextHour } from '@core/utils/dateUtils'
import { getRandomInt } from '@core/utils/helpers'
import { Theme } from '@material-ui/core'
import { Block, BlockContent } from '@sb/components/Block'
import {
  dayDuration,
  endOfDayTimestamp,
  getTimezone
} from '@sb/compositions/AnalyticsRoute/components/utils'
import { Chart } from 'chart.js'
import React, { useEffect, useRef } from 'react'
import { compose } from 'recompose'
import { Line } from '../../Popups/index.styles'
import { ReloadTimerTillUpdate } from '../ReloadTimerTillUpdate/ReloadTimerTillUpdate'
import { Canvas, SubTitle, TitleContainer } from '../styles'
import { createTradingVolumeChart, NUMBER_OF_DAYS_TO_SHOW} from '../utils'


const ChartBlock = ({
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

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartRef = useRef<Chart | null>(null)


  const data = getTradingVolumeHistoryQuery?.getTradingVolumeHistory?.volumes

  useEffect(() => {
    if (!canvasRef.current) {
      return () => {
        return null
      }
    }
    chartRef.current = createTradingVolumeChart({
      container: canvasRef.current,
      data,
      chart: chartRef.current,
    })

    return () => chartRef.current?.destroy()
  }, [JSON.stringify(data)])


  return (
    <Block>
      <BlockContent>
        <TitleContainer>
          <SubTitle>Trading Volume</SubTitle>
          <Line />
          <ReloadTimerTillUpdate
            duration={3600}
            margin={'0 0 0 2rem'}
            getSecondsTillNextUpdate={() => msToNextHour() / 1000}
          />
        </TitleContainer>
        <div>
          <Canvas ref={canvasRef}></Canvas>
        </div>
      </BlockContent>
    </Block>
  )
}

export const TradingVolumeChart = compose(
  queryRendererHoc({
    query: getTradingVolumeHistory,
    name: 'getTradingVolumeHistoryQuery',
    variables: {
      timezone: getTimezone(),
      timestampFrom: endOfDayTimestamp() - dayDuration * NUMBER_OF_DAYS_TO_SHOW,
      timestampTo: endOfDayTimestamp(),
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000 * getRandomInt(1, 3),
  })
)(ChartBlock)
