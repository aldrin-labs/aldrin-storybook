import { MASTER_BUILD } from '@core/utils/config'
import { RIN_MINT } from '../utils'

export const STAKING_PART_OF_AMM_FEES = 1 / 6

export const STAKING_FARMING_TOKEN_MINT_ADDRESS = MASTER_BUILD
  ? RIN_MINT
  : RIN_MINT

export const STAKING_FARMING_TOKEN_DECIMALS = 9

export const STAKING_FARMING_TOKEN_DIVIDER =
  10 ** STAKING_FARMING_TOKEN_DECIMALS
