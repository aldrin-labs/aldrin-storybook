import { sendSignedSignleTransaction as sendSingle } from '@core/solana'

import { SendSignedTransactionResult } from '../types'
import { getNotifier } from './notifier'
import { SendSignedTransactionParams } from './types'

export const sendSignedSignleTransaction = async (
  params: SendSignedTransactionParams
): Promise<{ result: SendSignedTransactionResult; txId?: string }> => {
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
