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
  { label: 'Pair', id: 'pair' },
  // { label: 'Type', id: 'type' },
  { label: 'Side/Type', id: 'side' },
  { label: 'Price', id: 'price' },
  { label: 'Quantity', id: 'quantity' },
  // { label: 'Filled %', id: 'filled',  },
  { label: 'Amount', id: 'amount' },
  { label: 'Trigger', id: 'triggerConditions' },
  { label: 'Date', id: 'date' },
  {
    label:
      // <TableButton size="small" variant="outlined">
      //   Cancel all
      // </TableButton>
      '',
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
  filled: { render: '100%' },
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
  { label: 'Pair', id: 'pair' },
  // { label: 'Type', id: 'type' },
  { label: 'Side/Type', id: 'side' },
  // { label: 'Average', id: 'average',  },
  { label: 'Price', id: 'price' },
  // { label: 'Filled %', id: 'filled',  },
  { label: 'Quantity', id: 'quantity' },
  { label: 'Amount', id: 'amount' },
  { label: 'Trigger', id: 'triggerConditions' },
  { label: 'Status', id: 'status' },
  { label: 'Date', id: 'date' },
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
  filled: { render: '100%' },
  quantity: getRandomInt(100, 8000),
  total: 100,
  triggerConditions: '-',
  status: arrayOforderStatus[getRandomInt(0, 2)],
}))

export const tradeHistoryColumnNames = [
  { label: 'Pair', id: 'pair' },
  { label: 'Type', id: 'type' },
  { label: 'Price', id: 'price' },
  { label: 'Quantity', id: 'quantity' },
  { label: 'Amount', id: 'amount' },
  { label: 'Fee', id: 'fee' },
  { label: 'Status', id: 'status' },
  { label: 'Date', id: 'date' },
]

export const tradeHistoryBody = new Array(13).fill(undefined).map((el, i) => ({
  time: new Date().toDateString(),
  pair: `BTC_${String.fromCharCode(getRandomInt(65, 80)) +
    String.fromCharCode(getRandomInt(65, 80)) +
    String.fromCharCode(getRandomInt(65, 80))}`,
  type: arrayOfOrdersType[getRandomInt(0, 3)],
  price: getRandomInt(100, 3000),
  quantity: { render: '100%' },
  fee: getRandomInt(1, 100),
  status: 'succesful',
  total: 100,
}))

export const fundsColumnNames = [
  { label: 'Coin', id: 'coin' },
  { label: 'Total balance', id: 'totalBalance' },
  { label: 'Total quantity', id: 'totalQuantity' },
  { label: 'Available balance', id: 'availableBalance' },
  { label: 'Available quantity', id: 'availableQuantity' },
  { label: 'In order', id: 'inOrder' },
  { label: 'BTC Value', id: 'btcValue' },
]

export const fundsBody = new Array(13).fill(undefined).map((el, i) => ({
  coin: `${String.fromCharCode(getRandomInt(65, 80)) +
    String.fromCharCode(getRandomInt(65, 80)) +
    String.fromCharCode(getRandomInt(65, 80))}`,
  totalBalance: getRandomInt(100, 300000),
  totalQuantity: getRandomInt(100, 3000),
  availableBalance: getRandomInt(100, 3000),
  availableQuantity: getRandomInt(100, 3000),
  inOrder: getRandomInt(1, 100),
  btcValue: getRandomInt(1, 10000),
}))

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}
