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
  { label: 'Price', id: 'price' },
  { label: 'Amount', id: 'amount' },
  { label: 'Filled %', id: 'filled' },
  { label: 'Total', id: 'total' },
  { label: 'Trigger Conditions', id: 'triggerConditions' },
  { label: <button>Cancel all</button>, id: 'cancel' },
]

export const openOrdersBody = new Array(13).fill(undefined).map((el, i) => ({
  date: new Date().toDateString(),
  pair: `BTC_${String.fromCharCode(getRandomInt(65, 80)) +
    String.fromCharCode(getRandomInt(65, 80)) +
    String.fromCharCode(getRandomInt(65, 80))}`,
  type: arrayOfOrdersType[getRandomInt(0, 3)],
  side: arrayOfSides[getRandomInt(0, 2)],
  price: getRandomInt(100, 3000),
  amount: getRandomInt(100, 8000),
  filled: '100%',
  total: 100,
  triggerConditions: '-',
}))

export const orderHistoryColumnNames = [
  { label: 'Date', id: 'date' },
  { label: 'Pair', id: 'pair' },
  { label: 'Type', id: 'type' },
  { label: 'Side', id: 'side' },
  { label: 'Average', id: 'average' },
  { label: 'Price', id: 'price' },
  { label: 'Filled %', id: 'filled' },
  { label: 'Amount', id: 'amount' },
  { label: 'Total', id: 'total' },
  { label: 'Trigger Conditions', id: 'triggerConditions' },
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
  filled: '100%',
  amount: getRandomInt(100, 8000),
  total: 100,
  triggerConditions: '-',
  status: arrayOforderStatus[getRandomInt(0,2)],
}))

export const tradeHistoryColumnNames = [
  { label: 'Time', id: 'time' },
  { label: 'Pair', id: 'pair' },
  { label: 'Type', id: 'type' },
  { label: 'Price', id: 'price' },
  { label: 'Filled', id: 'filled' },
  { label: 'Fee', id: 'fee' },
  { label: 'Total', id: 'total' },
]

export const tradeHistoryBody = new Array(13).fill(undefined).map((el, i) => ({
  time: new Date().toDateString(),
  pair: `BTC_${String.fromCharCode(getRandomInt(65, 80)) +
  String.fromCharCode(getRandomInt(65, 80)) +
  String.fromCharCode(getRandomInt(65, 80))}`,
  type: arrayOfOrdersType[getRandomInt(0, 3)],
  price: getRandomInt(100, 3000),
  filled: '100%',
  fee: getRandomInt(1, 100),
  total: 100,
}))

export const fundsColumnNames = [
  { label: 'Coin', id: 'coin' },
  { label: 'Total balance', id: 'totalBalance' },
  { label: 'Available balance', id: 'availableBalance' },
  { label: 'In order', id: 'inOrder' },
  { label: 'BTC Value', id: 'btcValue' },
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
