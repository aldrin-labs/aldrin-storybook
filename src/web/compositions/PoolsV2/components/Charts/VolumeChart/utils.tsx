import Chart from 'chart.js/auto'
import ChartType from 'chart.js/types'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { DefaultTheme } from 'styled-components'

import {
  dayDuration,
  endOfDayTimestamp,
} from '@sb/compositions/AnalyticsRoute/components/utils'

import { stripByAmountAndFormat } from '@core/utils/numberUtils'

dayjs.extend(timezone)
dayjs.extend(utc)

export const NUMBER_OF_DAYS_TO_SHOW = 28

interface ChartParams<T = { date: number; vol?: number }[]> {
  chart: Chart | null
  data: T
  container: HTMLCanvasElement | null
  theme: DefaultTheme
  setBalanceData: ({ balance, date }: { balance: string; date: string }) => void
  chartHeight: number
}

const createChart = ({
  ctx,
  type = 'line',
  setBalanceData,
}: {
  ctx: CanvasRenderingContext2D
  type: ChartType
  setBalanceData: ({ balance, date }: { balance: string; date: string }) => void
}) =>
  new Chart(ctx, {
    type,
    data: {
      labels: [],
      datasets: [],
    },
    options: {
      hover: {
        intersect: false,
      },
      scales: {
        x: {
          stacked: true,
          gridLines: {
            display: false,
          },
          ticks: {
            display: false,
          },
        },
        y: {
          position: 'right',
          gridLines: {
            display: false,
          },
          ticks: {
            display: false,
          },
        },
      },
      maintainAspectRatio: false,
      plugins: {
        filler: {
          propagate: true,
        },
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'transparent',
          titleColor: 'transparent',
          enabled: true,
          intersect: false,
          callbacks: {
            label: (model: any) => {
              setBalanceData({
                balance: stripByAmountAndFormat(model.raw.y.toFixed(0)),
                date: model.label,
              })
            },
          },
        },
      },
      layout: {
        padding: {
          top: 0,
          right: 0,
          left: 0,
        },
      },
    },
  })

const getEmptyData = (
  fisrtTimestamp: number = endOfDayTimestamp() -
    dayDuration * NUMBER_OF_DAYS_TO_SHOW,
  lastTimestamp: number = endOfDayTimestamp()
) => {
  const tsFrom = dayjs.unix(fisrtTimestamp).startOf('day')
  const tsTo = dayjs.unix(lastTimestamp).startOf('day')

  const diffInDays = tsTo.diff(tsFrom, 'days')

  const emptyData = new Array(diffInDays)
    .fill(undefined)
    .map((el, i) => {
      const date = dayjs
        .unix(tsTo.subtract(i, 'day').unix())
        .format('YYYY-MM-DD')

      return { date, vol: 0 }
    })
    .reverse()

  return emptyData
}

const createTradingVolumeChart = ({
  chart,
  container,
  data,
  theme,
  setBalanceData,
  chartHeight,
}: ChartParams) => {
  const ctx = container?.getContext('2d')

  if (!ctx) {
    throw Error('Not a canvas:')
  }
  if (container) {
    container.height = chartHeight
  }
  const transformedData = getEmptyData()
    .map((value) => ({
      ...value,
      vol:
        data.find(
          (item: { date: string; vol: number }) => item.date === value.date
        )?.vol || 0,
    })) // Remove last empty point to prevent drop on daystart
    .filter((point, idx, arr) => !(idx === arr.length - 1 && point.vol === 0))

  const minVol = transformedData.reduce(
    (acc, item) => Math.min(acc, item?.vol || Number.MAX_SAFE_INTEGER),
    Number.MAX_SAFE_INTEGER
  )
  const maxVol = transformedData.reduce(
    (acc, item) => Math.max(acc, item?.vol || 0),
    minVol
  )

  if (chart) {
    chart.destroy()
  }
  chart = createChart({ ctx, type: 'bar', theme, setBalanceData })
  chart.data = {
    labels: transformedData.map((item) => dayjs(item.date).format('MMM, D')),
    datasets: [
      {
        fill: 'origin',
        tension: 0.5,
        backgroundColor: theme.colors.violet1,
        pointRadius: 0,
        borderWidth: 0,
        borderRadius: 4,
        borderSkipped: false,
        borderColor: theme.colors.violet1,
        hoverBackgroundColor: theme.colors.violet2,
        data: transformedData.map((item, i) => ({ x: i, y: item?.vol })),
      },
    ],
  }
  chart.options.scales.x?.grid?.display = false
  chart.options.scales.y?.grid?.display = false
  chart.options.scales.y.ticks.stepSize = (maxVol - minVol) / 3
  chart.options.scales.y?.grid?.drawBorder = false
  chart.options.scales.x?.grid?.drawBorder = false
  setTimeout(() => chart?.update()) // TODO: Remove after flickering issue

  return chart
}

export { createTradingVolumeChart }
