import { ChangeEvent } from 'react'
import { OrderType } from '@core/types/ChartTypes'

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
        }
      }
    }
  ) => Promise<any>
  getOpenOrderHistory: {
    getOpenOrderHistory: OrderType[]
  }
  subscribeToMore: () => void
}

