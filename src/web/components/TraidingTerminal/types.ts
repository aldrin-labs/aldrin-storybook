import { Theme } from '@material-ui/core'
export interface IProps {
  byType: 'buy' | 'sell'
  priceType: 'limit' | 'market' | 'stop-limit'
  pair: [string, string]
  marketPrice: number
  theme: Theme
  walletValue: number
  values: any
  handleChange: Function
  handleSubmit: Function
  setFieldValue: Function
  touched: boolean
  errors: any
}

