import BN from 'bn.js'

import Centuria from './assets/Centuria.png'
import Colossus from './assets/Colossus.png'
import Leviathan from './assets/Leviathan.png'
import Venator from './assets/Venator.png'

export const EXTRA_REWARDS = [
  'Aldrin Skin + 2 components',
  'Aldrin Skin + 4 components',
  'Venator + Aldrin Skin + 4 components',
  'Star Hunter + Aldrin Skin + 4 components + 1 exotic component',
]

export const REWARDS_BG = [Centuria, Colossus, Venator, Leviathan]

export const REWARD_TOKEN_NAME = 'PRC' // For getDexTokenPrices
export const REWARD_TOKEN_MULTIPLIER = 0.001

export const REWARD_APR_DENOMINATOR = 1_000_000

export const PLD_DENOMINATOR = 1_000_000_000

export const NFT_REWARD_MIN_STAKE_AMOUNT = 1_000
export const NFT_REWARD_MIN_STAKE_AMOUNT_BN = new BN(
  NFT_REWARD_MIN_STAKE_AMOUNT
).mul(new BN(10).pow(new BN(9)))
