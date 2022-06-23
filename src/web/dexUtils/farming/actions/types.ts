import { PublicKey } from '@solana/web3.js'

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
  farm: Farm
  userTokens: TokenInfo[]
  amount: number
  farmer?: PublicKey
}

export interface StopFarmingParams {
  wallet: WalletAdapter
  connection: AldrinConnection
  farm: Farm
  userTokens: TokenInfo[]
  amount: number
}
