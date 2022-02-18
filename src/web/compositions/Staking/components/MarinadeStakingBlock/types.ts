import { DexTokensPrices } from '../../../Pools/index.types'

export interface MarinadeStakingProps {
  getDexTokensPricesQuery: { getDexTokensPrices?: DexTokensPrices[] }
}

export interface FillerProps {
  $width: number // percent
}
