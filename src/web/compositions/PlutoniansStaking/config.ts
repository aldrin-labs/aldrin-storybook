import BN from 'bn.js'

import {
  PLUTONIANS_STAKING_POOL_ADDRESS,
  PLUTONIANS_RPC_STAKING_POOL_ADDRESS,
  PLUTONIANS_PU_STAKING_POOL_ADDRESS,
  PLUTONIANS_STAKING_ADDRESS,
} from '@core/solana'
import { MASTER_BUILD } from '@core/utils/config'

import Centuria from './assets/Centuria.png'
import Colossus from './assets/Colossus.png'
import Leviathan from './assets/Leviathan.png'
import Venator from './assets/Venator.png'
import { StakingDescription } from './types'

const EXTRA_REWARDS = [
  'Aldrin Skin + 2 components',
  'Aldrin Skin + 4 components',
  'Venator + Aldrin Skin + 4 components',
  'Star Hunter + Aldrin Skin + 4 components + 1 exotic component',
]
const EXTRA_PU_RPC_REWARDS = [
  'Aldrin Skin ',
  'Aldrin Skin',
  'Aldrin Skin',
  'Aldrin Skin',
]

export const REWARDS_BG = [Centuria, Colossus, Venator, Leviathan]

export const REWARD_TOKEN_MULTIPLIER = 1

export const REWARD_APR_DENOMINATOR = 1_000_000

// TODO: get rid of that once new pool is ready
export const PLD_DENOMINATOR = MASTER_BUILD ? 1_000_000 : 1_000_000_000
export const PLD_DECIMALS = MASTER_BUILD ? 6 : 9

const TOKEN_MULTIPLIER = new BN(10).pow(new BN(PLD_DECIMALS))

export const STAKINGS: { [c: string]: StakingDescription } = {
  PLD: {
    programAddress: PLUTONIANS_STAKING_ADDRESS,
    stakingPool: PLUTONIANS_STAKING_POOL_ADDRESS,
    minStakeTokensForRewardBn: new BN(1_000).mul(TOKEN_MULTIPLIER),
    minStakeTokensForReward: 1_000,
    nftRewards: EXTRA_REWARDS,
  },
  RPC: {
    programAddress: PLUTONIANS_STAKING_ADDRESS,
    stakingPool: PLUTONIANS_RPC_STAKING_POOL_ADDRESS,
    minStakeTokensForRewardBn: new BN(100_000).mul(TOKEN_MULTIPLIER),
    minStakeTokensForReward: 100_000,
    nftRewards: EXTRA_PU_RPC_REWARDS,
  },
  PU238: {
    programAddress: PLUTONIANS_STAKING_ADDRESS,
    stakingPool: PLUTONIANS_PU_STAKING_POOL_ADDRESS,
    minStakeTokensForRewardBn: new BN(50_000_000).mul(TOKEN_MULTIPLIER),
    minStakeTokensForReward: 50_000_000,
    nftRewards: EXTRA_PU_RPC_REWARDS,
  },
}
