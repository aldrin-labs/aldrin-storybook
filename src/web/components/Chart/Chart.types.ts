import { Theme } from '@material-ui/core'

export enum MESSAGE_TYPE {
  ACCOUNT_ORDERS = 'ACCOUNT_ORDERS',
  ORDER_AMEND = 'ORDER_AMEND',
  ORDER_CANCEL = 'ORDER_CANCEL',
}

export interface SingleChartProps {
  additionalUrl: string
  themeMode: string
  currencyPair: string
}

export interface Order {
  orderId: string
  marketName: string
  price: number
  size: number
  side: 'buy' | 'sell'
}

export interface SingleChartWithButtonsProps {
  theme: Theme
  themeMode: string
  currencyPair: string
  base: string
  quote: string
  marketType: 0 | 1
}
