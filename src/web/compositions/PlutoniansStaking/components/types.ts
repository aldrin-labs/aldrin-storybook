import { DexTokensPrices } from '../../Pools/index.types'

export interface BlockProps {
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
}
