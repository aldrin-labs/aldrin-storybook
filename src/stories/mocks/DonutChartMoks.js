export const chartData = [
  {
    label: "Payments",
    realValue: 25.1,
  },
  {
    label: "Entertainment",
    realValue: 10,
  },
  {
    label: "Blockchain platform",
    realValue: 14,
  },
  {
    label: "Privacy coin",
    realValue: 17,
  },
  {
    label: "Some other things",
    realValue: 30,
  },
]

export const someZeroTestData = [
  {
    label: "Payments",
    realValue: 25.1,
  },
  {
    label: "Entertainment",
    realValue: 0,
  },
  {
    label: "Blockchain platform",
    realValue: 14,
  },
  {
    label: "Privacy coin",
    realValue: 0,
  },
  {
    label: "Some other things",
    realValue: 0,
  },
]

export const allZeroTestData = [
  {
    label: "Payments",
    realValue: 0,
  },
  {
    label: "Entertainment",
    realValue: 0,
  },
]

export const longMocksGenirator = (len) => 
  _.range(len).map(value => (
      {
        label: `Test value ${value}`,
        realValue: 1
      }
    )
  )
