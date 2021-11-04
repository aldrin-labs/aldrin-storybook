import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'
import {
  dayDuration,
  endOfDayTimestamp
} from '@sb/compositions/AnalyticsRoute/components/utils'
import { COLORS, FONTS } from '@variables/variables'
import {
  BarController, BarElement,
  BubbleController, CategoryScale, Chart,
  ChartType, Filler, LinearScale,
  LineController, LineElement, PointElement,
  PolarAreaController, Tooltip
} from 'chart.js'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(timezone)
dayjs.extend(utc)


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

export const NUMBER_OF_DAYS_TO_SHOW = 10
const CHART_HEIGHT = 220

interface ChartParams<T = { date: number, vol?: number }[]> {
  chart: Chart | null
  data: T
  container: HTMLCanvasElement
}

const createChart = (ctx: CanvasRenderingContext2D, type: ChartType = 'line') =>
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
  fisrtTimestamp: number = endOfDayTimestamp() - dayDuration * NUMBER_OF_DAYS_TO_SHOW,
  lastTimestamp: number = endOfDayTimestamp()
) => {

  const tsFrom = dayjs
    .unix(fisrtTimestamp)
    .startOf('day')
    .unix()

  let tsTo = dayjs
    .unix(lastTimestamp)
    .startOf('day')
    .unix()

  const emptyData = []

  do {
    const date = dayjs.unix(tsTo).format('YYYY-MM-DD')
    emptyData.push({
      date,
      vol: 0,
    })

    tsTo -= dayDuration
  } while (tsTo >= tsFrom)

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
  }))// Remove last empty point to prevent drop on daystart
    .filter((point, idx, arr) => !(idx === arr.length - 1 && point.vol === 0))

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
  setTimeout(() => chart?.update()) // TODO: Remove after flickering issue
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

  const transformedData = getEmptyData()
    .map((value) => ({
      ...value,
      vol:
        data.find(
          (item: { date: string; vol: number }) => item.date === value.date
        )?.vol || 0,
    })) // Remove last empty point to prevent drop on daystart
    .filter((point, idx, arr) => !(idx === arr.length - 1 && point.vol === 0))

  const maxVol = transformedData.reduce((acc, item) => Math.max(acc, (item?.vol || 0)), 0)

  chart = chart || createChart(ctx, 'bar')
  chart.data = {
    labels: transformedData.map((item) => dayjs(item.date).format('MMM, D')),
    datasets: [
      {
        fill: 'origin',
        tension: 0.5,
        borderColor: COLORS.success,
        backgroundColor: COLORS.success,
        borderWidth: 0,
        pointRadius: 0,
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

  chart.options.scales.y.ticks.stepSize = maxVol / 5
  setTimeout(() => chart?.update()) // TODO: Remove after flickering issue

  return chart

}

export { createTotalVolumeLockedChart, createTradingVolumeChart }
