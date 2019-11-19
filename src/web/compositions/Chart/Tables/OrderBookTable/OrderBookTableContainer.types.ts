import { IOrder, IExchange } from '@core/types/ChartTypes'

export interface IProps {
  subscribeToMore: Function
  activeExchange: IExchange
  currencyPair: string
  digitsAfterDecimalForAsksPrice: number
  digitsAfterDecimalForAsksSize: number
  digitsAfterDecimalForBidsPrice: number
  digitsAfterDecimalForBidsSize: number
  data: { marketOrders: { bids: string; asks: string } }
  lastTradeData: { marketTickers: [string] }
}

export type OrderbookMode = 'both' | 'bids' | 'asks'

export type OrderbookGroup = 0.01 | 0.1 | 1 | 10 | 50 | 100

export interface IState {
  asks: IOrder[]
  bids: IOrder[]
  lastQueryData: string | null
  group: number
  mode: OrderbookMode
  i: number
}

export const OrderbookGroupOptions = [
  { value: 0.01, label: 0.01 },
  { value: 0.1, label: 0.1 },
  { value: 1, label: 1 },
  { value: 10, label: 10 },
  { value: 50, label: 50 },
  { value: 100, label: 100 },
]
