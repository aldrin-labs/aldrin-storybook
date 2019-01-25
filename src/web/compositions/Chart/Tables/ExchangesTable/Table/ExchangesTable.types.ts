import { IActiveExchange, IExchange } from '@core/types/ChartTypes'

export interface IProps {
  onButtonClick: Function
  changeExchange: Function
  activeExchange: IActiveExchange
  exchanges: IExchange[]
  theme: any
}
