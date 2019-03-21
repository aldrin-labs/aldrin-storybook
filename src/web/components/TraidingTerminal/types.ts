export interface IProps {
  type: 'buy' | 'sell'
  pair: [string, string]
  amount: number
  marketPrice: number
}

