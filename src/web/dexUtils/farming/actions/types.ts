import { PublicKey } from '@solana/web3.js'

import { AldrinConnection } from '../../../../../../core/src/solana'
import { WalletAdapter } from '../../types'

export interface InitializeFarmingParams {
  wallet: WalletAdapter
  connection: AldrinConnection
  stakeMint: PublicKey
}
