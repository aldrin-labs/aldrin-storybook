import { PublicKey } from '@solana/web3.js'
import BN from "bn.js";

export type TwammOrder = {
  index: number
  isInitialized: boolean
  startTime: number
  endTime: number
  amountFilled: number
  amountToFill: number
  amount: number
  tokensSwapped: number

  orderArrayPublicKey: string
  side: any
  pair: string
  signer: PublicKey | string
  twammFromTokenVault: string
  twammToTokenVault: string
}

export type PairSettings = {
  isInitialized: boolean
  baseTokenFeeAccount: string
  quoteTokenFeeAccount: string
  baseTokenMint: string
  quoteTokenMint: string
  quoteMintDecimals: number
  baseMintDecimals: number
  pair: string
  publicKey: string
  account: string
}

export type PairSettingsFees = {
  cancellingFeeDenominator: BN
  cancellingFeeNumerator: BN
  placingFeeDenominator: BN
  placingFeeNumerator: BN
}

export type PairSettingsRaw = {
  authority: PublicKey
  baseMintDecimals: number
  baseTokenFeeAccount: PublicKey
  baseTokenMint: PublicKey
  discountDenominator: BN
  discountNumerator: BN
  fees: PairSettingsFees
  initializerAccount: PublicKey
  minimumTokens: BN
  pubkey: PublicKey
  pyth: PublicKey
  quoteMintDecimals: number
  quoteTokenFeeAccount: PublicKey
  quoteTokenMint: PublicKey
}
