import { randomInteger } from '@core/utils/helpers'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
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
  '#651CE4',
  '#D5A688',
  '#90D7C7',
  '#4DA5E6',
  '#6891EE',
]

export const fixedColorsForLegend = [
  'linear-gradient(90deg, #651CE4 0%, #747CF6 95.65%)',
  'linear-gradient(90deg, #D3A987 0%, #EE7A96 100%)',
  'linear-gradient(90deg, #95D2BA 0%, #83E6EC 100%)',
  'linear-gradient(90deg, #4071B6 0%, #52B7F6 100%)',
]

export const getRandomBlueColor = () => {
  const randomColor = fixedColors[randomInteger(0, fixedColors.length - 1)]
  const randomNumber = randomInteger(-40, 40)
  return lightenDarkenColor(randomColor, randomNumber)
}

export const formatSymbol = ({ symbol }: { symbol: string }) => {
  
  if (symbol.length > 15) {
    return `${symbol.slice(0, 3)}...${symbol.slice(symbol.length - 3)}`
  } else {
    return symbol
  }
}

const createAllocationDonutChart = ({
  id,
  data,
  colors,
  tooltipData,
}: {
  id: string
  data: any
  colors: string[]
  tooltipData: any
}) => {
  const ctx = document
    .getElementById(`AllocationDonutChart-${id}`)
    ?.getContext('2d')

  window[`AllocationDonutChart-${id}`] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Donut Chart Dataset',
          data: data.filter((el) => el),
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
            label: (text) =>
              `${text.formattedValue}% ${
                tooltipData.find((el) => el.value === text.dataPoint).symbol
              }`,
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
