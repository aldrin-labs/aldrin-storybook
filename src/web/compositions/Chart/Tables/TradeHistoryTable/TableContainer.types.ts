import { IActiveExchange } from '@core/types/ChartTypes'

export interface IProps {
  data: {marketTickers: []}
  subscribeToMore: Function
  activeExchange: IActiveExchange
  currencyPair: string
}

export interface IState {
  data: []
  numbersAfterDecimalForPrice: number
}
