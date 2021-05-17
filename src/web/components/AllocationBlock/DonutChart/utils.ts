import { randomInteger } from '@core/utils/helpers'
import { Chart, DoughnutController, ArcElement } from 'chart.js'

Chart.register(DoughnutController, ArcElement)

const lightenDarkenColor = (baseColor: string, amt: number) => {
  let usePound = false
  if (baseColor[0] == '#') {
    baseColor = baseColor.slice(1)
    usePound = true
  }

  let num = parseInt(baseColor, 16)

  let r = (num >> 16) + amt

  if (r > 255) r = 255
  else if (r < 0) r = 0

  let b = ((num >> 8) & 0x00ff) + amt

  if (b > 255) b = 255
  else if (b < 0) b = 0

  let g = (num & 0x0000ff) + amt

  if (g > 255) g = 255
  else if (g < 0) g = 0

  return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16)
}

export const fixedColors = [
  '#366CE5',
  '#D5A688',
  '#4DA5E6',
  '#90D7C7',
  '#6891EE',
]

export const getRandomBlueColor = () => {
  const randomColor = fixedColors[randomInteger(0, fixedColors.length - 1)]
  const randomNumber = randomInteger(-40, 40)
  return lightenDarkenColor(randomColor, randomNumber)
}

const createAllocationDonutChart = ({
  id,
  data,
  colors,
}: {
  id: string
  data: number[]
  colors: string[]
}) => {
  const ctx = document.getElementById(`AllocationDonutChart-${id}`)?.getContext('2d')

  window[`AllocationDonutChart-${id}`] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Donut Chart Dataset',
          data,
          backgroundColor: colors,
          hoverOffset: 4,
          borderWidth: 0,
        },
      ],
    },
    options: {
      scales: {
        x: {
          display: false,
          gridLines: {
            display: false,
          },
        },
        y: {
          display: false,
          gridLines: {
            display: false,
          },
        },
      },
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (text) => `${text.formattedValue}%`,
          },
          intersect: false,
        },
      },
      layout: {
        padding: {
          top: 25,
          bottom: 25,
          left: 25,
        },
      },
    },
  })
}

export { createAllocationDonutChart }
