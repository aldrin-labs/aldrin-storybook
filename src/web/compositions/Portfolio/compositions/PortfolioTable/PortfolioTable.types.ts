import { Theme } from '@material-ui/core'

export interface IState {
  isShownChart: boolean
  tab: 'main' | 'industry' | 'rebalance' | 'correlation' | 'optimization'
}

export interface IProps {
  isUSDCurrently: boolean
  key: number
  dustFilter: number
  showTable?: boolean
  baseCoin: 'USDT' | 'BTC'
  onToggleUSDBTC: () => void
  theme: Theme
  toggleWallets: () => void
}
