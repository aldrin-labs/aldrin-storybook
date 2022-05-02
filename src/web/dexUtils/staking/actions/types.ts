import { Connection, PublicKey } from '@solana/web3.js'
import BN from 'bn.js'

import { FarmingTicket } from '../../common/types'
import { TokenInfo, WalletAdapter } from '../../types'
import { SRinStakingPoolUI } from '../hooks/types'
import { StakingPool } from '../types'

export interface RestakeParams {
  wallet: WalletAdapter
  connection: Connection
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
  connection: Connection
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
}

export interface EndSrinStakingParams {
  wallet: WalletAdapter
  connection: Connection
  stakingPool: SRinStakingPoolUI
  stakingTier: PublicKey
  nftTierReward: PublicKey
  userTokens: TokenInfo[]
}
