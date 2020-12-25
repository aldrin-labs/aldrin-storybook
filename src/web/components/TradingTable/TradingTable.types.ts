import { Key } from '@core/types/ChartTypes'

export interface IProps extends IPropsTradingTableWrapper {
  history: History
  getSelectedKeyQuery: { chart: { selectedKey: Key } }
  getAllUserKeysQuery: { myPortfolios: { keys: Key[] }[] }
}

export interface ReadOnly<IPropsTradingTableWrapper> {
  selectedKey: {}
  marketType: 0 | 1
  exchange: string
  currencyPair: string
  arrayOfMarketIds: string[]
  priceFromOrderbook: number
}

export interface IState {
  tab: string
  tabIndex: number
  canceledOrders: string[]
  showAllPositionPairs: boolean
  showAllOpenOrderPairs: boolean
  showAllSmartTradePairs: boolean
  showPositionsFromAllAccounts: boolean
  showOpenOrdersFromAllAccounts: boolean
  showSmartTradesFromAllAccounts: boolean
  pageOpenOrders: number
  perPageOpenOrders: number
  pagePositions: number
  perPagePositions: number
  pageSmartTrades: number
  perPageSmartTrades: number
}

export type IStateKeys = keyof IState;
