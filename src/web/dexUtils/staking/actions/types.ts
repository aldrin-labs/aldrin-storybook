import { Connection, PublicKey } from '@solana/web3.js'
import { ProgramAccount } from 'anchor024'
import BN from 'bn.js'

import { AldrinConnection } from '@core/solana'

import { FarmingTicket } from '../../common/types'
import { TokenInfo, WalletAdapter } from '../../types'
import { SRinNftRewardGroup, SRinStakingPoolUI } from '../hooks/types'
import { StakingPool } from '../types'

export interface RestakeParams {
  wallet: WalletAdapter
  connection: AldrinConnection
  allTokensData: TokenInfo[]
  farmingTickets: FarmingTicket[]
  stakingPool: StakingPool
  amount: number
  userPoolTokenAccount: PublicKey
  decimals?: number
  programAddress?: string
}

export interface StartSrinStakingParams {
  wallet: WalletAdapter
  connection: AldrinConnection
  stakingPool: PublicKey
  stakingTier: PublicKey
  userStakeTokenaccount: PublicKey
  stakeVault: PublicKey
  amount: BN
}

export interface EndSrinStakingInstructionParams {
  wallet: WalletAdapter
  connection: Connection
  stakingPool: PublicKey
  stakingTier: PublicKey
  userStakeWallet: PublicKey
  userRewardWallet: PublicKey
  poolSigner: PublicKey
  nftReward: PublicKey
  rewardVault: PublicKey
  stakeVault: PublicKey
  conversion: PublicKey
  stakeToRewardConversionPaths: PublicKey[]
  createNftReceipt: boolean
}

export interface EndSrinStakingParams {
  wallet: WalletAdapter
  connection: Connection
  stakingPool: SRinStakingPoolUI
  stakingTier: PublicKey
  nftTierReward: PublicKey
  userTokens: TokenInfo[]
  stakedAmount: BN
}

export interface ClaimNftParams {
  wallet: WalletAdapter
  connection: Connection
  userNftReceipt: PublicKey
  stakingPool: PublicKey
  nftRewardGroup: ProgramAccount<SRinNftRewardGroup>
}
