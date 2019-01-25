import { Theme } from '@material-ui/core'

import { IOrder, IExchange } from '@core/types/ChartTypes'

export interface IProps {
  onButtonClick: () => void
  digitsAfterDecimalForAsksSize: number
  digitsAfterDecimalForAsksPrice: number
  quote: string
  data: IOrder[]
  theme: Theme
  tableExpanded: boolean
  activeExchange: { exchange: IExchange; index: number }
  currencyPair: string
}
