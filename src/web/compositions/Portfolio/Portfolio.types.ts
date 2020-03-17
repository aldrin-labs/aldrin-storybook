import { Theme } from '@material-ui/core'

import { TooltipQueryType } from '@core/types/TooltipTypes'

export type Key = {
  _id: string
  name: string
  selected: boolean
  isBroker: boolean
  isFuturesWars: boolean
}
export interface IProps extends TooltipQueryType {
  data: { myPortfolios: any[]; loading: boolean; error?: string }
  theme: Theme
  baseData: {
    portfolio: {
      baseCoin: 'USDT' | 'BTC'
    }
  }
  dustFilterQuery: {
    portfolio: {
      dustFilter: {
        usd: number
        percentage: number
        btc: number
      }
    }
  }
}

export interface IState {
  isSideNavOpen: boolean
}
