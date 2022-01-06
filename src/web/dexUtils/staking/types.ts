import { PublicKey } from '@solana/web3.js'

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
