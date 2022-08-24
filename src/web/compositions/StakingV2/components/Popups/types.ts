import { DexTokensPrices } from '../../../Pools/index.types'

export interface MSolStakingBlockProps {
  open: boolean
  onClose: () => void
  getDexTokensPricesQuery: { getDexTokensPrices?: DexTokensPrices[] }
}
