import { ChangeEvent } from 'react'
import { Theme } from '@material-ui/core'
import { WithTheme } from '@material-ui/styles/withTheme'

import { OrderType, Key } from '@core/types/ChartTypes'

export interface IProps extends WithTheme<Theme> {
  tab: string
  tabIndex: number
  show: boolean
  handleTabChange: (e: ChangeEvent<{}>, tabIndex: number | any) => void
  cancelOrderMutation: (
    mutationObject: {
      variables: {
        cancelOrderInput: {
          keyId: string
          orderId: string
          pair: string
        }
      }
    }
  ) => Promise<any>
  getOpenOrderHistoryQuery: {
    getOpenOrderHistory: OrderType[]
  }
  subscribeToMore: () => void
  showCancelResult: ({ status, message }: { status: string, message: string }) => void
  theme: Theme
  selectedKey: Key
}


export interface IState {
  openOrdersProcessedData: any[]
}
