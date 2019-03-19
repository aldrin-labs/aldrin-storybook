import { IExchange } from '@core/types/ChartTypes'
import { Theme } from '@material-ui/core'

export interface IProps {
  selectExchange: (exchange: IExchange) => void
  activeExchange: IExchange
  currencyPair: string
  theme: Theme
}
