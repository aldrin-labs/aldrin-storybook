import { Theme } from '@material-ui/core'
import { IExchange } from '@core/types/ChartTypes'

export interface IProps {
  activeExchange: { exchange: IExchange; index: number }
  animated: boolean
  base: string
  quote: string
  theme: Theme
}
