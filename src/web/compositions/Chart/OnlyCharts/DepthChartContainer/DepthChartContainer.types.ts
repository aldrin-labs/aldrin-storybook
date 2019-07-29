import { Theme } from '@material-ui/core'
import { IExchange } from '@core/types/ChartTypes'

export interface IProps {
  activeExchange: IExchange
  animated: boolean
  base: string
  quote: string
  theme: Theme
}
