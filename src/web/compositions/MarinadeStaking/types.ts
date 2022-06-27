import { DexTokensPrices } from '../Pools/index.types'

export interface StakingBlockProps {
  getDexTokensPricesQuery: { getDexTokensPrices?: DexTokensPrices[] }
}
