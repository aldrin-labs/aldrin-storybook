import { Connection, PublicKey } from '@solana/web3.js'
import BN from 'bn.js'

import { AldrinConnection } from '@core/solana'

import { FarmingTicket } from '../../common/types'
import { TokenInfo, WalletAdapter } from '../../types'
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
  poolStakeTokenaccount: PublicKey
  amount: BN
}
