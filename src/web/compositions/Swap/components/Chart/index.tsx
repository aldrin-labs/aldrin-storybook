import { COLORS } from '@variables/variables'
import { createChart, LineData, UTCTimestamp } from 'lightweight-charts'
import React, { useEffect, useRef } from 'react'

import { DAY } from '@core/utils/dateUtils'
import { randomInteger } from '@core/utils/helpers'

import { Container } from './styles'

const dataSet: LineData[] = []

const epoch = 1609459200

for (let i = 0; i < 200; i += 1) {
  dataSet.push({
    time: (epoch + DAY * i) as UTCTimestamp,
    value: randomInteger(10, 100),
  })
}

const darkTheme = {
  chart: {
    layout: {
      backgroundColor: COLORS.swapBlockBg,
      lineColor: COLORS.swapBlockBg,
      textColor: '#D9D9D9',
    },
    watermark: {
      color: 'rgba(0, 0, 0, 0)',
    },
    grid: {
      vertLines: {
        color: COLORS.swapBlockBg,
      },
      horzLines: {
        color: COLORS.swapBlockBg,
      },
    },
  },
  series: {
    topColor: COLORS.success,
    bottomColor: 'rgba(32, 226, 47, 0.04)',
    lineColor: COLORS.success,
  },
}

export const Chart: React.FC = () => {
  const chartContainer = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (chartContainer.current) {
      const chart = createChart(chartContainer.current, {
        localization: { locale: 'en-US' },
      })
      const areaSeries = chart.addAreaSeries()
      areaSeries.setData(dataSet)
      areaSeries.applyOptions(darkTheme.series)
      chart.applyOptions(darkTheme.chart)
    }
    return () => {
      console.log('Unmount chart', !!chartContainer.current)
    }
  }, [])

  return <Container ref={chartContainer} />
}
