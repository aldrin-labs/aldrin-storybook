import {
  FeesMap,
  PoolInfo,
  TokenPricesMap,
  VolumesMap,
  FarmingTicketsMap,
} from '@sb/compositions/Pools/index.types'

export interface AllPoolsProps {
  searchValue: string
  pools: PoolInfo[]
  dexTokensPricesMap: TokenPricesMap
  feesByPool: FeesMap
  tradingVolumes: VolumesMap
  farmingTicketsMap: FarmingTicketsMap
}
