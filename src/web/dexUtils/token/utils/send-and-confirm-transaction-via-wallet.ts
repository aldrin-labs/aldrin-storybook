import type {
  Account,
  Connection,
  Transaction,
  TransactionSignature,
} from '@solana/web3.js'

import { WalletAdapter } from '@sb/dexUtils/types'

import { signAndSendSingleTransaction } from '../../transactions'

export function sendAndConfirmTransactionViaWallet(
  wallet: WalletAdapter,
  connection: Connection,
  transaction: Transaction,
  ...signers: Array<Account>
): Promise<TransactionSignature> {
  return signAndSendSingleTransaction({
    connection,
    transaction,
    signers,
    wallet,
  })
}
