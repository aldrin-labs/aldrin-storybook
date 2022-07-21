import Chart from 'chart.js/auto'
import React, { useEffect, useRef, useState } from 'react'
import { compose } from 'recompose'
import { DefaultTheme, useTheme } from 'styled-components'

import { queryRendererHoc } from '@sb/components/QueryRenderer'
import { InlineText } from '@sb/components/Typography'

import { getTotalVolumeLockedHistory } from '@core/graphql/queries/pools/getTotalVolumeLockedHistory'
import {
  dayDuration,
  endOfDayTimestamp,
  getTimeZone,
  startOfDayTimestamp,
} from '@core/utils/dateUtils'
import { getRandomInt } from '@core/utils/helpers'
import { stripByAmountAndFormat } from '@core/utils/numberUtils'

import {
  Canvas,
  CanvasContainer,
  ChartContainer,
  ChartMask,
  TooltipContainer,
  ValueTitle,
} from '../index.styles'
import { TotalVolumeLockedChartProps } from '../types'
import { createTotalVolumeLockedChart, NUMBER_OF_DAYS_TO_SHOW } from './utils'

const ChartInner: React.FC<TotalVolumeLockedChartProps> = (props) => {
  const { getTotalVolumeLockedHistoryQuery, setBalanceData, setFirstBalance } =
    props

  const data =
    getTotalVolumeLockedHistoryQuery?.getTotalVolumeLockedHistory?.volumes

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartRef = useRef<Chart | null>(null)
  const theme = useTheme()

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
          theme,
          setBalanceData,
        })
      } catch (e) {
        console.warn('Erorr on chart update:', e)
        chartRef.current = null
        setTimeout(reDraw, 1_000)
      }
    }

    setFirstBalance(stripByAmountAndFormat(data[data.length - 1].vol || ''))

    if (data.length > 0) {
      reDraw()
    }

    return () => {
      chartRef.current?.destroy()
    }
  }, [JSON.stringify(data)])

  return (
    <CanvasContainer padding="6px">
      <Canvas
        bottom="0"
        left="6px"
        id="tvl-chart-inner"
        height="250"
        ref={canvasRef}
      />
    </CanvasContainer>
  )
}

const TotalVolumeLockedChartInner = compose(
  queryRendererHoc({
    query: getTotalVolumeLockedHistory,
    name: 'getTotalVolumeLockedHistoryQuery',
    variables: {
      timezone: getTimeZone(),
      timestampFrom:
        startOfDayTimestamp() - dayDuration * NUMBER_OF_DAYS_TO_SHOW,
      timestampTo: endOfDayTimestamp(),
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000 * getRandomInt(1, 3),
    loaderColor: ({ theme }: { theme: DefaultTheme }) => theme.colors.white,
  })
)(ChartInner)

export const TVLChart: React.FC = () => {
  const [balanceData, setBalanceData] = useState({ date: '', balance: '' })
  const [firstBalance, setFirstBalance] = useState('')
  const [isMouseOverTheChart, setIfMouseOverTheChart] = useState(false)

  useEffect(() => {
    const chartInner = document.getElementById('tvl-chart-inner')

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

  return (
    <ChartContainer>
      <ChartMask />
      <TooltipContainer padding="6px">
        <InlineText color="gray0" size="xs">
          TVL {isMouseOverTheChart ? `at ${balanceData.date}` : `Now`}
        </InlineText>
        <ValueTitle color="gray0" weight={600}>
          <InlineText color="gray1">$</InlineText>{' '}
          {isMouseOverTheChart ? `${balanceData.balance}` : `${firstBalance}`}
        </ValueTitle>
      </TooltipContainer>
      <TotalVolumeLockedChartInner
        setFirstBalance={setFirstBalance}
        setBalanceData={setBalanceData}
      />
    </ChartContainer>
  )
}
