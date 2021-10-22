import { Chart } from 'chart.js'

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

export const createRewardsChart = ({ id }: { id: string }) => {
  const ctx = document.getElementById('RewardsChart')?.getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 0, 400)
  gradient.addColorStop(0, 'rgba(101, 28, 228, 0.84)')
  gradient.addColorStop(0.55, 'rgba(115, 128, 235, 0)')
  gradient.addColorStop(1, '#222429')

  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth

  window[`RewardsChart-${id}`] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Months,
      datasets: [
        {
          fill: 'origin',
          tension: 0.3,
          borderColor: '#651CE4',
          backgroundColor: gradient,
          borderWidth: 2,
          pointRadius: 0,
          hoverBackgroundColor: 'rgba(28, 29, 34, 0.75)',
          data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 100, 110, 120],
        },
      ],
    },
    options: {
      scales: {
        x: {
          stacked: true,
          gridLines: {
            display: true,
            color: '#4C4F59',
          },
          ticks: {
            align: 'end',
            color: '#F5F5FB',
            font: {
              size: +(width / 145).toFixed(0),
              family: 'Avenir Next',
            },
          },
        },
        y: {
          gridLines: {
            display: true,
            color: '#4C4F59',
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
          right: 25,
          left: 25,
        },
      },
    },
  })
}
