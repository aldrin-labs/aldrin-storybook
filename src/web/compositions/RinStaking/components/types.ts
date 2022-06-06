/* eslint-disable no-restricted-globals */

import { DexTokensPrices } from '@sb/compositions/Pools/index.types'
import { FarmingState } from '@sb/dexUtils/common/types'

import { StakingPool } from '@sb/dexUtils/staking/types'

export interface UserBalanceProps {
  value: number
  visible: boolean
  decimals?: number
}

export type StakingInfoProps = {
  tokenPrice: number
  currentFarmingState: FarmingState
  stakingPool: StakingPool
  buyBackAmount: number
  treasuryDailyRewards: number
}

export interface StakingFormProps {
  loading: { stake: boolean; unstake: boolean }
  end: (amount: number) => any
  totalStaked: number
  isUnstakeLocked: boolean
  unlockAvailableDate: number
  mint: string
}
