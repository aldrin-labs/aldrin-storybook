import { Connection, Transaction } from '@solana/web3.js'

import { WalletAdapter } from '../types'
import { TransactionAndSigners } from './types'

export const signTransactions = async (
  transactionsAndSigners: TransactionAndSigners[],
  connection: Connection,
  wallet: WalletAdapter,
  focusPopup = true
): Promise<Transaction[]> => {
  const recentHash = (await connection.getRecentBlockhash('max')).blockhash

  if (!wallet.publicKey) {
    throw new Error('no Public key for wallet')
  }
  const walletPk = wallet.publicKey

  const processedTransactions = transactionsAndSigners.map((t) => {
    const { transaction, signers = [] } = t

    transaction.feePayer = walletPk
    transaction.recentBlockhash = recentHash

    if (signers.length > 0) {
      transaction.partialSign(...signers)
    }

    return transaction
  })

  const signedTransacitons = await wallet.signAllTransactions(
    processedTransactions,
    focusPopup
  )
  // Return focus
  window.focus()
  return signedTransacitons
}
