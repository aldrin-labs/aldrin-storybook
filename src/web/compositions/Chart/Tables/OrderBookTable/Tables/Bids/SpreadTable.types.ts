import { Theme } from '@material-ui/core'
import { OrderbookMode } from '../../OrderBookTableContainer.types'
import { IExchange, OrderbookSide } from '@core/types/ChartTypes'

export interface IProps {
  activeExchange: IExchange
  currencyPair: string
  aggregation: number
  spread: number
  theme: Theme
  quote: string
  data: OrderbookSide
  mode: OrderbookMode
  group: number
  digitsAfterDecimalForSpread: number
  digitsAfterDecimalForBidsSize: number
  digitsAfterDecimalForBidsPrice: number
}
