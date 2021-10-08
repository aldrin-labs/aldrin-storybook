import { Theme } from '@material-ui/core'
import { OrderbookSide, IExchange } from '@core/types/ChartTypes'
import { OrderbookMode } from '../../OrderBookTableContainer.types'

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
