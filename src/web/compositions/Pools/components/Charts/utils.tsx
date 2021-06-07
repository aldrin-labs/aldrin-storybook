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

const mockData = [
  { day: '2020-05-01', total: 10000 },
  { day: '2020-05-02', total: 30000 },
  { day: '2020-05-03', total: 20000 },
  { day: '2020-05-04', total: 50000 },
  { day: '2020-05-05', total: 100000 },
]

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

  window[`TotalVolumeLockedChart-${id}`] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map((item) => dayjs(item.date).format('MMM, D')),
      datasets: [
        {
          fill: 'origin',
          tension: 0.5,
          borderColor: '#7380EB',
          backgroundColor: gradient,
          borderWidth: 2,
          pointRadius: 0,
          hoverBackgroundColor: 'rgba(28, 29, 34, 0.75)',
          data: data.map((item, i) => ({ x: i, y: item.vol })),
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
              `$${formatNumberToUSFormat(stripDigitPlaces(value, 0))}`,
            color: '#F5F5FB',
            stepSize: data[data.length - 1].vol / 5,
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
                `$${formatNumberToUSFormat(stripDigitPlaces(value, 0))}`,
              color: '#F5F5FB',
              stepSize: data[data.length - 1].vol / 5,
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

  window[`TradingVolumeChart-${id}`] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data?.map((item) => dayjs(item.date).format('MMM, D')),
      datasets: [
        {
          fill: 'origin',
          tension: 0.5,
          borderColor: theme.palette.green.new,
          backgroundColor: gradient,
          borderWidth: 2,
          pointRadius: 0,
          hoverBackgroundColor: 'rgba(28, 29, 34, 0.75)',
          data: data.map((item, i) => ({ x: i, y: item.vol })),
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
              `$ ${formatNumberToUSFormat(stripDigitPlaces(value, 0))}`,
            color: '#F5F5FB',
            stepSize: data[data.length - 1].vol / 5,
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
              callback: (value) =>
                `$ ${formatNumberToUSFormat(stripDigitPlaces(value, 0))}`,
              color: '#F5F5FB',
              stepSize: data[data.length - 1].vol / 5,
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
