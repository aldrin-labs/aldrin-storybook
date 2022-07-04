import { ProgramAccount } from 'anchor024'

import {
  FeesMap,
  PoolInfo,
  TokenPricesMap,
  VolumesMap,
  FarmingTicketsMap,
} from '@sb/compositions/Pools/index.types'

import { Farm } from '@core/solana'

export interface AllPoolsProps {
  searchValue: string
  pools: PoolInfo[]
  dexTokensPricesMap: TokenPricesMap
  feesByPool: FeesMap
  tradingVolumes: VolumesMap
  farmingTicketsMap: FarmingTicketsMap
  farms?: Map<string, ProgramAccount<Farm>>
}
