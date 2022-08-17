import Chart from 'chart.js/auto'
import dayjs from 'dayjs'
import React, { useEffect, useRef, useState } from 'react'
import { compose } from 'recompose'
import { useTheme } from 'styled-components'

import { queryRendererHoc } from '@sb/components/QueryRenderer'
import { InlineText } from '@sb/components/Typography'
import {
  dayDuration,
  endOfDayTimestamp,
  getTimezone,
  startOfDayTimestamp,
} from '@sb/compositions/AnalyticsRoute/components/utils'

import { getTradingVolumeHistory } from '@core/graphql/queries/pools/getTradingVolumeHistory'
import { getRandomInt } from '@core/utils/helpers'
import { stripByAmountAndFormat } from '@core/utils/numberUtils'

import {
  Canvas,
  CanvasContainer,
  ChartContainer,
  TooltipContainer,
  ValueTitle,
} from '../index.styles'
import { TradingVolumeChartProps } from '../types'
import { createTradingVolumeChart, NUMBER_OF_DAYS_TO_SHOW } from './utils'

const ChartBlockInner: React.FC<TradingVolumeChartProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartRef = useRef<Chart | null>(null)

  const { getTradingVolumeHistoryQuery, setFirstBalance, setBalanceData } =
    props
  const theme = useTheme()

  const data = getTradingVolumeHistoryQuery?.getTradingVolumeHistory?.volumes

  const allTimeVolumeValue =
    data?.reduce((acc, current) => {
      return acc + current.vol
    }, 0) || 0

  useEffect(() => {
    if (!canvasRef.current) {
      return () => {}
    }

    const reDraw = () => {
      try {
        chartRef.current = createTradingVolumeChart({
          container: canvasRef.current,
          data,
          chart: chartRef.current,
          theme,
          setBalanceData,
        })
      } catch (e) {
        console.warn('Erorr on chart update:', e)
        chartRef.current = null
        setTimeout(reDraw, 1_000)
      }
    }

    setFirstBalance(stripByAmountAndFormat(allTimeVolumeValue))

    if (data.length > 0) {
      reDraw()
    }

    return () => {
      chartRef.current?.destroy()
    }
  }, [JSON.stringify(data)])

  return (
    <CanvasContainer padding="0px">
      <Canvas
        needPadding
        bottom="0px"
        left="4px"
        id="trading-vol-chart-inner"
        height="250"
        ref={canvasRef}
      />
    </CanvasContainer>
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
    loaderColor: ({ theme }) => theme.colors.white,
  })
)(ChartBlockInner)

export const VolumeChart = () => {
  const [balanceData, setBalanceData] = useState({ date: '', balance: '' })
  const [firstBalance, setFirstBalance] = useState('')
  const [isMouseOverTheChart, setIfMouseOverTheChart] = useState(false)

  useEffect(() => {
    const chartInner = document.getElementById('trading-vol-chart-inner')

    const mouseOver = () => setIfMouseOverTheChart(true)
    const mouseLeave = () => setIfMouseOverTheChart(false)

    if (chartInner) {
      chartInner.addEventListener('mouseover', mouseOver, false)
      chartInner.addEventListener('mouseleave', mouseLeave, false)

      return () => {
        chartInner.removeEventListener('mouseover', mouseOver)
        chartInner.removeEventListener('mouseleave', mouseLeave, false)
      }
    }

    return () => {}
  }, [])

  const formattedTodayDate = dayjs().format('MMM, D')

  const date =
    formattedTodayDate === balanceData.date ? 'Today' : `at ${balanceData.date}`

  return (
    <ChartContainer>
      <TooltipContainer padding="8px">
        <InlineText color="white1" size="xs">
          Volume {isMouseOverTheChart ? `${date}` : `All Time`}
        </InlineText>
        <ValueTitle color="white1" size="xl" weight={600}>
          <InlineText color="white3">$</InlineText>{' '}
          {isMouseOverTheChart ? `${balanceData.balance}` : `${firstBalance}`}
        </ValueTitle>
      </TooltipContainer>
      <ChartBlockInnerWithData
        setBalanceData={setBalanceData}
        setFirstBalance={setFirstBalance}
      />
    </ChartContainer>
  )
}
