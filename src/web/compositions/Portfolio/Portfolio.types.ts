import { Theme } from '@material-ui/core'

export type Key = {
  selected: boolean
  name: string
  _id: string
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
