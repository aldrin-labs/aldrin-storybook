export interface IProps {
  type: 'buy' | 'sell'
  priceType: 'limit' | 'market' | 'stop-limit'
  pair: [string, string]
  amount: number
  marketPrice: number
}

