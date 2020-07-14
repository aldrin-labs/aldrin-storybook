import { Theme } from '@material-ui/core'
import { Key, OrderType } from '@core/types/ChartTypes'
import { Position } from '../PositionsTable/PositionsTable.types'
import { SmartOrder } from '../ActiveTrades/ActiveTrades.types'

export interface IQueryProps {
  tab: string
  handleTabChange: (tab: string | any) => void
  marketType: 0 | 1
  arrayOfMarketIds: string[]
  currencyPair: string
  theme?: Theme
  selectedKey: Key
  variables?: any
  canceledOrders: string[]
  showAllPositionPairs?: boolean
  showAllOpenOrderPairs?: boolean
  showAllSmartTradePairs?: boolean
  showPositionsFromAllAccounts?: boolean
  showOpenOrdersFromAllAccounts?: boolean
  showSmartTradesFromAllAccounts?: boolean
  pageOpenOrders: number
  perPageOpenOrders: number
  pagePositions: number
  perPagePositions: number
  pageSmartTrades: number
  perPageSmartTrades: number
}

export interface INextQueryProps extends IQueryProps {
  subscribeToMore: () => () => void
}

export interface IProps extends INextQueryProps {
  getActivePositionsQuery: {
    getActivePositions: Position[]
  }
  getOpenOrderHistoryQuery: {
    getOpenOrderHistory: OrderType[]
  }
  getActiveStrategiesQuery: {
    getActiveStrategies: {
      strategies: SmartOrder[]
      count: number
    }
  }
}
