import { Transaction } from '@solana/web3.js'

import { WithStatusChange } from '@core/solana/transactions/types.ts'

import {
  AldrinConnection,
  SendTransactionStatus,
  SendSignedTransactionResponse,
} from '@core/solana'

import { sendSignedSignleTransaction } from './sendSignedSignleTransaction'
import { NotificationParams, TransactionParams } from './types'

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
  transactions: Transaction[],
  connection: AldrinConnection,
  params: TransactionParams & WithStatusChange & NotificationParams = {}
) => {
  const { successMessage, onStatusChange } = params

  for (let i = 0; i < transactions.length; i += 1) {
    const signedTransaction = transactions[i]
    const isLastTransaction = i === transactions.length - 1

    // send transaction and wait 1s before sending next
    const result = await sendSignedSignleTransaction({
      transaction: signedTransaction,
      timeout: 30_000,
      successMessage: isLastTransaction ? successMessage : '',
      connection,
      onStatusChange,
    })

    if (result.status !== SendTransactionStatus.CONFIRMED) {
      return resposneToStatus(result)
    }
  }

  return 'success'
}
