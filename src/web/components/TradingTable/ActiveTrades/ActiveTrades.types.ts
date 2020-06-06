import { ChangeEvent } from 'react'
import { Theme } from '@material-ui/core'
import { Key } from '@core/types/ChartTypes'

type SmartOrderConditions = {
  pair: string
  side: string
  marketType: number
  leverage: number
}

type SmartOrderState = {}

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
  quantityPrecision: number
  pricePrecision: number
  theme: Theme
  getActiveStrategiesQuery: {
    getActiveStrategies: {
      strategies: SmartOrder[]
      count: number
    }
  }
  getFundsQuery: {
    getFunds: Fund[]
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
  showCancelResult: ({
    status,
    message,
  }: {
    status: string
    message: string
  }) => void
  showOrderResult: (
    status: any,
    cancelOrder: (id: string) => void,
    marketType: number
  ) => void
  handleTabChange: (tab: string) => void
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
