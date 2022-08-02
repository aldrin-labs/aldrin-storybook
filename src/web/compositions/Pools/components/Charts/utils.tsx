import { COLORS, MAIN_FONT, UCOLORS } from '@variables/variables'
import Chart from 'chart.js/auto'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { DefaultTheme } from 'styled-components'

import {
  dayDuration,
  endOfDayTimestamp,
} from '@sb/compositions/AnalyticsRoute/components/utils'

import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'

import { formatNumberToUSFormat } from '../../../../../../../core/src/utils/PortfolioTableUtils'

dayjs.extend(timezone)
dayjs.extend(utc)

export const NUMBER_OF_DAYS_TO_SHOW = 40
const CHART_HEIGHT = 220

interface ChartParams<T = { date: number; vol?: number }[]> {
  chart: Chart | null
  data: T
  container: HTMLCanvasElement | null
  theme: DefaultTheme
}

const createChart = ({
  ctx,
  type = 'line',
  theme,
}: {
  ctx: CanvasRenderingContext2D
  type: ChartType
  theme: DefaultTheme
}) =>
  new Chart(ctx, {
    type,
    data: {
      labels: [],
      datasets: [],
    },
    options: {
      scales: {
        x: {
          stacked: true,
          gridLines: {
            display: false,
          },
          ticks: {
            align: 'center',
            color: theme.colors.white1,
            maxRotation: 0,
            font: {
              size: 12,
              family: MAIN_FONT,
            },
          },
        },
        y: {
          position: 'right',
          gridLines: {
            display: false,
            color: COLORS.background,
          },

          ticks: {
            padding: 15,
            callback: (value) => `$${stripByAmountAndFormat(value)}`,
            color: theme.colors.white1,
            font: {
              size: 12,
              family: MAIN_FONT,
            },
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
          enabled: true,
          intersect: false,
          callbacks: {
            label: (model: any) => {
              return ` $${formatNumberToUSFormat(model.raw.y.toFixed(0))}`
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

const createTotalVolumeLockedChart = ({
  container,
  data,
  chart,
  theme,
}: ChartParams) => {
  // const theme = useTheme()
  if (container) {
    // eslint-disable-next-line no-param-reassign
    container.height = CHART_HEIGHT
  }
  const ctx = container?.getContext('2d')

  if (!ctx) {
    throw Error('Not a canvas:')
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, 400)
  gradient.addColorStop(0, theme.colors.greenChart[0])
  gradient.addColorStop(0.55, theme.colors.greenChart[1])

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

  chart = createChart({ ctx, theme })
  chart.data = {
    labels: transformedData.map((item) => dayjs(item.date).format('MMM, D')),
    datasets: [
      {
        fill: 'origin',
        tension: 0.5,
        borderColor: theme.colors.green1,
        backgroundColor: gradient,
        borderWidth: 2,
        pointRadius: 0,
        hoverBackgroundColor: 'rgba(14, 2, 236, 0.75)',
        data: transformedData.map((item, i) => ({ x: i, y: item?.vol })),
      },
    ],
  }
  chart.options.scales.y.ticks.stepSize = (maxVol - maxVol * 0.2) / 5
  chart.options.scales.x?.grid?.display = false
  chart.options.scales.y?.grid?.display = false
  chart.options.scales.y.suggestedMin = 0
  setTimeout(() => {
    try {
      chart?.update()
    } catch (e) {
      console.warn('Unable to update chart:', e)
    }
  }) // TODO: Remove after flickering issue
  return chart
}

const createTradingVolumeChart = ({
  chart,
  container,
  data,
  theme,
}: ChartParams) => {
  const ctx = container?.getContext('2d')

  if (!ctx) {
    throw Error('Not a canvas:')
  }
  if (container) {
    container.height = CHART_HEIGHT
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
  chart = createChart({ ctx, type: 'bar', theme })
  chart.data = {
    labels: transformedData.map((item) => dayjs(item.date).format('MMM, D')),
    datasets: [
      {
        fill: 'origin',
        tension: 0.5,
        borderColor: UCOLORS.violet3,
        backgroundColor: UCOLORS.violet3,
        borderWidth: 0,
        pointRadius: 0,
        hoverBackgroundColor: UCOLORS.violet1,
        borderRadius: {
          topLeft: 4,
          topRight: 4,
          bottomLeft: 4444,
          bottomRight: 4444,
        },

        data: transformedData.map((item, i) => ({ x: i, y: item?.vol })),
      },
    ],
  }
  chart.options.scales.x?.grid?.display = false
  chart.options.scales.y?.grid?.display = false
  chart.options.scales.y.ticks.stepSize = (maxVol - minVol) / 3
  setTimeout(() => {
    try {
      chart?.update()
    } catch (e) {
      console.warn('Unable to update chart:', e)
    }
  }) // TODO: Remove after flickering issue

  return chart
}

export { createTotalVolumeLockedChart, createTradingVolumeChart }
