import { Chart } from 'chart.js'
import { COLORS, FONTS } from '../../../../variables'

const Months = [
  'Nov 27',
  'Dec 27',
  'Jan 27',
  'Feb 27',
  'Mar 27',
  'Apr 27',
  'May 27',
  'Jun 27',
  'Jul 27',
  'Avg 27',
  'Sep 27',
  'Oct 27',
]

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]



export const createRewardsChart = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw Error('Not a canvas:')
  }
  const gradient = ctx.createLinearGradient(0, 0, 0, 400)
  gradient.addColorStop(0, 'rgba(101, 28, 228, 0.84)')
  gradient.addColorStop(0.55, 'rgba(115, 128, 235, 0)')
  gradient.addColorStop(1, '#222429')

  const data = [10]
  const month = new Date().getMonth()
  const year = new Date().getFullYear() - 2000
  const labels = [`${MONTHS[month]} ${year}`]


  for (let i = month + 1; i < month + 12; i++) {
    const m = i % 12
    const addYear = Math.floor(i / 12)
    const yearResult = year + addYear
    labels.push(`${MONTHS[m]} ${yearResult}`)
    const prevData = data[data.length - 1]
    data.push(prevData * 1 + Math.random() * 0.7)
  }

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          fill: 'origin',
          tension: 0.3,
          borderColor: COLORS.primary,
          backgroundColor: gradient,
          borderWidth: 2,
          pointRadius: 0,
          hoverBackgroundColor: 'rgba(28, 29, 34, 0.75)',
          data,
        },
      ],
    },
    options: {
      scales: {
        x: {
          stacked: true,
          gridLines: {
            display: true,
            color: COLORS.chartGrid,
          },
          ticks: {
            align: 'end',
            color: COLORS.textAlt,
            font: {
              size: 16,
              family: FONTS.main,
            },
          },
        },
        y: {
          gridLines: {
            display: true,
            color: COLORS.chartGrid,
            drawBorder: false,
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
          enabled: false,
          intersect: false,
        },
      },
      layout: {
        padding: {
          top: 25,
          right: 0,
          left: 0,
        },
      },
    },
  })
}
