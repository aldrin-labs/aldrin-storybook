import { Token } from '@sb/components/TokenSelector/SelectTokenModal'

export interface SearchItem {
  tokenFrom: { symbol: string; mint: string }
  tokenTo: { symbol: string; mint: string }
  amountFrom: string | number | null
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
