import { IOrder, IExchange } from '@core/types/ChartTypes'

export interface IProps {
  subscribeToMore: Function
  activeExchange: IExchange
  currencyPair: string
  digitsAfterDecimalForAsksPrice: number
  digitsAfterDecimalForAsksSize: number
  digitsAfterDecimalForBidsPrice: number
  digitsAfterDecimalForBidsSize: number
  data: { marketOrders: any[] }
}

export interface IState {
  asks: IOrder[]
  bids: IOrder[]
  spread: number
  digitsAfterDecimalForAsksPrice: number
  digitsAfterDecimalForAsksSize: number
  i: number,
}
