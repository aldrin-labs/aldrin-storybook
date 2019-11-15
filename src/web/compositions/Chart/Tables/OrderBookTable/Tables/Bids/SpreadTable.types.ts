import { Theme } from '@material-ui/core'
import { IExchange } from '@core/types/ChartTypes'

export interface IProps {
  activeExchange: IExchange
  currencyPair: string
  aggregation: number
  spread: number
  theme: Theme
  quote: string
  data: any
  digits: number
  digitsAfterDecimalForSpread: number
  digitsAfterDecimalForBidsSize: number
  digitsAfterDecimalForBidsPrice: number
}
