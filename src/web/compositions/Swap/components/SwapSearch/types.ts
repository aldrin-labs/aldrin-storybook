import { Token } from '@sb/components/TokenSelector/SelectTokenModal'

export interface SearchItem {
  tokenFrom: Token & { symbol: string }
  tokenTo: Token & { symbol: string }
  amountFrom?: string
}

export interface SwapSearchProps {
  tokens: Token[]
  topTradingPairs: {
    pair: string
    baseMint: string
    quoteMint: string
    baseSymbol: string
    quoteSymbol: string
  }[]
  topTradingMints: string[]
  onSelect: (selected: SearchItem) => void
}
