import { ChangeEvent } from 'react'
import { Theme } from '@material-ui/core'
import { WithTheme } from '@material-ui/styles/withTheme'

import { OrderType, Key, CancelOrderMutationType } from '@core/types/ChartTypes'

export interface IProps extends WithTheme<Theme> {
  tab: string
  tabIndex: number
  show: boolean
  handleTabChange: (tab: string | any) => void
  cancelOrderMutation: CancelOrderMutationType
  getOpenOrderHistoryQuery: {
    getOpenOrderHistory: OrderType[]
  }
  subscribeToMore: () => () => void
  showCancelResult: ({
    status,
    message,
  }: {
    status: string
    message: string
  }) => void
  theme: Theme
  selectedKey: Key
}

export interface IState {
  openOrdersProcessedData: any[]
}
