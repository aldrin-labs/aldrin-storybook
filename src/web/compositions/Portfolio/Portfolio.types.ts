import { Theme } from '@material-ui/core'

export type Key = {
  _id: string
  name: string
  selected: boolean
  isBroker: boolean
  isFuturesWars: boolean
}
export interface IProps {
  data: { myPortfolios: any[]; loading: boolean; error?: string }
  theme: Theme
  baseData: {
    portfolio: {
      baseCoin: 'USDT' | 'BTC'
    }
  }
}

export interface IState {
  isSideNavOpen: boolean
}
