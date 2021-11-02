import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(timezone)
dayjs.extend(utc)

import {
  Chart,
  BarElement,
  PointElement,
  BarController,
  LinearScale,
  CategoryScale,
  Tooltip,
  LineElement,
  LineController,
  PolarAreaController,
  Filler,
  BubbleController,
} from 'chart.js'

import {
  stripDigitPlaces,
  formatNumberToUSFormat,
} from '@core/utils/PortfolioTableUtils'

import { Theme } from '@material-ui/core'
import {
  dayDuration,
  endOfDayTimestamp,
} from '@sb/compositions/AnalyticsRoute/components/utils'
import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'
import { FONTS, FONT_SIZES, COLORS } from '@variables/variables'

Chart.register(
  BarElement,
  PointElement,
  BarController,
  LinearScale,
  CategoryScale,
  Tooltip,
  LineElement,
  LineController,
  PolarAreaController,
  BubbleController,
  Filler
)

const NUMBER_OF_DAYS_TO_SHOW = 6
const CHART_HEIGHT = 220

interface ChartParams<T = []> {
  chart: Chart | null
  data: T
  container: HTMLCanvasElement
}

const createChart = (ctx: CanvasRenderingContext2D) =>
  new Chart(ctx, {
    type: 'line',
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
            align: 'end',
            color: COLORS.textAlt,
            font: {
              size: 12,
              family: FONTS.main,
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
            color: COLORS.textAlt,
            // maxTicksLimit: 5,
            // stepSize: 1,
            font: {
              size: 12,
              family: FONTS.main,
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
  let dayEndTimestamp: number = dayjs
    .unix(lastTimestamp)
    .startOf('day')
    .unix()

  const emptyData = []

  do {
    const day = dayjs.unix(dayEndTimestamp).format('YYYY-MM-DD')
    emptyData.push({
      date: day,
      vol: 0,
    })

    dayEndTimestamp -= dayDuration
  } while (dayEndTimestamp >= fisrtTimestamp)

  return emptyData.reverse()
}

const createTotalVolumeLockedChart = ({
  container,
  data,
  chart
}: ChartParams) => {
  container.height = CHART_HEIGHT
  const ctx = container.getContext('2d')

  if (!ctx) {
    throw Error('Not a canvas:')
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, 400)
  gradient.addColorStop(0, 'rgba(101, 28, 228, 0.84)')
  gradient.addColorStop(0.55, 'rgba(115, 128, 235, 0)')
  gradient.addColorStop(1, COLORS.blockBackground)

  const transformedData = getEmptyData().map((value) => ({
    ...value,
    vol:
      data.find(
        (item: { date: string; vol: number }) => item.date === value.date
      )?.vol || 0,
  }))

  const maxVol = transformedData.reduce((acc, item) => Math.max(acc, (item?.vol || 0)), 0)

  chart = chart || createChart(ctx)
  chart.data = {
    labels: transformedData.map((item) => dayjs(item.date).format('MMM, D')),
    datasets: [
      {
        fill: 'origin',
        tension: 0.5,
        borderColor: COLORS.primary,
        backgroundColor: gradient,
        borderWidth: 2,
        pointRadius: 0,
        hoverBackgroundColor: 'rgba(28, 29, 34, 0.75)',
        data: transformedData.map((item, i) => ({ x: i, y: item?.vol })),
      },
    ],
  }
  chart.options.scales.y.ticks.stepSize = maxVol / 5
  chart.update()
  return chart
}

const createTradingVolumeChart = ({
  chart,
  container,
  data,
}: ChartParams) => {
  const ctx = container.getContext('2d')

  if (!ctx) {
    throw Error('Not a canvas:')
  }

  container.height = CHART_HEIGHT
  const gradient = ctx.createLinearGradient(0, 0, 0, 400)

  gradient.addColorStop(0, 'rgb(83, 223, 17, 0.85)')
  gradient.addColorStop(0.55, 'rgba(165, 232, 152, 0)')
  gradient.addColorStop(1, COLORS.blockBackground)

  const transformedData = getEmptyData().map((value) => ({
    ...value,
    vol:
      data.find(
        (item: { date: string; vol: number }) => item.date === value.date
      )?.vol || 0,
  }))

  const maxVol = transformedData.reduce((acc, item) => Math.max(acc, (item?.vol || 0)), 0)

  chart = chart || createChart(ctx)
  chart.data = {
    labels: transformedData.map((item) => dayjs(item.date).format('MMM, D')),
    datasets: [
      {
        fill: 'origin',
        tension: 0.5,
        borderColor: COLORS.success,
        backgroundColor: gradient,
        borderWidth: 2,
        pointRadius: 0,
        hoverBackgroundColor: 'rgba(28, 29, 34, 0.75)',
        data: transformedData.map((item, i) => ({ x: i, y: item?.vol })),
      },
    ],
  }

  chart.options.scales.y.ticks.stepSize = maxVol / 5
  chart.update()
  return chart

}

export { createTotalVolumeLockedChart, createTradingVolumeChart }
