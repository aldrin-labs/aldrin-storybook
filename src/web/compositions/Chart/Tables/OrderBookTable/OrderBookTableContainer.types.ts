import { IOrder, IExchange } from '@core/types/ChartTypes'

export interface IProps {
  subscribeToMore: Function
  activeExchange: IExchange
  currencyPair: string
  digitsAfterDecimalForAsksPrice: number
  digitsAfterDecimalForAsksSize: number
  digitsAfterDecimalForBidsPrice: number
  digitsAfterDecimalForBidsSize: number
  data: { marketOrders: { bids: string, asks: string } }
  marketOrder: string
}

export interface IState {
  asks: IOrder[]
  bids: IOrder[]
  spread: number | null
  lastQueryData: string | null
  digits: number
  digitsAfterDecimalForAsksPrice: number
  digitsAfterDecimalForAsksSize: number
  i: number,
}
