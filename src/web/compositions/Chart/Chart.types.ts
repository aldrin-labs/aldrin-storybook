import { IExchange, IGetCharts, IGetMyProfile } from '@core/types/ChartTypes'
import { ITooltipType } from '@core/types/UserTypes'

export interface IProps {
  isNoCharts: boolean
  activeExchange: IExchange
  view: string
  currencyPair: string
  isShownMocks: boolean
  showTableOnMobile: string
  selectExchange: Function
  toggleView: Function
  selectCurrencies: Function
  setOrders: Function
  addChart: (currencyPair: string) => void
  theme: any
  themeMode: 'dark' | 'light'
  getMyProfile: IGetMyProfile
  getCharts: IGetCharts
  addChartMutation: (queryObject: any) => Promise<any>
  hideToolTip: (tab: string) => any
  demoMode: ITooltipType
}

export interface IState {
  view: string
  orders: []
  // exchangeTableCollapsed: boolean
  aggregation: number
  showTableOnMobile: string
  activeChart: string
  exchanges: []
  tradeHistory: []
  joyride: boolean
}
