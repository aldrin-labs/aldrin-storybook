import { PublicKey } from '@solana/web3.js'
import { ProgramAccount } from 'anchor024'

import { AldrinConnection, Farm } from '@core/solana'

import { TokenInfo, WalletAdapter } from '../../types'

export interface InitializeFarmingParams {
  wallet: WalletAdapter
  connection: AldrinConnection
  stakeMint: PublicKey
}

export interface StartFarmingV2Params {
  wallet: WalletAdapter
  connection: AldrinConnection
  farm: ProgramAccount<Farm>
  userTokens: TokenInfo[]
  amount: number
  farmer?: PublicKey
}
