import {
  IExchange,
  IGetCharts,
  IGetMyProfile,
  Key,
} from '@core/types/ChartTypes'
import { TooltipsType } from '@core/types/PortfolioTypes'
import { TooltipMutationType } from '@core/types/TooltipTypes'

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
    marketType: 0 | 1
  }
  multichart: {
    charts: string[]
  }
}

export interface IProps extends TooltipMutationType {
  marketType: 0 | 1
  selectedPair: string
  isNoCharts: boolean
  view: string
  currencyPair: string
  showTableOnMobile: string
  selectCurrencies: Function
  theme: any
  themeMode: 'dark' | 'light'
  getChartDataQuery: GetChartDataQueryInterface
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
  showTableOnMobile: string
  activeChart: string
  joyride: boolean
  terminalViewMode: string
}
