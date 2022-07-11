import {
  Commitment,
  Signer,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'

import {
  AldrinConnection,
  AuthorizedWalletAdapter,
  SendTransactionStatus,
} from '@core/solana'

interface SendTransactionParamsBase {
  connection: AldrinConnection
}

type FooType = Record<SendTransactionStatus, string>
interface FooTypeI extends FooType {}

export interface NotificationParams {
  messages?: {
    [key: keyof FooTypeI]: string | [string, string]
  }
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
  wallet: AuthorizedWalletAdapter
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
  wallet: AuthorizedWalletAdapter
  transactionsAndSigners: TransactionAndSigners[]
  focusPopup?: boolean
}
