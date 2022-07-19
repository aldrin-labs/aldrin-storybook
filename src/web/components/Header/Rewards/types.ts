import { DexTokensPrices } from '@sb/compositions/Pools/index.types'

export interface ProgressBarProps {
  $value: number // In percent
}

export interface RewardsModalProps {
  onClose: () => void
  open: boolean
}

export interface RewardsProps {
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
}
