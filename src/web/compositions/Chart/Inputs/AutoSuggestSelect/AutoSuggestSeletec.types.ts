import { History } from 'history'
import { Theme } from '@material-ui/core'
import {
  IExchange,
  IGetCharts,
  IGetMarketsByExchangeQuery,
} from '@core/types/ChartTypes'

export interface IProps {
  history: History
  id: string
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
  getViewModeQuery: {
    chart: {
      view: 'default' | 'onlyCharts'
    }
  }
  changeCurrencyPairMutation: (variableObj: {
    variables: {
      pairInput: {
        pair: string
      }
    }
  }) => Promise<void>
  selectStyles: React.CSSProperties
  updateFavoritePairsMutation: (variableObj: {
    variables: {
      input: {
        favoritePairs: string[]
      }
    }
  }) => Promise<any>
}

export interface IState {
  isClosed: boolean
  isMenuOpen: boolean
}
