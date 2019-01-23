import { Theme } from '@material-ui/core'
import { IOrder } from '@core/types/ChartTypes'

export interface IDepthChartProps {
  base: string
  quote: string
  animated: boolean
  asks: IOrder[]
  bids: IOrder[]
  xAxisTickTotal: number
  theme: Theme
  midMarketPrice: number
}

export interface IDepthChartState {
  MAX_DOMAIN_PLOT: number
  crosshairValuesForSpread: Array<any>
  crosshairValuesForOrder: Array<any>
  nearestOrderXIndex: number
  nearestSpreadXIndex: number
  transformedAsksData: Array<any>
  transformedBidsData: Array<any>
}
