import { Theme } from '@material-ui/core'
import { WithTheme } from '@material-ui/styles/withTheme'

import { OrderType, Key, CancelOrderMutationType } from '@core/types/ChartTypes'

export interface IProps extends WithTheme<Theme> {
  tab: string
  tabIndex: number
  show: boolean
  handleTabChange: (tab: string | any) => void
  getOpenOrderHistoryQueryRefetch: () => void
  cancelOrderMutation: CancelOrderMutationType
  getOpenOrderHistoryQuery: {
    getOpenOrderHistory: OrderType[]
  }
  subscribeToMore: () => () => void
  addOrderToCanceled: (id: string) => void
  clearCanceledOrders: () => void
  ordersHealthcheckMutation: (variables: any) => void
  showCancelResult: ({
    status,
    message,
  }: {
    status: string
    message: string
  }) => void
  theme: Theme
  selectedKey: Key
  arrayOfMarketIds: string[]
  marketType: number
  currencyPair: string
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
}

export interface IState {
  openOrdersProcessedData: any[]
  cachedOrder: OrderType | null
}
