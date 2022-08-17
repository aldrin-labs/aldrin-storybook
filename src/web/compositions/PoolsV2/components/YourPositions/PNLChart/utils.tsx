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

dayjs.extend(timezone)
dayjs.extend(utc)

export const NUMBER_OF_DAYS_TO_SHOW = 30
const CHART_HEIGHT = 135

interface ChartParams<T = { date: number; vol?: number }[]> {
  chart: Chart | null
  data: T
  container: HTMLCanvasElement | null
  theme: DefaultTheme
  setBalanceData: ({ balance, date }: { balance: string; date: string }) => void
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
          // make tooltip hidden but leave enabled
          backgroundColor: 'transparent',
          titleColor: 'transparent',
          enabled: true,
          intersect: false,
          callbacks: {
            // label: (model: any) => {
            //   // set data to custom tooltip
            //   setBalanceData({
            //     balance: stripByAmountAndFormat(model.raw.y.toFixed(0)),
            //     date: model.label,
            //   })
            // },
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

export const createPNLChart = ({
  container,
  data,
  chart,
  setBalanceData,
}: ChartParams) => {
  if (container) {
    container.height = CHART_HEIGHT
  }
  const ctx = container?.getContext('2d')

  if (!ctx) {
    throw Error('Not a canvas:')
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, 230)
  gradient.addColorStop(0, 'rgba(0, 255, 133, 1)')
  gradient.addColorStop(0.55, 'rgba(193, 193, 193, 0)')

  const borderGradient = ctx.createLinearGradient(350, 0, 0, 0)
  borderGradient.addColorStop(0.9, 'rgba(0, 255, 133, 1)')
  borderGradient.addColorStop(0.5, 'rgba(201, 218, 209, 1)')
  borderGradient.addColorStop(0.25, 'rgba(0, 255, 133, 1)')

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
  chart = createChart({ ctx, setBalanceData })
  chart.data = {
    labels: transformedData.map((item) => dayjs(item.date).format('MMM, D')),
    datasets: [
      {
        fill: 'origin',
        tension: 0.3,
        borderColor: borderGradient,
        backgroundColor: gradient,
        borderWidth: 4,
        borderCapStyle: 'square',
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBorderColor: 'rgba(0, 255, 133, 1)',
        pointHoverBackgroundColor: '#FAFAFA',
        pointHoverBorderWidth: 4,
        hoverBackgroundColor: 'rgba(14, 2, 236, 0.75)',
        data: transformedData.map((item, i) => ({ x: i, y: item?.vol })),
      },
    ],
  }
  chart.options.scales.y.ticks.stepSize = (maxVol - maxVol * 0.2) / 5
  chart.options.scales.x?.grid?.display = false
  chart.options.scales.y?.grid?.display = false
  chart.options.layout?.padding = 0
  chart.options.scales.y?.grid?.drawBorder = false
  chart.options.scales.x?.grid?.drawBorder = false

  setTimeout(() => chart?.update()) // TODO: Remove after flickering issue
  return chart
}
