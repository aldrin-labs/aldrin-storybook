import { Theme } from '@material-ui/core'
import { Key } from '../../Portfolio.types'

export interface IState {}

export interface IProps {
  isUSDCurrently: boolean
  key: number
  dustFilter: {
    usd: number
    btc: number
    percentage: number | string
  }
  showTable?: boolean
  baseCoin: 'USDT' | 'BTC'
  theme: Theme
  toggleWallets: () => void
  portfolioId: string
  portfolioName: string
  activeKeys: any
  isSideNavOpen: boolean
  keys: Key[]
  data: any
}
