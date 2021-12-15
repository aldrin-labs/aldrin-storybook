import { Connection } from '@solana/web3.js'
import { PoolInfo } from '../../compositions/Pools/index.types'
import { FarmingState, FarmingTicket, SnapshotQueue } from '../common/types'
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
