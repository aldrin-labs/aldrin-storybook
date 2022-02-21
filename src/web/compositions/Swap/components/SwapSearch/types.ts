import { Token } from '@sb/components/TokenSelector/SelectTokenModal'

export interface SearchItem {
  tokenFrom: Token & { symbol: string }
  tokenTo: Token & { symbol: string }
  amountFrom?: string
  amountTo?: string
}

export interface SwapSearchProps {
  tokens: Token[]
  onSelect: (selected: SearchItem) => void
}
