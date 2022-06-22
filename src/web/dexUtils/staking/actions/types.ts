import { PublicKey } from '@solana/web3.js'

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
