import type {
  Account,
  Connection,
  Transaction,
  TransactionSignature,
} from '@solana/web3.js'

import { WalletAdapter } from '@sb/dexUtils/types'

import { signAndSendTransaction } from '../../transactions'

export function sendAndConfirmTransactionViaWallet(
  wallet: WalletAdapter,
  connection: Connection,
  transaction: Transaction,
  ...signers: Array<Account>
): Promise<TransactionSignature> {
  return signAndSendTransaction({ connection, transaction, signers, wallet })
}
