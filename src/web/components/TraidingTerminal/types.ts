import { Theme } from '@material-ui/core'
export interface IProps {
  byType: 'buy' | 'sell'
  priceType: 'limit' | 'market' | 'stop-limit'
  pair: [string, string]
  amount: number
  marketPrice: number
  theme: Theme
}

