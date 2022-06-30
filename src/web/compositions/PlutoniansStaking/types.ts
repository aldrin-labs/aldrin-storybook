import BN from 'bn.js'

import { DexTokensPrices } from '../Pools/index.types'

export interface PlutoniansBlockProps {
  getDexTokensPricesQuery: { getDexTokensPrices?: DexTokensPrices[] }
}

export interface StakingDescription {
  programAddress: string
  stakingPool: string
  minStakeTokensForRewardBn: BN
  minStakeTokensForReward: number
  nftRewards: [string, string, string, string]
}
