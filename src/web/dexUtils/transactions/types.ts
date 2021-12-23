import {
  Commitment,
  Signer,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'
import MultiEndpointsConnection from '../MultiEndpointsConnection'
import { WalletAdapter } from '../types'

interface SendTransactionParamsBase {
  connection: MultiEndpointsConnection
}
export interface SendSignedTransactionParams extends SendTransactionParamsBase {
  transaction: Transaction
  sentMessage?: string
  successMessage?: string
  timeout?: number
  operationType?: string
  params?: any
  showNotification?: boolean
  commitment?: Commitment // Confirmation commitment awaiting
  skipPreflight?: boolean
}

export interface WaitConfirmationParams {
  txId: string
  timeout: number
  connection: MultiEndpointsConnection
  pollInterval?: number
  commitment?: Commitment
}

export interface SendTransactionParams extends SendSignedTransactionParams {
  wallet: WalletAdapter
  signers?: Signer[]
  focusPopup?: boolean
}

export type SendSignedTransactionResult = 'failed' | 'timeout' | 'success'
export type AsyncSendSignedTransactionResult =
  Promise<SendSignedTransactionResult>

export interface TransactionAndSigners {
  transaction: Transaction
  signers: Signer[]
}

export interface InstructionWithLamports {
  instruction: TransactionInstruction
  lamports?: number
}
