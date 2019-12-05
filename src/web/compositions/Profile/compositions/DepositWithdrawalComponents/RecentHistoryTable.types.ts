export type ActionType = {
    _id: string
    isAccountTrade: boolean
    where: string
    account: string
    type: string
    cost: number
    base: string
    quote: string
    price: number
    amount: number
    date: number
    status: string
    txId: string
    address: string
  }
  
  export type PortfolioAction = {
    trades: ActionType[]
    tradesCount: number
  }