import { TableButton } from './TradingTable.styles'

const arrayOfSides = ['sell', 'buy']

const arrayOfOrdersType = ['market', 'limit', 'stop']

const arrayOforderStatus = ['finished', 'canceled']

export const tradingTableTabConfig = [
  'openOrders',
  'orderHistory',
  'tradeHistory',
  'funds',
]

export const openOrdersColumnNames = [
  { label: 'Date', id: 'date' },
  { label: 'Pair', id: 'pair' },
  { label: 'Type', id: 'type' },
  { label: 'Side', id: 'side' },
  { label: 'Price', id: 'price', isNumber: true },
  { label: 'Amount', id: 'amount', isNumber: true },
  { label: 'Filled %', id: 'filled', isNumber: true },
  { label: 'Total', id: 'total', isNumber: true },
  { label: 'Trigger', id: 'triggerConditions', isNumber: true },
  {
    label: (
      <TableButton size="small" variant="outlined">
        Cancel all
      </TableButton>
    ),
    id: 'cancel',
    isSortable: false,
  },
]

export const openOrdersBody = new Array(13).fill(undefined).map((el, i) => ({
  id: i,
  date: new Date().toDateString(),
  pair: `BTC_${String.fromCharCode(getRandomInt(65, 80)) +
    String.fromCharCode(getRandomInt(65, 80)) +
    String.fromCharCode(getRandomInt(65, 80))}`,
  type: arrayOfOrdersType[getRandomInt(0, 3)],
  side: arrayOfSides[getRandomInt(0, 2)],
  price: getRandomInt(100, 3000),
  amount: getRandomInt(100, 8000),
  filled: { render: '100%', isNumber: true },
  total: 100,
  triggerConditions: '-',
  cancel: {
    render: (
      <TableButton key={i} variant="outlined" size={`small`}>
        Cancel
      </TableButton>
    ),
  },
}))

export const orderHistoryColumnNames = [
  { label: 'Date', id: 'date' },
  { label: 'Pair', id: 'pair' },
  { label: 'Type', id: 'type' },
  { label: 'Side', id: 'side' },
  { label: 'Average', id: 'average', isNumber: true },
  { label: 'Price', id: 'price', isNumber: true },
  { label: 'Filled %', id: 'filled', isNumber: true },
  { label: 'Amount', id: 'amount', isNumber: true },
  { label: 'Total', id: 'total', isNumber: true },
  { label: 'Trigger', id: 'triggerConditions', isNumber: true },
  { label: 'Status', id: 'status' },
]

export const orderHistoryBody = new Array(13).fill(undefined).map((el, i) => ({
  date: new Date().toDateString(),
  pair: `BTC_${String.fromCharCode(getRandomInt(65, 80)) +
    String.fromCharCode(getRandomInt(65, 80)) +
    String.fromCharCode(getRandomInt(65, 80))}`,
  type: arrayOfOrdersType[getRandomInt(0, 3)],
  side: arrayOfSides[getRandomInt(0, 2)],
  average: getRandomInt(100, 50000),
  price: getRandomInt(100, 3000),
  filled: { render: '100%', isNumber: true },
  amount: getRandomInt(100, 8000),
  total: 100,
  triggerConditions: '-',
  status: arrayOforderStatus[getRandomInt(0, 2)],
}))

export const tradeHistoryColumnNames = [
  { label: 'Time', id: 'time' },
  { label: 'Pair', id: 'pair' },
  { label: 'Type', id: 'type' },
  { label: 'Price', id: 'price', isNumber: true },
  { label: 'Filled', id: 'filled', isNumber: true },
  { label: 'Fee', id: 'fee', isNumber: true },
  { label: 'Total', id: 'total', isNumber: true },
]

export const tradeHistoryBody = new Array(13).fill(undefined).map((el, i) => ({
  time: new Date().toDateString(),
  pair: `BTC_${String.fromCharCode(getRandomInt(65, 80)) +
    String.fromCharCode(getRandomInt(65, 80)) +
    String.fromCharCode(getRandomInt(65, 80))}`,
  type: arrayOfOrdersType[getRandomInt(0, 3)],
  price: getRandomInt(100, 3000),
  filled: { render: '100%', isNumber: true },
  fee: getRandomInt(1, 100),
  total: 100,
}))

export const fundsColumnNames = [
  { label: 'Coin', id: 'coin' },
  { label: 'Total balance', id: 'totalBalance', isNumber: true },
  { label: 'Available balance', id: 'availableBalance', isNumber: true },
  { label: 'In order', id: 'inOrder', isNumber: true },
  { label: 'BTC Value', id: 'btcValue', isNumber: true },
]

export const fundsBody = new Array(13).fill(undefined).map((el, i) => ({
  coin: `${String.fromCharCode(getRandomInt(65, 80)) +
    String.fromCharCode(getRandomInt(65, 80)) +
    String.fromCharCode(getRandomInt(65, 80))}`,
  totalBalance: getRandomInt(100, 300000),
  availableBalance: getRandomInt(100, 3000),
  inOrder: getRandomInt(1, 100),
  btcValue: getRandomInt(1, 10000),
}))

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}
