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

const getEmptyData = (
  fisrtTimestamp: number = endOfDayTimestamp -
    dayDuration * NUMBER_OF_DAYS_TO_SHOW,
  lastTimestamp: number = endOfDayTimestamp
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
  id,
  theme,
  data,
}: {
  id: string
  theme: Theme
  data: []
}) => {
  const ctx = document
    .getElementById('TotalVolumeLockedChart')
    ?.getContext('2d')

  const gradient = ctx.createLinearGradient(0, 0, 0, 400)
  gradient.addColorStop(0, 'rgba(54, 108, 229, 0.84)')
  gradient.addColorStop(0.55, 'rgba(115, 128, 235, 0)')
  gradient.addColorStop(1, '#222429')

  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth

  const transformedData = getEmptyData().map((value) => ({
    ...value,
    vol:
      data.find(
        (item: { date: string; vol: number }) => item.date === value.date
      )?.vol || 0,
  }))

  console.log('transformedData', transformedData)

  window[`TotalVolumeLockedChart-${id}`] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: transformedData.map((item) => dayjs(item.date).format('MMM, D')),
      datasets: [
        {
          fill: 'origin',
          tension: 0.5,
          borderColor: '#7380EB',
          backgroundColor: gradient,
          borderWidth: 2,
          pointRadius: 0,
          hoverBackgroundColor: 'rgba(28, 29, 34, 0.75)',
          data: transformedData.map((item, i) => ({ x: i, y: item?.vol })),
        },
      ],
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
            color: '#F5F5FB',
            font: {
              size: +(width / 130).toFixed(0),
              family: 'Avenir Next',
            },
          },
        },
        y: {
          position: 'right',
          gridLines: {
            display: false,
            color: '#383B45',
          },
          ticks: {
            padding: 15,
            callback: (value) =>
              value > 1000000
                ? `$${stripDigitPlaces(value / 1000000, 2)}m`
                : `$${formatNumberToUSFormat(stripDigitPlaces(value, 0))}`,
            color: '#F5F5FB',
            stepSize: data[data.length - 1]?.vol / 5,
            font: {
              size: +(width / 130).toFixed(0),
              family: 'Avenir Next',
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
          enabled: false,
          intersect: false,
        },
      },
      layout: {
        padding: {
          top: 25,
          right: 15,
          left: 70,
        },
      },
      onResize: () => {
        if (!window[`TotalVolumeLockedChart-${id}`]) return

        const width =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth

        window[`TotalVolumeLockedChart-${id}`].options.scales = {
          x: {
            stacked: true,
            gridLines: {
              display: false,
            },
            ticks: {
              align: 'end',
              color: '#F5F5FB',
              font: {
                size: +(width / 130).toFixed(0),
                family: 'Avenir Next',
              },
            },
          },
          y: {
            position: 'right',
            gridLines: {
              display: false,
              color: '#383B45',
            },
            ticks: {
              padding: 15,
              callback: (value) =>
                value > 1000000
                  ? `$${stripDigitPlaces(value / 1000000, 2)}m`
                  : `$${formatNumberToUSFormat(stripDigitPlaces(value, 0))}`,
              color: '#F5F5FB',
              stepSize: data[data.length - 1]?.vol / 5,
              font: {
                size: +(width / 130).toFixed(0),
                family: 'Avenir Next',
              },
            },
          },
        }
      },
    },
  })
}

const createTradingVolumeChart = ({
  id,
  theme,
  data,
}: {
  id: string
  theme: Theme
  data: []
}) => {
  const ctx = document.getElementById('TradingVolumeChart')?.getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 0, 400)
  gradient.addColorStop(0, 'rgba(165, 232, 152, 0.85)')
  gradient.addColorStop(0.55, 'rgba(165, 232, 152, 0)')
  gradient.addColorStop(1, '#222429')

  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth

  const transformedData = getEmptyData().map((value) => ({
    ...value,
    vol:
      data.find(
        (item: { date: string; vol: number }) => item.date === value.date
      )?.vol || 0,
  }))

  window[`TradingVolumeChart-${id}`] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: transformedData.map((item) => dayjs(item.date).format('MMM, D')),
      datasets: [
        {
          fill: 'origin',
          tension: 0.5,
          borderColor: theme.palette.green.new,
          backgroundColor: gradient,
          borderWidth: 2,
          pointRadius: 0,
          hoverBackgroundColor: 'rgba(28, 29, 34, 0.75)',
          data: transformedData.map((item, i) => ({ x: i, y: item?.vol })),
        },
      ],
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
            color: '#F5F5FB',
            font: {
              size: +(width / 130).toFixed(0),
              family: 'Avenir Next',
            },
          },
        },
        y: {
          position: 'right',
          gridLines: {
            display: false,
            color: '#383B45',
          },
          ticks: {
            padding: 15,
            callback: (value) =>
              value > 1000000
                ? `$${stripDigitPlaces(value / 1000000, 2)}m`
                : `$${formatNumberToUSFormat(stripDigitPlaces(value, 0))}`,
            color: '#F5F5FB',
            // stepSize: Math.max(data.map(d => d.vol)) / 5,
            font: {
              size: +(width / 130).toFixed(0),
              family: 'Avenir Next',
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
          enabled: false,
          intersect: false,
        },
      },
      layout: {
        padding: {
          top: 25,
          right: 15,
          left: 70,
        },
      },
      onResize: () => {
        if (!window[`TradingVolumeChart-${id}`]) return

        const width =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth

        window[`TradingVolumeChart-${id}`].options.scales = {
          x: {
            stacked: true,
            gridLines: {
              display: false,
            },
            ticks: {
              align: 'end',
              color: '#F5F5FB',
              font: {
                size: +(width / 130).toFixed(0),
                family: 'Avenir Next',
              },
            },
          },
          y: {
            position: 'right',
            gridLines: {
              display: false,
              color: '#383B45',
            },
            ticks: {
              padding: 15,
              callback: (value) => {
                return value > 1000000
                  ? `$${stripDigitPlaces(value / 1000000, 2)}m`
                  : `$${formatNumberToUSFormat(stripDigitPlaces(value, 0))}`
              },
              color: '#F5F5FB',
              stepSize: data[data.length - 1]?.vol / 5,
              font: {
                size: +(width / 130).toFixed(0),
                family: 'Avenir Next',
              },
            },
          },
        }
      },
    },
  })
}

export { createTotalVolumeLockedChart, createTradingVolumeChart }
