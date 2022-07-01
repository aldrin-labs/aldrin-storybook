import { Farm, Farmer } from '@core/solana'

import { PoolInfo } from '../../index.types'

export interface FarmingRewardsProps {
  pool: PoolInfo
  farmingUsdValue: number
  farm?: Farm
  farmer?: Farmer
}

export interface FarmingRewardsIconsProps {
  mints: string[]
  poolMint: string
}
