import { PublicKey } from '@solana/web3.js'
import { ProgramAccount } from 'anchor03'
import BN from 'bn.js'

/* eslint-disable camelcase */
export interface MarinadeStats {
  available_reserve_balance: number
  avg_staking_apy: number
  bot_balance: number
  circulating_ticket_balance: number
  circulating_ticket_count: number
  last_stake_delta_epoch: number
  lido_staking: string
  liq_pool_cap: number
  liq_pool_current_fee: number
  liq_pool_m_sol: number
  liq_pool_max_fee: number
  liq_pool_min_fee: number
  liq_pool_sol: number
  liq_pool_target: number
  liq_pool_token_price: number
  liq_pool_token_supply: number
  liq_pool_treasury_cut: number
  liq_pool_value: number
  m_sol_mint_supply: number
  m_sol_price: number
  m_sol_supply_state: number
  mnde_circulating_supply: number
  mnde_total_supply: number
  reserve_pda: number
  reward_fee_bp: number
  stake_accounts: number
  stake_delta: number
  staking_sol_cap: number
  total_active_balance: number
  total_cooling_down: number
  treasury_m_sol_amount: number
  tvl_sol: number
  validators_count: number
}

export interface SRinStakingPoolBase {
  owner: PublicKey
  poolSigner: PublicKey
  bumpSeedSigner: number
  stakeTokenMint: PublicKey
  stakeVault: PublicKey
  rewardTokenMint: PublicKey
  rewardVault: PublicKey
}

export interface SRinStakeToRewardConversionPath {
  stakingPool: PublicKey
  vaults: {
    vault1: PublicKey
    vault2: PublicKey
  }[]
}

export interface SRinStakingPool extends SRinStakingPoolBase {
  tiers: PublicKey[]
}

export interface SRinNftRewardGroup {
  tier: PublicKey
  minStakeTokensForReward: BN
  nfts: {
    quantity: number
    nftOwner: PublicKey
    bumpSeed: number
    uniqueSeed: number[]
  }[]
}

export interface SRinStakingTier {
  pool: PublicKey
  apr: {
    permillion: BN
  }
  lockDuration: {
    seconds: BN
  }
}

export interface SRinUserAccount {
  user: PublicKey
  amount: BN
  stakingTier: PublicKey
  depositedAt: BN
}

export interface SRinStakingPoolUI extends SRinStakingPoolBase {
  stakingPool: PublicKey
  tiers: (ProgramAccount<SRinStakingTier> & {
    nftRewards: ProgramAccount<SRinNftRewardGroup>[]
  })[]
  stakeToRewardConversionPath?: ProgramAccount<SRinStakeToRewardConversionPath>
}
