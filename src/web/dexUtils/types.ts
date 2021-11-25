import { Market, OpenOrders } from '@project-serum/serum'
import {
  Connection,
  PublicKey,
  Transaction,
  Account,
  Keypair,
} from '@solana/web3.js'
import { Order } from '@project-serum/serum/lib/market'

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
export type AsyncRefreshFunction = () => Promise<boolean>
export type AsyncRefreshVoidFunction = () => Promise<void>

export interface ValidateOrderParams {
  price: number
  size: number
  market: Market
  wallet: WalletAdapter
  pair: string
}

export interface PubkeyAccount {
  pubkey: PublicKey
}

export interface PlaceOrder {
  side: 'buy' | 'sell'
  price: number
  size: number
  pair: string
  orderType: 'ioc' | 'limit' | 'postOnly'
  isMarketOrder: boolean
  market: Market
  wallet: WalletAdapter
  connection: Connection
  baseCurrencyAccount: PubkeyAccount
  quoteCurrencyAccount: PubkeyAccount
  openOrdersAccount: OpenOrders
}

export interface SignTransactionsParams {
  transactionsAndSigners: {
    transaction: Transaction
    signers?: Array<Account | Keypair>
  }[]
  wallet: WalletAdapter
  connection: Connection
}

export interface OrderWithMarket extends Order {
  market: Market
  marketName: string
}

export interface CancelOrderParams {
  order: OrderWithMarket
  wallet: WalletAdapter
  market: Market
  connection: Connection
}

export interface AmendOrder {
  size?: number
  price?: number
}

export interface AmendOrderParams {
  market: Market
  wallet: WalletAdapter
  connection: Connection
  order: OrderWithMarket
  amendOrder: AmendOrder
  baseCurrencyAccount: PubkeyAccount
  quoteCurrencyAccount: PubkeyAccount
  openOrdersAccount: OpenOrders
}

export interface SendTransactionParams extends SendSignedTransactionParams {
  wallet: WalletAdapter
  signers: (Keypair | Account)[]
  focusPopup?: boolean
}

export interface SendSignedTransactionParams {
  transaction: Transaction
  connection: Connection
  sentMessage?: string
  successMessage?: string
  timeout?: number
  operationType?: string
  params?: any
}

export type SendSignedTransactionResult = 'failed' | 'timeout' | string
export type AsyncSendSignedTransactionResult = Promise<SendSignedTransactionResult>

export type Maybe<T> = T | undefined
