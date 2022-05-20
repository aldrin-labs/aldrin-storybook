import { PublicKey, Transaction } from '@solana/web3.js'

import { WalletAdapter } from '../types'

interface WalletLike {
  signTransaction(tx: Transaction): Promise<Transaction>
  signAllTransactions(txs: Transaction[]): Promise<Transaction[]>
  publicKey: PublicKey
}

export const walletAdapterToWallet = (w: WalletAdapter): WalletLike => {
  if (w.publicKey) {
    return w as any as WalletLike
  }

  throw new Error(
    'Could not create Wallet from adapter: PublicKey is not defined'
  )
}

export const NUMBER_OF_RETRIES = 5
