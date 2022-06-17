import BN from 'bn.js'

import {
  PLUTONIANS_STAKING_POOL_ADDRESS,
  PLUTONIANS_STAKING_ADDRESS,
} from '@sb/dexUtils/ProgramsMultiton'

import { MASTER_BUILD } from '@core/utils/config'

import Centuria from './assets/Centuria.png'
import Colossus from './assets/Colossus.png'
import Leviathan from './assets/Leviathan.png'
import Venator from './assets/Venator.png'
import { StakingDescription } from './types'

export const EXTRA_REWARDS = [
  'Aldrin Skin + 2 components',
  'Aldrin Skin + 4 components',
  'Venator + Aldrin Skin + 4 components',
  'Star Hunter + Aldrin Skin + 4 components + 1 exotic component',
]

export const REWARDS_BG = [Centuria, Colossus, Venator, Leviathan]

export const REWARD_TOKEN_NAME = 'PU238' // For getDexTokenPrices
export const REWARD_TOKEN_MULTIPLIER = 1

export const REWARD_APR_DENOMINATOR = 1_000_000

// TODO: get rid of that once new pool is ready
export const PLD_DENOMINATOR = MASTER_BUILD ? 1_000_000 : 1_000_000_000
export const PLD_DECIMALS = MASTER_BUILD ? 6 : 9

export const NFT_REWARD_MIN_STAKE_AMOUNT = 1_000
export const NFT_REWARD_MIN_STAKE_AMOUNT_BN = new BN(
  NFT_REWARD_MIN_STAKE_AMOUNT
).mul(new BN(10).pow(new BN(PLD_DECIMALS)))

export const STAKINGS: { [c: string]: StakingDescription } = {
  PLD: {
    programAddress: PLUTONIANS_STAKING_ADDRESS,
    stakingPool: PLUTONIANS_STAKING_POOL_ADDRESS,
  },
}
