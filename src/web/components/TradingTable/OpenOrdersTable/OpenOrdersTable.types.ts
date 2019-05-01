import { ChangeEvent } from 'react'
import { OrderType } from '@core/types/ChartTypes'
import { Theme } from '@material-ui/core'

export interface IProps {
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
  getOpenOrderHistory: {
    getOpenOrderHistory: OrderType[]
  }
  subscribeToMore: () => void
  showCancelResult: ({ status, message }: { status: string, message: string }) => void
  theme: Theme
}

