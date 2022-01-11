import { Token } from '@sb/components/TokenSelector/SelectTokenModal'
import { RefreshFunction } from '@sb/dexUtils/types'

export interface SwapFormProps {
  tokens: Token[]
  refreshAll: RefreshFunction
}

export interface SwapFormModel {
  marketFrom: Token
  marketTo: Token
  amountFrom: string
  amountTo: string
  slippageTolerance: number
}
