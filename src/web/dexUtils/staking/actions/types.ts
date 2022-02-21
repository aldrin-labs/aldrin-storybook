import { Connection, PublicKey } from '@solana/web3.js'
import BN from 'bn.js'

import { FarmingTicket } from '../../common/types'
import { TokenInfo, WalletAdapter } from '../../types'
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
  amount: BN
}
