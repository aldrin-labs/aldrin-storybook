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
  positionsRefetchInProcess,
  isDefaultOnlyTables
) => [
  { label: '#', id: 'index' },
  { label: 'Pair/Side', id: 'pair' },
  // { label: 'Type', id: 'type' },
  { label: 'Size', id: 'size', style: { textAlign: 'right' } },
  { label: 'Margin', id: 'margin' },
  // { label: 'M. Ratio', id: 'marginRation' },
  { label: 'Leverage', id: 'leverage' },
  { label: 'Entry Price', id: 'entryPrice' },
  { label: 'Last Price', id: 'lastPrice' },
  {
    label: (
      <DarkTooltip
        maxWidth={'30rem'}
        title={`This indicator shows your position in the auto-deleverage queue. If all lights are lit, in the event of a liquidation, your position may be reduced.`}
      >
        <span style={{ textDecoration: 'underline' }}>ADL</span>
      </DarkTooltip>
    ),
    id: 'adl',
  },
  { label: 'Liq. Price', id: 'liqPrice' },
  { label: 'PNL/ROE', id: 'pnlRoe', colspan: 2 },
  // { label: ' ', id: 'pnlRoe' },
  ...(isDefaultOnlyTables
    ? [{ label: 'Action', id: 'action', style: { textAlign: 'right' } }]
    : []),
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
    style: { paddingRight: '1.2rem' },
  },
]

export const activeTradesColumnNames = [
  { label: ' ', id: 'blank' },
  { label: 'Position', id: 'pair' },
  { label: 'Entry price', id: 'entryPrice' },
  { label: 'Lvg.', id: 'leverage' },
  { label: 'Margin/Size', id: 'quantity' },
  { label: 'Averaging', id: 'averaging' },
  { label: 'Stop loss', id: 'stopLoss' },
  {
    label: (
      <div style={{ display: 'flex', alignItems: 'center' }}>Take profit</div>
    ),
    id: 'takeProfit',
  },
  { label: 'P&L/ROE', id: 'profit' },
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'underline',
          }}
        >
          status
        </div>
      </DarkTooltip>
    ),
    id: 'status',
  },
  { label: 'Action', id: 'close', isSortable: false },
]

export const strategiesHistoryColumnNames = [
  { label: ' ', id: 'blank' },
  { label: 'Position', id: 'pair' },
  { label: 'Entry price', id: 'entryPrice' },
  { label: 'Lvg.', id: 'leverage' },
  { label: 'Margin/Size', id: 'quantity' },
  { label: 'Averaging', id: 'averaging' },
  { label: 'Stop loss', id: 'stopLoss' },
  {
    label: (
      <div style={{ display: 'flex', alignItems: 'center' }}>Take profit</div>
    ),
    id: 'takeProfit',
  },
  { label: 'P&L/ROE', id: 'profit' },
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'underline',
          }}
        >
          status
        </div>
      </DarkTooltip>
    ),
    id: 'status',
  },
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

export const openOrdersColumnNames = (
  marketType: number,
  onCancelAllOrders: () => void,
  filteredOpenOrders,
  theme
) =>
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
    { label: ' ', id: 'cancelSpace' },

    ...(filteredOpenOrders.length !== 0
      ? [
          {
            label: (
              <TableButton
                size="small"
                theme={theme}
                onClick={() => {
                  onCancelAllOrders()
                }}
                style={{
                  color: '#fff',
                  backgroundColor: theme.palette.red.main,
                  border: 'none',
                  // margin: '.5rem auto .5rem 10rem',
                  borderRadius: '0.5rem',
                  height: '2.7rem',
                  width: '9rem',
                  fontFamily: 'Avenir Next Demi',
                }}
                variant="outlined"
              >
                Cancel all
              </TableButton>
            ),
            id: 'cancel',
            isSortable: false,
          },
        ]
      : []),
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
