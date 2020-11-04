import React from 'react'
import { TableButton } from './TradingTable.styles'
import SvgIcon from '@sb/components/SvgIcon'
import TooltipCustom from '@sb/components/TooltipCustom/TooltipCustom'
import Help from '@material-ui/icons/Help'
import Reimport from '@icons/reimport.svg'
import { Loading } from '@sb/components/index'
import { TooltipContainer, Tooltip } from '@sb/components/TooltipCustom/Tooltip'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'

const arrayOfSides = ['sell', 'buy']
const arrayOfOrdersType = ['market', 'limit', 'stop']
const arrayOforderStatus = ['finished', 'canceled']

export const tradingTableTabConfig = [
  'openOrders',
  'orderHistory',
  'tradeHistory',
  'funds',
  'positions',
]

export const positionsColumnNames = (
  refetch,
  updatePositionsHandler,
  positionsRefetchInProcess
) => [
  { label: '#', id: 'index' },
  { label: 'Pair/Side', id: 'pair' },
  // { label: 'Type', id: 'type' },
  { label: 'Size', id: 'size', style: { textAlign: 'right' } },
  { label: 'Margin', id: 'margin' },
  // { label: 'M. Ratio', id: 'marginRation' },
  { label: 'Leverage', id: 'leverage' },
  { label: 'Entry Price', id: 'entryPrice' },
  { label: 'Mark Price', id: 'marketPrice' },
  {
    label: (
      <DarkTooltip
        maxWidth={'30rem'}
        title={`This indicator shows your position in the auto-deleverage queue. If all lights are lit, in the event of a liquidation, your position may be reduced.`}
      >
        <span>adl</span>
      </DarkTooltip>
    ),
    id: 'adl',
  },
  { label: 'Liq. Price', id: 'liqPrice' },
  { label: 'Pnl/Roe', id: 'pnlRoe' },
  {
    label: (
      <DarkTooltip title={`Update positions`}>
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          {positionsRefetchInProcess ? (
            <Loading size={16} style={{ height: '16px' }} />
          ) : (
            <SvgIcon
              alt="Update positions"
              src={Reimport}
              width="26px"
              height="17px"
              onClick={async () => {
                refetch()
                updatePositionsHandler()
              }}
            />
          )}
        </div>
      </DarkTooltip>
    ),
    id: 'refetch',
    isSortable: false,
  },
]

export const activeTradesColumnNames = [
  { label: ' ', id: 'blank' },
  { label: 'pair', id: 'pair' },
  { label: 'Side', id: 'side' },
  { label: 'Entry Price', id: 'entryPrice' },
  { label: 'Size', id: 'quantity' },
  {
    label: (
      <DarkTooltip title={`Take profit`}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          T-P
          <Help
            style={{
              height: '1.5rem',
              width: '1.5rem',
              color: 'rgb(0, 93, 217)',
              marginLeft: '.5rem',
            }}
          />
        </div>
      </DarkTooltip>
    ),
    id: 'takeProfit',
  },
  { label: 'Stop', id: 'stopLoss' },
  { label: 'Pnl/Roe', id: 'profit' },
  {
    label: (
      <DarkTooltip
        title={
          <div>
            <p>Preparing (while placing orders/waiting for act price)</p>
            <p>Trailing entry (When trailing activated)</p>
            <p>In loss (pnl less than 0)</p>
            <p>In Profit (profit greater than 0)</p>
            <p>Error (error has occured)</p>
          </div>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          status
          <Help
            style={{
              height: '1.5rem',
              width: '1.5rem',
              color: 'rgb(0, 93, 217)',
              marginLeft: '.5rem',
            }}
          />
        </div>
      </DarkTooltip>
    ),
    id: 'status',
  },
  { label: 'close', id: 'close', isSortable: false },
  // { label: 'Entry point', id: 'entryOrder' },
  // { label: 'Take a profit', id: 'takeProfit' },
  // { label: 'Stop loss', id: 'stopLoss' },
  // { label: 'status', id: 'status' },
  // { label: 'close', id: 'close' },
]

export const strategiesHistoryColumnNames = [
  { label: ' ', id: 'blank' },
  { label: 'pair', id: 'pair' },
  { label: 'Side', id: 'side' },
  { label: 'Entry Price', id: 'entryPrice' },
  { label: 'Size', id: 'quantity' },
  {
    label: (
      <DarkTooltip title={`Take profit`}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          T-P
          <Help
            style={{
              height: '1.5rem',
              width: '1.5rem',
              color: 'rgb(0, 93, 217)',
              marginLeft: '.5rem',
            }}
          />
        </div>
      </DarkTooltip>
    ),
    id: 'takeProfit',
  },
  { label: 'Stop', id: 'stopLoss' },
  { label: 'Pnl/Roe', id: 'profit' },
  { label: 'status', id: 'status' },
  { label: 'date', isNumber: true, id: 'date' },
]

export const positionsBody = new Array(13).fill(undefined).map((el, i) => ({
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

export const openOrdersColumnNames = (marketType: number) =>
  [
    { label: 'Pair', id: 'pair' },
    // { label: 'Type', id: 'type' },
    { label: 'Side/Type', id: 'side' },
    { label: 'Price', id: 'price' },
    { label: marketType === 0 ? 'Quantity' : 'size', id: 'quantity' },
    // { label: 'Filled %', id: 'filled',  },
    marketType === 0 ? { label: 'Amount', id: 'amount' } : {},
    { label: 'Trigger', id: 'triggerConditions' },
    marketType === 1 ? { label: 'Reduce Only', id: 'reduceOnly' } : {},
    { label: 'date', isNumber: true, id: 'date' },
    {
      label:
        // <TableButton size="small" variant="outlined">
        //   Cancel all
        // </TableButton>
        ' ',
      id: 'cancel',
      isSortable: false,
    },
  ].filter((x) => x.label)

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

export const orderHistoryColumnNames = (marketType: number) =>
  [
    { label: 'Pair', id: 'pair' },
    // { label: 'Type', id: 'type' },
    { label: 'Side/Type', id: 'side' },
    // { label: 'Average', id: 'average',  },
    { label: 'Price', id: 'price' },
    // { label: 'Filled %', id: 'filled',  },
    { label: marketType === 0 ? 'Quantity' : 'size', id: 'quantity' },
    marketType === 0 ? { label: 'Amount', id: 'amount' } : {},
    { label: 'Trigger', id: 'triggerConditions' },
    marketType === 1 ? { label: 'Reduce Only', id: 'reduceOnly' } : {},
    { label: 'Status', id: 'status' },
    { label: 'date', isNumber: true, id: 'date' },
  ].filter((x) => x.label)

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

export const tradeHistoryColumnNames = (marketType: number) =>
  [
    { label: 'Pair', id: 'pair' },
    { label: 'Type', id: 'type' },
    { label: 'Price', id: 'price' },
    { label: marketType === 0 ? 'Quantity' : 'size', id: 'quantity' },
    marketType === 0 ? { label: 'Amount', id: 'amount' } : {},
    marketType === 1 ? { label: 'P&L', id: 'realizedPnl' } : {},
    { label: 'Fee', id: 'fee' },
    { label: 'Status', id: 'status' },
    { label: 'date', isNumber: true, id: 'date' },
  ].filter((x) => x.label)

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
