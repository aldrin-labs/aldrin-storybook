import { IExchange } from '@core/types/ChartTypes'

export interface IProps {
  data: {marketTickers: []}
  subscribeToMore: Function
  activeExchange: IExchange
  currencyPair: string
}

export interface IState {
  data: []
  numbersAfterDecimalForPrice: number
}
