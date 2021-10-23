import { PublicKey, Transaction } from '@solana/web3.js'
export interface WalletAdapter {
  publicKey: PublicKey | null | undefined
  autoApprove: boolean
  connected: boolean
  signTransaction: (
    transaction: Transaction,
    focusPopup?: boolean
  ) => Promise<Transaction>
  signAllTransactions: (
    transaction: Transaction[],
    focusPopup?: boolean
  ) => Promise<Transaction[]>
  connect: () => any
  disconnect: () => any
  on<T>(event: string, fn: () => void): this
}

export interface TokenInfo {
  symbol: string
  amount: number
  decimals: number
  mint: string
  address: string
}

export type RefreshFunction = () => void
