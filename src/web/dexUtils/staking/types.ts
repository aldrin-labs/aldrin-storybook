import { Connection, PublicKey } from '@solana/web3.js'
import { PoolInfo } from '../../compositions/Pools/index.types'
import { FarmingState, FarmingTicket, SnapshotQueue } from '../common/types'
import MultiEndpointsConnection from '../MultiEndpointsConnection'
import { TokenInfo, WalletAdapter } from '../types'

export type StakingPool = {
  swapToken: string
  poolSigner: string
  poolTokenMint: string
  stakingVault: string
  farming: FarmingState[]
}

export interface WithdrawFarmedParams {
  wallet: WalletAdapter
  connection: Connection
  allTokensData: TokenInfo[]
  farmingTickets: FarmingTicket[]
  pool: StakingPool | PoolInfo
  programAddress?: string
  snapshotQueues: SnapshotQueue[]
  signAllTransactions: boolean // Ledger compability
}

export interface StartStakingParams {
  wallet: WalletAdapter
  connection: MultiEndpointsConnection
  amount: number
  userPoolTokenAccount: PublicKey
  stakingPool: StakingPool
  farmingTickets: FarmingTicket[]
}

export interface EndstakingParams {
  wallet: WalletAdapter
  connection: MultiEndpointsConnection
  // poolPublicKey: PublicKey
  userPoolTokenAccount: PublicKey
  farmingTickets: FarmingTicket[]
  stakingPool: StakingPool
}
