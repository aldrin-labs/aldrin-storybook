import { sendSignedSignleTransaction as sendSingle } from '@core/solana'

import { getNotifier } from './notifier'
import { SendSignedTransactionParams } from './types'

export const sendSignedSignleTransaction = async (
  params: SendSignedTransactionParams
) => {
  const { successMessage = 'Transaction confirmed' } = params

  const messages = {
    confirming: 'Confirming transaction...',
    confirmed: successMessage,
    failed: 'Operation failed',
  }

  const onStatusChange = params.onStatusChange || getNotifier(messages)

  return sendSingle({
    ...params,
    onStatusChange,
  })
}
