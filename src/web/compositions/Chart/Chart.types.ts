import { IActiveExchange } from '@core/types/ChartTypes'

export interface IProps {
  isNoCharts: boolean
  activeExchange: IActiveExchange
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
}

export interface IState {
  view: string
  orders: []
  exchangeTableCollapsed: boolean
  aggregation: number
  showTableOnMobile: string
  activeChart: string
  exchanges: []
  tradeHistory: []
}
