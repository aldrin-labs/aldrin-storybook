import { DexTokensPrices } from '../../../compositions/Pools/index.types'

export interface ProgressBarProps {
  value: number // In percent
}

export interface RewardsModalProps {
  onClose: () => void
}

export interface RewardsProps {
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
}
