import { Theme } from '@material-ui/core'
import { IExchange, IGetCharts, IGetMarketsByExchangeQuery } from '@core/types/ChartTypes'

export interface IProps {
  theme: Theme
  activeExchange: IExchange
  selectCurrencies: (baseQuote: string) => void
  addChartMutation: (mutationObject: any) => Promise<any>
  getCharts: IGetCharts
  data: IGetMarketsByExchangeQuery
  view: 'default' | 'onlyCharts'
  value: string
  children?: any
  marketType: Number
}

export interface IState {
  isClosed: boolean
}
