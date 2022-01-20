import { Connection, Transaction } from '@solana/web3.js'

import { sendSignedSignleTransaction } from './sendSignedSignleTransaction'
import { NotificationParams, TransactionParams } from './types'

/** Send batch of signed transactions, wait for finalizing of last transaction */
export const sendSignedTransactions = async (
  transactions: Transaction[],
  connection: Connection,
  params: TransactionParams & NotificationParams = {}
) => {
  const { successMessage } = params

  for (let i = 0; i < transactions.length; i += 1) {
    const signedTransaction = transactions[i]
    const isLastTransaction = i === transactions.length - 1

    // send transaction and wait 1s before sending next
    const result = await sendSignedSignleTransaction({
      transaction: signedTransaction,
      timeout: 30_000,
      successMessage: isLastTransaction ? successMessage : '',
      connection,
    })

    if (result !== 'success') {
      return result
    }
  }

  return 'success'
}
