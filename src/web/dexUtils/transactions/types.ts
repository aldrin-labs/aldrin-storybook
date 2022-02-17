import {
  Commitment,
  Connection,
  Signer,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'

import { WalletAdapter } from '../types'

interface SendTransactionParamsBase {
  connection: Connection
}

export interface NotificationParams {
  sentMessage?: string | [string, string]
  successMessage?: string | [string, string]
  showNotification?: boolean
}

export interface TransactionParams {
  timeout?: number
  commitment?: Commitment // Confirmation commitment awaiting
  skipPreflight?: boolean
}

export interface SendSignedTransactionParams
  extends SendTransactionParamsBase,
    NotificationParams,
    TransactionParams {
  transaction: Transaction
}

export interface WaitConfirmationParams extends SendTransactionParamsBase {
  txId: string
  timeout: number
  pollInterval?: number
  commitment?: Commitment
}

export interface SendTransactionParams extends SendSignedTransactionParams {
  wallet: WalletAdapter
  signers?: Signer[]
  focusPopup?: boolean
}

export type SendSignedTransactionResult = 'failed' | 'timeout' | 'success'

export type SignAndSendTransactionResult =
  | SendSignedTransactionResult
  | 'cancelled'
  | 'rejected'
export type AsyncSendSignedTransactionResult =
  Promise<SendSignedTransactionResult>

export interface TransactionAndSigners {
  transaction: Transaction
  signers?: Signer[]
}

export interface InstructionWithLamports {
  instruction: TransactionInstruction
  lamports?: number
}

export interface SendTransactionsParams
  extends SendTransactionParamsBase,
    NotificationParams,
    TransactionParams {
  wallet: WalletAdapter
  transactionsAndSigners: TransactionAndSigners[]
  focusPopup?: boolean
}
