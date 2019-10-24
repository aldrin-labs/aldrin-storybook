import {
  IExchange,
  IGetCharts,
  IGetMyProfile,
  Key,
} from '@core/types/ChartTypes'
import { TooltipMutationType, TooltipQueryType } from '@core/types/TooltipTypes'
import { TooltipsType } from '@core/types/PortfolioTypes'

export interface GetChartDataQueryInterface extends IGetMyProfile, IGetCharts {
  app: {
    themeMode: string
  }
  getTooltipSettings: TooltipsType
  chart: {
    selectedKey: Key
    activeExchange: {
      name: string
      symbol: string
    }
    currencyPair: {
      pair: string
    }
    view: 'default' | 'onlyCharts'
  }
  multichart: {
    charts: string[]
  }
}

export interface IProps extends TooltipMutationType {
  isNoCharts: boolean
  view: string
  currencyPair: string
  showTableOnMobile: string
  selectCurrencies: Function
  theme: any
  themeMode: 'dark' | 'light'
  getChartDataQuery:  GetChartDataQueryInterface
  addChartMutation: (queryObject: any) => Promise<any>
  changeActiveExchangeMutation: ({
    variables: exchange,
  }: {
    variables: { exchange: IExchange }
  }) => Promise<any>
  changeViewModeMutation: ({
    variables: view,
  }: {
    variables: { view: 'default' | 'onlyCharts' }
  }) => Promise<any>
}

export interface IState {
  aggregation: number
  showTableOnMobile: string
  activeChart: string
  joyride: boolean
}
