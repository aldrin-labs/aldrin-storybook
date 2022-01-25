import { Connection, PublicKey } from '@solana/web3.js'

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
