import { Theme } from '@material-ui/core'

import { IOrder, IExchange } from '@core/types/ChartTypes'

export interface IProps {
  action: { hover: string }
  activeExchange: IExchange
  background: any
  index: number
  tableExpanded: boolean
  digitsAfterDecimalForAsksSize: number
  digitsAfterDecimalForAsksPrice: number
  data: IOrder[]
  theme: Theme
}
