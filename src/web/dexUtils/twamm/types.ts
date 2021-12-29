import { PublicKey } from '@solana/web3.js'

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
