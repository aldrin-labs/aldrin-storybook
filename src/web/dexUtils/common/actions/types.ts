import { PublicKey } from '@solana/web3.js'

import { AldrinConnection } from '@core/solana'

import { PoolInfo } from '../../../compositions/Pools/index.types'
import { StakingPool } from '../../staking/types'
import { TokenInfo, WalletAdapter } from '../../types'
import { FarmingTicket } from '../types'

export interface WithdrawStakedParams {
  wallet: WalletAdapter
  connection: AldrinConnection
  allTokensData: TokenInfo[]
  farmingTickets: FarmingTicket[]
  stakingPool: StakingPool | PoolInfo
  programAddress?: string
}

export interface StartStakingParams {
  wallet: WalletAdapter
  connection: AldrinConnection
  amount: number
  userPoolTokenAccount: PublicKey
  stakingPool: StakingPool | PoolInfo
  farmingTickets: FarmingTicket[]
  programAddress: string
  decimals?: number
}

export interface EndstakingParams {
  wallet: WalletAdapter
  connection: AldrinConnection
  userPoolTokenAccount?: PublicKey
  farmingTickets: FarmingTicket[]
  stakingPool: StakingPool | PoolInfo
  programAddress: string
  closeCalcs?: boolean
}
