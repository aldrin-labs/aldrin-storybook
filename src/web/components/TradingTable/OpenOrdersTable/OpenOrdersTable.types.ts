import { ChangeEvent } from 'react'
import { Theme } from '@material-ui/core'
import { WithTheme } from '@material-ui/styles/withTheme'

import { OrderType, Key, CancelOrderMutationType } from '@core/types/ChartTypes'

export interface IProps extends WithTheme<Theme> {
  tab: string
  tabIndex: number
  show: boolean
  page: number
  perPage: number
  handleChangePage: (page: number) => void
  handleChangeRowsPerPage: (e: ChangeEvent) => void
  handleTabChange: (tab: string | any) => void
  getOpenOrderHistoryQueryRefetch: () => void
  cancelOrderMutation: CancelOrderMutationType
  getOpenOrderHistoryQuery: {
    getOpenOrderHistory: OrderType[]
    queryParamsWereChanged: boolean
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
  keys: Key[]
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
