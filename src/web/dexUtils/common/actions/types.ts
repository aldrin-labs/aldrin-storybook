import { PublicKey } from '@solana/web3.js'

import { PoolInfo } from '../../../compositions/Pools/index.types'
import MultiEndpointsConnection from '../../MultiEndpointsConnection'
import { StakingPool } from '../../staking/types'
import { TokenInfo, WalletAdapter } from '../../types'
import { FarmingTicket } from '../types'

export interface WithdrawStakedParams {
  wallet: WalletAdapter
  connection: MultiEndpointsConnection
  allTokensData: TokenInfo[]
  farmingTickets: FarmingTicket[]
  stakingPool: StakingPool | PoolInfo
  programAddress?: string
}

export interface StartStakingParams {
  wallet: WalletAdapter
  connection: MultiEndpointsConnection
  amount: number
  userPoolTokenAccount: PublicKey
  stakingPool: StakingPool | PoolInfo
  farmingTickets: FarmingTicket[]
  programAddress: string
  decimals?: number
}

export interface EndstakingParams {
  wallet: WalletAdapter
  connection: MultiEndpointsConnection
  userPoolTokenAccount?: PublicKey
  farmingTickets: FarmingTicket[]
  stakingPool: StakingPool | PoolInfo
  programAddress: string
}
