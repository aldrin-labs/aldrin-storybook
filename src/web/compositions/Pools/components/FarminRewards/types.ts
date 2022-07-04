import { PoolInfo } from '../../index.types'

export interface FarmingRewardsProps {
  pool: PoolInfo
  farmingUsdValue: number
}

export interface FarmingRewardsIconsProps {
  mints: string[]
  poolMint: string
}
