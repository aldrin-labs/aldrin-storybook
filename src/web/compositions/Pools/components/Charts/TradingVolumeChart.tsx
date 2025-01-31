import Chart from 'chart.js/auto'
import React, { useEffect, useRef } from 'react'
import { compose } from 'recompose'
import { useTheme } from 'styled-components'

import { Block, BlockContent } from '@sb/components/Block'
import { queryRendererHoc } from '@sb/components/QueryRenderer'
import {
  dayDuration,
  endOfDayTimestamp,
  getTimezone,
  startOfDayTimestamp,
} from '@sb/compositions/AnalyticsRoute/components/utils'

import { getTradingVolumeHistory } from '@core/graphql/queries/pools/getTradingVolumeHistory'
import { msToNextHour } from '@core/utils/dateUtils'
import { getRandomInt } from '@core/utils/helpers'

import { useThemeName } from '../../../App/themes'
import { Line } from '../Popups/index.styles'
import { ReloadTimerTillUpdate } from './ReloadTimerTillUpdate'
import { Canvas, DataContainer, SubTitle, TitleContainer } from './styles'
import { TradingVolumeChartProps } from './types'
import { createTradingVolumeChart, NUMBER_OF_DAYS_TO_SHOW } from './utils'

const ChartBlockInner: React.FC<TradingVolumeChartProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartRef = useRef<Chart | null>(null)

  const { getTradingVolumeHistoryQuery } = props
  const theme = useTheme()
  const themeName = useThemeName()

  const data = getTradingVolumeHistoryQuery?.getTradingVolumeHistory?.volumes

  const reDraw = () => {
    try {
      chartRef.current = createTradingVolumeChart({
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

export const ChartBlockInnerWithData = compose(
  queryRendererHoc({
    query: getTradingVolumeHistory,
    name: 'getTradingVolumeHistoryQuery',
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
)(ChartBlockInner)

export const TradingVolumeChart = () => {
  return (
    <Block>
      <BlockContent>
        <TitleContainer>
          <SubTitle>Trading Volume</SubTitle>
          <Line />
          <ReloadTimerTillUpdate
            duration={3600}
            margin="0 0 0 2rem"
            getSecondsTillNextUpdate={() => msToNextHour() / 1000}
          />
        </TitleContainer>
        <DataContainer>
          <ChartBlockInnerWithData />
        </DataContainer>
      </BlockContent>
    </Block>
  )
}
