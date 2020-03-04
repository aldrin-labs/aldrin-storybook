import { Theme } from '@material-ui/core'

export type Position = {
  _id: string
  positionAmt: number
  symbol: string
  leverage: number
}

export interface IProps {
  tab: string
  show: boolean
  marketType: 0 | 1
  exchange: string
  currencyPair: string
  arrayOfMarketIds: string[]
  priceFromOrderbook: number
  quantityPrecision: number
  pricePrecision: number
  theme: Theme
  getActivePositionsQuery: {
    getActivePositions: Position[]
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
  handleToggleAllKeys: (newValue: boolean) => void
  handleToggleSpecificPair: (newValue: boolean) => void
  clearCanceledOrders: () => void
  cancelOrderMutation: (variables: any) => void
  cancelOrder: (id: string) => void
  updatePositionMutation: (variables: any) => Promise<void>
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
  getActivePositionsQueryRefetch: () => void
  subscribeToMore: () => () => void
}

export interface IState {
  positionsData: any[]
  prices: { pair: string; price: number }[]
  positionsRefetchInProcess: boolean
}
