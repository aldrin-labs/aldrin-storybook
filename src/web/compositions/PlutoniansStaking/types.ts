import { DexTokensPrices } from '../Pools/index.types'

export interface PlutoniansBlockProps {
  getDexTokensPricesQuery: { getDexTokensPrices?: DexTokensPrices[] }
}

export interface StakingDescription {
  programAddress: string
  stakingPool: string
}
