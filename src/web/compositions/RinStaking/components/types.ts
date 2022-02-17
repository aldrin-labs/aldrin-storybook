/* eslint-disable no-restricted-globals */

import { DexTokensPrices } from '@sb/compositions/Pools/index.types'
import { FarmingState } from '@sb/dexUtils/common/types'

import { StakingPool } from '../../../dexUtils/staking/types'

export interface OuterProps {
  currentFarmingState: FarmingState
  stakingPool: StakingPool
  buyBackAmount: number
  treasuryDailyRewards: number
}

export interface InnerProps {
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
}

export interface UserBalanceProps {
  value: number
  visible: boolean
  decimals?: number
}

export type StakingInfoProps = InnerProps & OuterProps

export interface StakingFormProps {
  loading: { stake: boolean; unstake: boolean }
  end: (amount: number) => any
  totalStaked: number
  isUnstakeLocked: boolean
  unlockAvailableDate: number
  mint: string
}
