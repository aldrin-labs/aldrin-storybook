import { PublicKey } from '@solana/web3.js'
import { BN } from 'anchor03'

import { AldrinConnection, Farm } from '@core/solana'

import { TokenInfo, WalletAdapter } from '../../types'

export interface InitializeFarmingParams {
  wallet: WalletAdapter
  connection: AldrinConnection
  stakeMint: PublicKey
}

export interface ClaimEligibleHarvestParams {
  wallet: WalletAdapter
  connection: AldrinConnection
  farm: Farm
  userTokens: TokenInfo[]
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

export interface AddHarvestParams {
  wallet: WalletAdapter
  connection: AldrinConnection
  farm: PublicKey
  amount: number
  harvestMint: PublicKey
}

export interface NewHarvestPeriodParams {
  wallet: WalletAdapter
  connection: AldrinConnection
  tokenAmount: BN
  stakeMint: PublicKey
  harvestMint: PublicKey
  harversWallet: PublicKey
  duration: number // Period of farming in seconds
  farm: Farm
  userTokens: TokenInfo[]
  amount: number
}
