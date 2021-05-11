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

const mockData = [{ day: '01-05-2020', total: 10000 }]

const createTotalVolumeLockedChart = ({
  id,
  theme,
}: {
  id: string
  theme: Theme
}) => {
  const ctx = document
    .getElementById('TotalVolumeLockedChart')
    ?.getContext('2d')

  const gradient = ctx.createLinearGradient(0, 0, 0, 400)
  gradient.addColorStop(0, '#A5E898')
  gradient.addColorStop(1, '#97E873')

  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth

  window[`TotalVolumeLockedChart-${id}`] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: mockData.map((item) => dayjs(item.day).format('D MMM')),
      datasets: [
        {
          fill: 'origin',
          tension: 0.5,
          borderColor: theme.palette.blue.serum,
          backgroundColor: gradient,
          borderWidth: 2,
          hoverBackgroundColor: 'rgba(28, 29, 34, 0.75)',
          data: mockData.map((item, i) => ({ x: i, y: item.total })),
        },
      ],
    },
    options: {
      scales: {
        x: {
          stacked: true,
          gridLines: {
            display: false,
            color: '#383B45',
          },
          ticks: {
            color: '#fff',
            font: {
              size: +(width / 140).toFixed(0),
              family: 'Avenir Next',
            },
          },
        },
        y: {
          gridLines: {
            display: true,
            color: '#383B45',
          },
          ticks: {
            color: '#fff',
            font: {
              size: +(width / 140).toFixed(0),
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
          top: 15,
        },
      },
    },
  })
}

export { createTotalVolumeLockedChart }
