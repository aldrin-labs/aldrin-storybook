interface TokenPrice {
  closePrice: number
  lastPriceDiff: number
  symbol: string
}
export interface TokensListProps {
  serumMarketData: {
    getSerumMarketData: TokenPrice[]
  }
}

export interface SwapTabsProps {
  active?: boolean
}

export interface TokenForList extends TokenPrice {
  symbol: string
  mint: string
  priceDiffPct: number
}

export interface PortfolioPropsInner {
  dexTokenPrices: {
    getDexTokensPrices: {
      symbol: string
      price: number
    }[]
  }
}

export interface PortfolioPropsOuter {
  tokensList: TokenForList[]
}
