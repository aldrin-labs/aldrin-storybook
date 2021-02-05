import { ChangeEvent } from 'react'
import { Theme } from '@material-ui/core'
import { Key } from '@core/types/ChartTypes'
import { EntryLevel as TerminalEntryLevel, ExitLevel as TerminalExitLevel } from '@sb/compositions/Chart/components/SmartOrderTerminal/types'

interface EntryLevel extends TerminalEntryLevel {
  entryDeviation: number
  activatePrice: number
}

interface ExitLevel extends TerminalExitLevel {
  entryDeviation: number
  activatePrice: number
}

type SmartOrderConditions = {
  pair: string
  side: string
  marketType: 0 | 1
  leverage: number
  templateStatus: string
  entryOrder: {
    side: string,
    orderType: string,
    amount: number,
    price: number,
    entryDeviation: number
    activatePrice: number
  },
  exitLevels: ExitLevel[],
  entryLevels: EntryLevel[],
  stopLoss: number,
  stopLossType: string,
  forcedLoss: number,
  trailingExit: number,
  timeoutIfProfitable: number,
  timeoutWhenLoss: number,
  timeoutLoss: number,
  timeoutWhenProfit: number,
  isTemplate: boolean,
  templatePnl: number,
  hedgeLossDeviation: number
}

type SmartOrderState = {
  entryPrice: number,
  exitPrice: number,
  state: string,
  msg: string,
  receivedProfitAmount: number,
  receivedProfitPercentage: number,
}

export type Price = {
  pair: string
  price: number
}

export type Fund = {
  free: number
  assetType: number
  quantity: number
  asset: {
    symbol: string
    priceUSD: number
  }
}

export type SmartOrder = {
  _id: string
  accountId: string
  enabled: boolean
  createdAt: number | string
  conditions: SmartOrderConditions
  state: SmartOrderState
}

export interface IProps {
  tab: string
  show: boolean
  marketType: 0 | 1
  keys: Key[]
  exchange: string
  page: number
  perPage: number
  handleChangePage: (page: number) => void
  handleChangeRowsPerPage: (e: ChangeEvent) => void
  currencyPair: string
  arrayOfMarketIds: string[]
  priceFromOrderbook: number
  theme: Theme
  getActiveStrategiesQuery: {
    getActiveStrategies: {
      strategies: SmartOrder[]
      count: number
    }
    subscribeToMoreFunction: () => () => void
    queryParamsWereChanged: boolean
  }
  getFundsQuery: {
    getFunds: Fund[]
    subscribeToMoreFunction: () => () => void
  }
  selectedKey: {
    keyId: string
  }
  canceledOrders: string[]
  allKeys: boolean
  specificPair: boolean
  showAllPositionPairs: boolean
  showAllOpenOrderPairs: boolean
  showAllSmartTradePairs: boolean
  showPositionsFromAllAccounts: boolean
  showOpenOrdersFromAllAccounts: boolean
  showSmartTradesFromAllAccounts: boolean

  addOrderToCanceled: (id: string) => void
  handleToggleAllKeys: (newValue: boolean) => void
  handleToggleSpecificPair: (newValue: boolean) => void
  handleTabChange: (tab: string) => void
  handlePairChange: (pair: string) => void
  enqueueSnackbar: (message: string, variant: { variant: string }) => void
  getActiveStrategiesQueryRefetch: () => void
  disableStrategyMutation: (
    variables: any
  ) => { data: { disableStrategy: SmartOrder } }
  subscribeToMore: () => () => void
  updateEntryPointStrategyMutation: (
    variables: any
  ) => { data: { updateEntryPoint: SmartOrder } }
  updateStopLossStrategyMutation: (
    variables: any
  ) => { data: { updateStopLossStrategy: SmartOrder } }
  updateTakeProfitStrategyMutation: (
    variables: any
  ) => { data: { updateTakeProfitStrategy: SmartOrder } }
}

export interface IState {
  prices: Price[]
  editTrade: string | null
  cachedOrder: any
  expandedRows: string[]
  activeStrategiesProcessedData: any[]
  selectedTrade: SmartOrder
}
