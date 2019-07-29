import {
  IExchange,
  IGetCharts,
  IGetMyProfile,
  Key,
} from '@core/types/ChartTypes'
import { TooltipMutationType, TooltipQueryType } from '@core/types/TooltipTypes'

export interface IProps extends TooltipQueryType, TooltipMutationType {
  isNoCharts: boolean
  view: string
  currencyPair: string
  showTableOnMobile: string
  selectCurrencies: Function
  theme: any
  themeMode: 'dark' | 'light'
  getMyProfile: IGetMyProfile
  getCharts: IGetCharts
  addChartMutation: (queryObject: any) => Promise<any>
  getSelectedKeyQuery: {
    chart: {
      selectedKey: Key
    }
  }
  changeActiveExchangeMutation: ({
    variables: exchange,
  }: {
    variables: { exchange: IExchange }
  }) => Promise<any>
}

export interface IState {
  view: string
  orders: []
  aggregation: number
  showTableOnMobile: string
  activeChart: string
  exchanges: []
  tradeHistory: []
  joyride: boolean
}
