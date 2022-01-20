import { PublicKey, Transaction } from '@solana/web3.js'

import { WalletAdapter } from '../types'

interface WalletLike {
  signTransaction(tx: Transaction): Promise<Transaction>
  signAllTransactions(txs: Transaction[]): Promise<Transaction[]>
  publicKey: PublicKey
}

export const walletAdapterToWallet = (w: WalletAdapter): WalletLike => {
  const { publicKey } = w
  if (!publicKey) {
    throw new Error(
      'Could not create Wallet from adapter: PublicKey is not defined'
    )
  }
  return { ...w, publicKey }
}
