import {
  IExchange,
  IGetCharts,
  IGetMyProfile,
  Key,
} from '@core/types/ChartTypes'
import { ITooltipType } from '@core/types/UserTypes'
import { TooltipsType } from '@core/types/PortfolioTypes'

export interface IProps {
  isNoCharts: boolean
  activeExchange: IExchange
  view: string
  currencyPair: string
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
  getSelectedKeyQuery: {
    chart: {
      selectedKey: Key
    }
  }
  updateTooltipSettingsMutation: ({
    variables: { settings },
  }: {
    variables: { settings: TooltipsType }
  }) => Promise<any>
  getTooltipSettingsQuery: {
    getTooltipSettings: TooltipsType
  }
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
