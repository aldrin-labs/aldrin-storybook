import { Theme } from '@material-ui/core'
import { OrderbookMode } from '../../OrderBookTableContainer.types'
import { OrderbookSide, IExchange } from '@core/types/ChartTypes'

export interface IProps {
  onButtonClick: () => void
  digitsAfterDecimalForAsksSize: number
  digitsAfterDecimalForAsksPrice: number
  quote: string
  data: OrderbookSide
  mode: OrderbookMode
  theme: Theme
  tableExpanded: boolean
  activeExchange: IExchange
  currencyPair: string
  group: number
}
