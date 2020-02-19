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
}

export interface IState {
  openOrdersProcessedData: any[]
}
