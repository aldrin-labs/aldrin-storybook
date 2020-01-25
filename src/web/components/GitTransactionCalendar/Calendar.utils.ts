import moment from 'moment'

const getSquareClassName = (
  count: number,
  maxTransactionsCount: number,
  squareColorsRange: { range: number[]; className: string }[],
  isSPOTCurrently: boolean,
  realizedPnlSum: number
) => {
  const classNamePostfix = isSPOTCurrently
    ? ''
    : realizedPnlSum > 0
    ? 'Profit'
    : 'Loss'

  return count >= squareColorsRange[1].range[0] &&
    count <= squareColorsRange[1].range[1]
    ? `${squareColorsRange[1].className}${classNamePostfix}`
    : count >= squareColorsRange[2].range[0] &&
      count <= squareColorsRange[2].range[1]
    ? `${squareColorsRange[2].className}${classNamePostfix}`
    : count >= squareColorsRange[3].range[0] &&
      count <= squareColorsRange[3].range[1]
    ? `${squareColorsRange[3].className}${classNamePostfix}`
    : `${squareColorsRange[4].className}${classNamePostfix}`
}

export const getCalendarData = (
  portfolio = {
    portfolioActionsByDay: {
      actionsByDay: [],
    },
    futuresActionsByDay: {
      actionsByDay: [],
    },
  },
  maxTransactionsCount: number,
  startDate: number,
  isSPOTCurrently: boolean
) => {
  const {
    portfolioActionsByDay: { actionsByDay = [] },
    futuresActionsByDay: { actionsByDay: futuresActionsByDay = [] },
  } = portfolio
  const { squareColorsRange } = getSquareColorRange(maxTransactionsCount)

  const actions = isSPOTCurrently ? actionsByDay : futuresActionsByDay

  const lastDayOfYear = moment(startDate).isLeapYear() ? 367 : 366
  const mappedActionsArray = Array(lastDayOfYear)
    .fill(undefined)
    .map((el, index) => {
      const action = actions.find(
        (actionEl: { _id: number; transactionsCount: number }) =>
          actionEl._id === index
      )

      if (action) {
        const { transactionsCount, realizedPnlSum = 0, BNBFee = 0, USDTFee = 0, } = action

        return {
          date: moment(+startDate)
            .dayOfYear(action._id)
            .add(2, 'hours') // react-heatmap-calendar doesn't handle time change during seasons
            .toDate(),
          transactionsCount,
          realizedPnlSum,
          BNBFee,
          USDTFee,
          className: getSquareClassName(
            transactionsCount,
            maxTransactionsCount,
            squareColorsRange,
            isSPOTCurrently,
            realizedPnlSum
          ),
        }
      }

      return {
        date: moment(+startDate)
          .dayOfYear(index)
          .add(2, 'hours') // react-heatmap-calendar doesn't handle time change during seasons
          .toDate(),
        transactionsCount: 0,
        realizedPnlSum: 0,
        BNBFee: 0,
        USDTFee: 0,
        className: squareColorsRange[0].className,
      }
    })

  return { mappedActionsArray }
}

export const getMaxTransactions = (
  portfolio = {
    portfolioActionsByDay: {
      actionsByDay: [],
    },
    futuresActionsByDay: { actionsByDay: [] },
  },
  isSPOTCurrently = true
) => {
  const {
    portfolioActionsByDay: { actionsByDay = [] },
    futuresActionsByDay: { actionsByDay: futuresActionsByDay = [] },
  } = portfolio

  const actions = isSPOTCurrently ? actionsByDay : futuresActionsByDay

  const maxTransactionsCount = actions.reduce((max, { transactionsCount }) => {
    return transactionsCount > max ? transactionsCount : max
  }, 0)

  return maxTransactionsCount
}

export const getSquareColorRange = (maxTransactionsCount: number) => {
  const squareColorsRange = [
    {
      range: [0, 0],
      className: 'legendZero',
    },
    {
      range: [1, Math.floor(maxTransactionsCount / 4)],
      className: 'legendOne',
    },
    {
      range: [
        Math.ceil(maxTransactionsCount / 4),
        Math.floor(maxTransactionsCount / 2),
      ],
      className: 'legendTwo',
    },
    {
      range: [
        Math.ceil(maxTransactionsCount / 2),
        Math.floor(maxTransactionsCount / 1.33333),
      ],
      className: 'legendThree',
    },
    {
      range: [Math.ceil(maxTransactionsCount / 1.33333), maxTransactionsCount],
      className: 'legendFour',
    },
  ]

  return { squareColorsRange }
}
