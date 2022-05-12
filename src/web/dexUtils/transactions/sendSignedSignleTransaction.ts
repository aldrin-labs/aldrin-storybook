import {
  sendSignedSignleTransaction as sendSingle,
  AsyncSendSignedTransactionResult,
} from '@core/solana'

import { getNotifier } from './notifier'
import { SendSignedTransactionParams } from './types'

export const sendSignedSignleTransaction = async (
  params: SendSignedTransactionParams
): AsyncSendSignedTransactionResult => {
  const { successMessage = 'Transaction confirmed' } = params

  const messages = {
    sent: 'Transaction sent',
    success: successMessage,
  }

  return sendSingle({
    ...params,
    onStatusChange: getNotifier(messages),
  })
}
