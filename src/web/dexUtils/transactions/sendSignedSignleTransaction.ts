import { sendSignedSignleTransaction as sendSingle } from '@core/solana'

import { getNotifier } from './notifier'
import { SendSignedTransactionParams } from './types'

export const sendSignedSignleTransaction = async (
  params: SendSignedTransactionParams
) => {
  const { successMessage = 'Transaction confirmed' } = params

  const messages = {
    initializingTx: ['Doin tx', 'Initializing a transaction...'],
    confirming: 'Confirming transaction...',
    confirmed: successMessage,
    failed: 'Operation failed',
  }

  return sendSingle({
    onStatusChange: getNotifier(messages),
    ...params,
  })
}
