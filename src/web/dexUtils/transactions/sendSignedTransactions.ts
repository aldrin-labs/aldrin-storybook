import {
  SendTransactionStatus,
  SendSignedTransactionResponse,
} from '@core/solana'

import { sendSignedSignleTransaction } from './sendSignedSignleTransaction'
import { SendSignedTransactionsParams } from './types'

const resposneToStatus = (
  response: SendSignedTransactionResponse
): 'success' | 'failed' => {
  if (response.status === SendTransactionStatus.CONFIRMED) {
    return 'success'
  }

  return 'failed'
}

/** Send batch of signed transactions, wait for finalizing of last transaction */
export const sendSignedTransactions = async (
  params: SendSignedTransactionsParams
) => {
  const { transactions, connection, fallbackConnection, successMessage } =
    params

  for (let i = 0; i < transactions.length; i += 1) {
    const signedTransaction = transactions[i]
    const isLastTransaction = i === transactions.length - 1

    // send transaction and wait 1s before sending next
    const result = await sendSignedSignleTransaction({
      transaction: signedTransaction,
      timeout: 30_000,
      successMessage: isLastTransaction ? successMessage : '',
      connection,
      fallbackConnection,
    })

    if (result.status !== SendTransactionStatus.CONFIRMED) {
      return resposneToStatus(result)
    }
  }

  return 'success'
}
