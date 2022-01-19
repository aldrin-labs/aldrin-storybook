import { Commitment, Connection, Signer } from '@solana/web3.js'

import {
  SendSignedTransactionParams as SendSingleParams,
  WalletAdapter,
  TransactionAndSigners,
} from '@core/solana'

interface SendTransactionParamsBase {
  connection: Connection
}

export interface NotificationParams {
  successMessage?: string | [string, string]
}

export interface TransactionParams {
  timeout?: number
  commitment?: Commitment // Confirmation commitment awaiting
  skipPreflight?: boolean
}

export interface SendSignedTransactionParams
  extends SendSingleParams,
    NotificationParams {}

export interface SendTransactionParams extends SendSignedTransactionParams {
  wallet: WalletAdapter
  signers?: Signer[]
  focusPopup?: boolean
}

export interface SendTransactionsParams
  extends SendTransactionParamsBase,
    NotificationParams,
    TransactionParams {
  wallet: WalletAdapter
  transactionsAndSigners: TransactionAndSigners[]
  focusPopup?: boolean
}
