import moment from 'dayjs'
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

export const endOfDayTimestamp = moment()
  .endOf('day')
  .valueOf()
export const dayDuration = 24 * 60 * 60 * 1000

const last30DaysTimestamps = []

for (let i = 1; i <= 30; i++) {
  last30DaysTimestamps.push(endOfDayTimestamp - dayDuration * i)
}

last30DaysTimestamps.reverse()

export const createButterflyChart = (
  id: string,
  data: any,
  needQuoteInLabel = false
) => {
  const ctx = document.getElementById(`butterflyChart-${id}`)?.getContext('2d')

  const topBarGradient = ctx.createLinearGradient(0, 0, 0, 400)
  topBarGradient.addColorStop(0, '#A5E898')
  topBarGradient.addColorStop(1, '#97E873')

  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth

  const barPercentage = width > 2560 ? 0.3 : width < 1600 ? 0.5 : 0.4

  window[`butterflyChart-${id}`] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map((item) => moment(item.date).format('D MMM')),
      datasets: [
        {
          barPercentage,
          borderColor: '#A5E898',
          label: 'data-1',
          backgroundColor: '#1C1D22',
          borderRadius: 50,
          borderWidth: 6,
          data: data.map((item) => item.buy),
        },
        {
          barPercentage,
          borderColor: '#F26D68',
          label: 'data-2',
          backgroundColor: '#1C1D22',
          borderRadius: 50,
          borderWidth: 6,
          data: data.map((item) => item.sell * -1),
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
            callback: needQuoteInLabel
              ? function(value, index, values) {
                  return `$${Math.abs(value)}`
                }
              : function(value, index, values) {
                  return String(Math.abs(value))
                },
            font: {
              size: +(width / 140).toFixed(0),
              family: 'Avenir Next',
            },
          },
        },
      },
      onResize: (myChart, size) => {
        if (!window[`butterflyChart-${id}`].options) return

        const width =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth

        window[`butterflyChart-${id}`].options.scales = {
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
              callback: function(value, index, values) {
                return String(Math.abs(value))
              },
              font: {
                size: +(width / 140).toFixed(0),
                family: 'Avenir Next',
              },
            },
          },
        }

        const barPercentage = width > 2560 ? 0.3 : width < 1600 ? 0.5 : 0.4
        window[`butterflyChart-${id}`].data.datasets.forEach(
          (dataset) => (dataset.barPercentage = barPercentage)
        )
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
          custom: (context) => {
            var tooltipEl = document.getElementById(
              `butterflyChart-tooltip-${id}`
            )

            // Hide if no tooltip
            var tooltipModel = context.tooltip
            if (tooltipEl && tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = '0'
              return
            }

            // Set caret Position
            tooltipEl?.classList.remove('above', 'below', 'no-transform')
            if (tooltipModel.yAlign) {
              tooltipEl?.classList.add(tooltipModel.yAlign)
            } else {
              tooltipEl?.classList.add('no-transform')
            }

            // Set Text
            if (tooltipModel.body) {
              const dateBlock = document.getElementById(
                `butterflyChart-tooltip-${id}-date`
              )

              const buyCountBlock = document.getElementById(
                `butterflyChart-tooltip-${id}-buy`
              )

              const sellCountBlock = document.getElementById(
                `butterflyChart-tooltip-${id}-sell`
              )

              if (dateBlock)
                dateBlock.innerHTML = `${tooltipModel.title[0]}, 2021` // hardcoded for now, need to be determined normally
              if (buyCountBlock)
                buyCountBlock.innerHTML = `${
                  needQuoteInLabel ? '$' : ''
                }${formatNumberToUSFormat(
                  stripDigitPlaces(tooltipModel.dataPoints[0].dataPoint.y, 0)
                )}`
              if (sellCountBlock)
                sellCountBlock.innerHTML = `${
                  needQuoteInLabel ? '$' : ''
                }${formatNumberToUSFormat(
                  stripDigitPlaces(
                    Math.abs(tooltipModel.dataPoints[1].dataPoint.y),
                    0
                  )
                )}`
            }

            var position = context.chart.canvas.getBoundingClientRect()

            // Display, position, and set styles for font
            if (tooltipEl) {
              tooltipEl.style.opacity = '1'
              tooltipEl.style.position = 'absolute'
              const left =
                position.left +
                window.pageXOffset +
                tooltipModel.caretX +
                tooltipModel._size.width / 3

              tooltipEl.style.left = left + 'px'

              if (left + tooltipModel._size.width >= width) {
                tooltipEl.style.left =
                  left - tooltipModel._size.width * 2 + 'px'
              }

              tooltipEl.style.top =
                position.top + window.pageYOffset + tooltipModel.caretY + 'px'

              tooltipEl.style.pointerEvents = 'none'
            }
          },
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

export const createAreaChart = (data: any) => {
  const ctx = document.getElementById('areaChart')?.getContext('2d')

  const gradient = ctx.createLinearGradient(0, 0, 0, 400)
  gradient.addColorStop(0, 'rgba(115, 128, 235, 0.55)')
  gradient.addColorStop(1, 'rgba(115, 128, 235, 0)')

  const chartDataMap = new Map()

  data.forEach((item) => {
    if (chartDataMap.has(item.date)) {
      chartDataMap.set(item.date, chartDataMap.get(item.date) + item.total)
    } else {
      chartDataMap.set(item.date, item.total)
    }
  })

  const chartData = [...chartDataMap.values()]

  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth

  window.myAreaChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data
        .slice(0, 30)
        .map((item) => moment(item.date).format('D MMM')),
      datasets: [
        {
          fill: 'origin',
          tension: 0.5,
          borderColor: '#7380EB',
          backgroundColor: gradient,
          borderWidth: 2,
          // pointRadius: 0,
          hoverBackgroundColor: 'rgba(28, 29, 34, 0.75)',
          data: chartData.map((item, i) => ({ x: i, y: item })),
        },
      ],
    },
    options: {
      scales: {
        x: {
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
        y: {
          gridLines: {
            display: true,
            color: '#383B45',
          },
          ticks: {
            color: '#fff',
            callback: function(value, index, values) {
              return '$' + value
            },
            font: {
              size: +(width / 140).toFixed(0),
              family: 'Avenir Next',
            },
          },
        },
      },
      maintainAspectRatio: false,
      onResize: (myChart, size) => {
        if (!window.myAreaChart) return

        const width =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth

        window.myAreaChart.options.scales = {
          x: {
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
          y: {
            gridLines: {
              display: true,
              color: '#383B45',
            },
            ticks: {
              color: '#fff',
              callback: function(value, index, values) {
                return '$' + value
              },
              font: {
                size: +(width / 140).toFixed(0),
                family: 'Avenir Next',
              },
            },
          },
        }
      },
      plugins: {
        filler: {
          propagate: true,
        },
        tooltip: {
          enabled: true,
          intersect: false,
          position: 'average',
          titleAlign: 'center',
          titleFont: {
            family: 'Avenir Next',
            size: +(width / 110).toFixed(0),
            weight: 'normal',
          },
          titleSpacing: 5,
          borderWidth: 2,
          borderColor: '#383B45',
          boxWidth: +(width / 10).toFixed(0),
          caretSize: 0,
          bodyAlign: 'center',
          bodyFont: {
            family: 'Avenir Next',
            size: +(width / 120).toFixed(0),
          },
          footerAlign: 'center',
          footerFont: {
            family: 'Avenir Next',
            size: +(width / 90).toFixed(0),
          },
          callbacks: {
            beforeTitle: () => '',
            title: (item) => {
              return `${item[0].label}, 2021`
            },
            beforeBody: () => 'Total Volume',
            // body: (item) =>'',
            afterBody: () => '',
            beforeLabel: () => '',
            afterLabel: () => '',
            label: () => '',
            afterFooter: () => '',
            afterTitle: () => '—————————————————',
            beforeFooter: () => '',
            footer: (item) =>
              `$${formatNumberToUSFormat(
                stripDigitPlaces(item[0].dataPoint.y, 2)
              )}`,
          },
        },
        legend: {
          display: false,
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

export const createLinearChart = (data: any) => {
  console.log('srmVolumesInUSDT', data)
  const ctx = document.getElementById('linearChart')?.getContext('2d')

  const gradient = ctx.createLinearGradient(0, 0, 0, 400)
  gradient.addColorStop(0, 'rgba(115, 128, 235, 0.55)')
  gradient.addColorStop(1, 'rgba(115, 128, 235, 0)')

  // const chartDataMap = new Map()

  // data.forEach((item) => {})

  // const chartData = [...chartDataMap.values()]

  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth

  window.myLinearChart = new Chart(ctx, {
    type: 'line',
    // data: {
    //   labels: [],
    //   datasets: [
    //     {
    //       fill: 'origin',
    //       tension: 0.5,
    //       borderColor: '#7380EB',
    //       backgroundColor: gradient,
    //       borderWidth: 2,
    //       // pointRadius: 0,
    //       hoverBackgroundColor: 'rgba(28, 29, 34, 0.75)',
    //       data: [],
    //     },
    //   ],
    // },
    data: {
      labels: [
        100000,
        600000,
        1600000,
        6600000,
        16600000,
        41600000,
        45000000,
        // 91600000,
        // 166600000,
        // 266600000,
        // 466600000,
      ],
      datasets: [
        {
          backgroundColor: 'rgb(199, 255, 208)',
          borderColor: 'rgb(199, 255, 208)',
          pointRadius: 0,
          type: 'line',
          data: [
            { x: 100000, y: 200000 },
            { x: 600000, y: 400000 },
            { x: 1600000, y: 600000 },
            { x: 6600000, y: 800000 },
            { x: 16600000, y: 1000000 },
            { x: 41600000, y: 1200000 },
            { x: 45000000, y: 1213600 },
            // { x: 91600000, y: 1400000 },
            // { x: 166600000, y: 1600000 },
            // { x: 266600000, y: 1800000 },
            // { x: 466600000, y: 2000000 },
          ],
        },
        {
          type: 'bubble',
          backgroundColor: 'rgb(199, 255, 208)',
          borderColor: 'rgb(199, 255, 208)',
          radius: 9,
          data: [{ x: data.srmInUSDT, y: data.dcfi }],
        },
      ],
    },
    options: {
      elements: {
        line: {
          cubicInterpolationMode: 'default',
        },
      },
      scales: {
        x: {
          type: 'linear',
          gridLines: {
            display: true,
            color: 'rgb(246, 86, 131)',
          },
          ticks: {
            callback: function(value, index, values) {
              return '$' + value
            },
            color: '#fff',
            font: {
              size: +(width / 180).toFixed(0),
              family: 'Avenir Next',
            },
          },
        },
        y: {
          // type: 'linear',
          gridLines: {
            display: true,
            color: 'rgb(246, 86, 131)',
          },
          ticks: {
            callback: function(value, index, values) {
              if (value >= 1000000) {
                return value / 1000000 + 'M'
              } else {
                return value / 1000 + 'К'
              }
            },
            color: '#fff',
            font: {
              size: +(width / 180).toFixed(0),
              family: 'Avenir Next',
            },
          },
        },
      },
      // plugins: {
      //   tooltip: {
      //     enabled: true,
      //   },
      // },
    },
    onResize: (myChart, size) => {
      if (!window.myLinearChart) return

      const width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth

      window.myLinearChart.options.scales = {
        x: {
          gridLines: {
            display: true,
            color: 'rgb(246, 86, 131)',
          },
          ticks: {
            color: '#fff',
            font: {
              size: +(width / 180).toFixed(0),
              family: 'Avenir Next',
            },
          },
        },
        y: {
          gridLines: {
            display: true,
            color: 'rgb(246, 86, 131)',
          },
          ticks: {
            color: '#fff',
            font: {
              size: +(width / 180).toFixed(0),
              family: 'Avenir Next',
            },
          },
        },
      }
    },
  })

  ctx.beginPath()
  ctx.fillStyle = '#000' //or whatever color
  ctx.arc(10000, 10000, 20, 100, Math.PI * 2) //maybe too big for you, but you get the point
  ctx.fill()
}
