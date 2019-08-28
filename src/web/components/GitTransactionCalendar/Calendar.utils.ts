import moment from 'moment'

const getSquareClassName = (
  count: number,
  maxTransactionsCount: number,
  squareColorsRange: { range: number[]; className: string }[]
) => {
  return count >= squareColorsRange[1].range[0] &&
    count <= squareColorsRange[1].range[1]
    ? squareColorsRange[1].className
    : count >= squareColorsRange[2].range[0] &&
      count <= squareColorsRange[2].range[1]
    ? squareColorsRange[2].className
    : count >= squareColorsRange[3].range[0] &&
      count <= squareColorsRange[3].range[1]
    ? squareColorsRange[3].className
    : squareColorsRange[4].className
}

export const getCalendarData = (
  portfolio = {
    portfolioActionsByDay: {
      actionsByDay: [],
    },
  },
  maxTransactionsCount: number,
  startDate: number
) => {
  const {
    portfolioActionsByDay: { actionsByDay = [] },
  } = portfolio
  const { squareColorsRange } = getSquareColorRange(maxTransactionsCount)

  const lastDayOfYear = moment(startDate).isLeapYear() ? 367 : 366
  const mappedActionsArray = Array(lastDayOfYear)
    .fill(undefined)
    .map((el, index) => {
      const action = actionsByDay.find(
        (actionEl: { _id: number; transactionsCount: number }) =>
          actionEl._id === index
      )

      if (action) {
        return {
          date: moment(+startDate)
            .dayOfYear(action._id)
            .startOf('day')
            .toDate(),
          count: action.transactionsCount,
          className: getSquareClassName(
            action.transactionsCount,
            maxTransactionsCount,
            squareColorsRange
          ),
        }
      }

      return {
        date: moment(+startDate)
          .dayOfYear(index)
          .startOf('day')
          .toDate(),
        count: 0,
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
  }
) => {
  const {
    portfolioActionsByDay: { actionsByDay = [] },
  } = portfolio

  const maxTransactionsCount = actionsByDay.reduce(
    (max, { transactionsCount }) =>
      transactionsCount > max ? transactionsCount : max,
    0
  )

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
