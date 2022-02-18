import moment from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

moment.extend(timezone)
moment.extend(utc)

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

import { getIsNotUSDTQuote } from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapper.utils'

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

export const getTimezone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone // city

export const getTimestampsForDays = (
  fisrtTimestamp: number,
  lastTimestamp: number
) => {
  let dayEndTimestamp: number = moment
    .unix(lastTimestamp)
    .startOf('day')
    .unix()

  const dayStartTimestamps = {}
  do {
    const day = moment.unix(dayEndTimestamp).format('YYYY-MM-DD')
    dayStartTimestamps[day] = {
      timestamp: dayEndTimestamp,
      day,
      total: 0,
      buy: 0,
      sell: 0,
    }

    dayEndTimestamp -= 86400
  } while (dayEndTimestamp >= fisrtTimestamp)

  return dayStartTimestamps
}

export const generateIDFromValues = (arr: any[]) =>
  arr.reduce((acc, cur) => acc + cur.buy + cur.sell, '')

export const endOfDayTimestamp = () => moment()
  .endOf('day')
  .unix()

export const startOfDayTimestamp = () => moment()
  .startOf('day')
  .unix()

export const dayDuration = 24 * 60 * 60

export const createButterflyChart = (
  id: string,
  data: any,
  needQuoteInLabel = false,
  selectedPair = ''
) => {
  const ctx = document.getElementById(`butterflyChart-${id}`)?.getContext('2d')

  const topBarGradient = ctx.createLinearGradient(0, 0, 0, 400)
  topBarGradient.addColorStop(0, '#269F13')
  topBarGradient.addColorStop(1, '#97E873')

  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth

  const barPercentage = width > 2560 ? 0.3 : width < 1600 ? 0.5 : 0.4

  const [base, quote] = selectedPair.split('_')
  const isNotUSDTQuote = getIsNotUSDTQuote(selectedPair)

  const dataMap = getTimestampsForDays(
    endOfDayTimestamp() - dayDuration * 14,
    endOfDayTimestamp()
  )

  data.forEach((dayData) => {
    if (dataMap[dayData.day]) {
      const prevData = dataMap[dayData.day]
      dataMap[dayData.day] = {
        ...prevData,
        total: prevData.total + dayData.total,
        buy: prevData.buy + dayData.buy,
        sell: prevData.sell + dayData.sell,
      }
    }
  })

  const arrayData = Object.values(dataMap)
    .map((el) =>
      el.timestamp < 1613944800
        ? { day: el.day, timestamp: el.timestamp, buy: 0, sell: 0, total: 0 }
        : { ...el }
    )
    .sort((a, b) => a.timestamp - b.timestamp)

  window[`butterflyChart-${id}`] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: arrayData.map((item) => moment(item.day).format('D MMM')),
      datasets: [
        {
          barPercentage,
          borderColor: '#269F13',
          label: 'data-1',
          backgroundColor: '#1C1D22',
          borderRadius: 50,
          borderWidth: 6,
          data: arrayData.map((item) => item.buy),
        },
        {
          barPercentage,
          borderColor: '#F26D68',
          label: 'data-2',
          backgroundColor: '#1C1D22',
          borderRadius: 50,
          borderWidth: 6,
          data: arrayData.map((item) => item.sell * -1),
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
                  return `${isNotUSDTQuote ? '' : '$'}${Math.abs(value)}${
                    isNotUSDTQuote ? ` ${quote}` : ''
                  }`
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
              callback: needQuoteInLabel
                ? function(value, index, values) {
                    return `${
                      needQuoteInLabel ? (isNotUSDTQuote ? '' : '$') : ''
                    }${Math.abs(value)}${
                      isNotUSDTQuote && needQuoteInLabel ? ` ${quote}` : ''
                    }`
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
          intersect: false,
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
                  needQuoteInLabel ? `${isNotUSDTQuote ? '' : '$'}` : ''
                }${formatNumberToUSFormat(
                  stripDigitPlaces(tooltipModel.dataPoints[0].dataPoint.y, 0)
                )}${isNotUSDTQuote && needQuoteInLabel ? ` ${quote}` : ''}`
              if (sellCountBlock)
                sellCountBlock.innerHTML = `${
                  needQuoteInLabel ? `${isNotUSDTQuote ? '' : '$'}` : ''
                }${formatNumberToUSFormat(
                  stripDigitPlaces(
                    Math.abs(tooltipModel.dataPoints[1].dataPoint.y),
                    0
                  )
                )}${isNotUSDTQuote && needQuoteInLabel ? ` ${quote}` : ''}`
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

              if (left + tooltipModel._size.width * 1.5 >= width) {
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

export const createAreaChart = (data: any, selectedPair = '', theme) => {
  const ctx = document.getElementById('areaChart')?.getContext('2d')

  const gradient = ctx.createLinearGradient(0, 0, 0, 400)
  gradient.addColorStop(0, 'rgba(54, 108, 229, 0.8)')
  gradient.addColorStop(1, 'rgba(54, 108, 229, 0)')

  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth

  const [base, quote] = selectedPair.split('_')
  const isNotUSDTQuote = getIsNotUSDTQuote(selectedPair)

  const dataMap = getTimestampsForDays(
    endOfDayTimestamp() - dayDuration * 30,
    endOfDayTimestamp()
  )

  data.forEach((dayData) => {
    if (dataMap[dayData.day]) {
      dataMap[dayData.day] = {
        ...dataMap[dayData.day],
        total: dayData.total,
      }
    }
  })

  const arrayData = Object.values(dataMap).sort(
    (a, b) => a.timestamp - b.timestamp
  )

  window.myAreaChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: arrayData.map((item) => moment(item.day).format('D MMM')),
      datasets: [
        {
          fill: 'origin',
          tension: 0.5,
          borderColor: theme.palette.blue.serum,
          backgroundColor: gradient,
          borderWidth: 2,
          hoverBackgroundColor: 'rgba(28, 29, 34, 0.75)',
          data: arrayData.map((item, i) => ({ x: i, y: item.total })),
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
              let valueToShow: number | string = +value

              if (valueToShow === 0) {
                valueToShow = 0
              } else if (valueToShow % 1000000 === 0) {
                valueToShow = valueToShow / 1000000 + 'M'
              } else if (valueToShow % 1000 === 0) {
                valueToShow = valueToShow / 1000 + 'K'
              }

              return `${isNotUSDTQuote ? '' : '$'}${valueToShow}${
                isNotUSDTQuote ? ` ${quote}` : ''
              }`
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
                let valueToShow: number | string = +value

                if (valueToShow === 0) {
                  valueToShow = 0
                } else if (valueToShow % 1000000 === 0) {
                  valueToShow = valueToShow / 1000000 + 'M'
                } else if (valueToShow % 1000 === 0) {
                  valueToShow = valueToShow / 1000 + 'K'
                }

                return `${isNotUSDTQuote ? '' : '$'}${valueToShow}${
                  isNotUSDTQuote ? ` ${quote}` : ''
                }`
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
              `${isNotUSDTQuote ? '' : '$'}${formatNumberToUSFormat(
                stripDigitPlaces(item[0].dataPoint.y, 2)
              )}${isNotUSDTQuote ? ` ${quote}` : ''}`,
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
