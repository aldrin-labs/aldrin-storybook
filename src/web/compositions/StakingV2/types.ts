import { DexTokensPrices } from '../Pools/index.types'

export interface StakingBlockProps {
  getDexTokensPricesQuery: { getDexTokensPrices?: DexTokensPrices[] }
  open: boolean
  onClose: () => void
}

export interface StakingPageProps {
  getStakingInfoQuery: { getStakingInfo?: any }
  getDexTokensPricesQuery: { getDexTokensPrices?: DexTokensPrices[] }
}
