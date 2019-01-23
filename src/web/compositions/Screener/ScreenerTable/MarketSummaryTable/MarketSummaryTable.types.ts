export interface IProps {
  searchText: string
}

export interface IState {
  currentSort: { key: string; arg: 'ASC' | 'DESC' } | null
}

export interface ICurrentSort {
  key: string
  arg: 'ASC' | 'DESC'
}


export interface IMarketSummaryTableData {
  rank: number
  ticker: string
  tickerFull: string
  priceUSD: number
  priceBTC: number
  marketCap: number
  volume24: number
  one1hrUSD: number
  one1hrBTC: number
  twentyFour24hrUSD: number
  twentyFour24hrBTC: number
  seven7daysUSD: number
  seven7daysBTC: number
  chgATH: number
}

