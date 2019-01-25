import { IOrder } from '@core/types/ChartTypes'

export interface IProps {
  data: { marketOrders?: IOrder[] }
}
export interface IState {
  asks: IOrder[]
  bids: IOrder[]
}
