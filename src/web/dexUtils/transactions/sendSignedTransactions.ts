import { Connection, Transaction } from '@solana/web3.js'

import { sendSignedSignleTransaction } from './sendSignedSignleTransaction'
import { NotificationParams, TransactionParams } from './types'

/** Send batch of signed transactions, wait for finalizing of last transaction */
export const sendSignedTransactions = async (
  transactions: Transaction[],
  connection: Connection,
  params: TransactionParams & NotificationParams = {}
) => {
  const {
    showNotification,
    successMessage,
    sentMessage,
    commitment = 'confirmed',
  } = params
  for (let i = 0; i < transactions.length; i += 1) {
    const signedTransaction = transactions[i]
    const isLastTransaction = i === transactions.length - 1

    // send transaction and wait 1s before sending next
    const result = await sendSignedSignleTransaction({
      transaction: signedTransaction,
      connection,
      timeout: 30_000,
      commitment: isLastTransaction ? commitment : 'confirmed', // Wait for finalization of last transaction
      successMessage: isLastTransaction ? successMessage : undefined,
      sentMessage,
      showNotification,
    })

    if (result !== 'success') {
      return result
    }
  }

  return 'success'
}
