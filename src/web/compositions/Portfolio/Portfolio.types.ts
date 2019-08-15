import { Theme } from '@material-ui/core'

export interface IProps {
  data: { getProfile: any; loading: boolean; error?: string }
  theme: Theme
  keys: string[]
  rebalanceKeys: string[]
  activeKeys: string[]
  wallets: string[]
  activeWallets: string[]
}

export interface IState {
  isSideNavOpen: boolean
  isUSDCurrently: boolean
  baseCoin: 'USDT' | 'BTC'
}
