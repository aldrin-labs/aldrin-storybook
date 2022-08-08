import { Token } from '@sb/components/TokenSelector/SelectTokenModal'

export interface SwapItem {
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
  setInputTokenAddressFromSeveral: (address: string) => void
  setOutputTokenAddressFromSeveral: (address: string) => void
  onSelect: (selected: SwapItem) => void
}
