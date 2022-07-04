import { sendSignedSignleTransaction as sendSingle } from '@core/solana'

import { getNotifier } from './notifier'
import { SendSignedTransactionParams } from './types'

export const sendSignedSignleTransaction = async (
  params: SendSignedTransactionParams
) => {
  const { successMessage = 'Transaction confirmed' } = params

  const messages = {
    sent: 'Transaction sent',
    confirmed: successMessage,
    failed: 'Operation failed',
  }

  return sendSingle({
    ...params,
    onStatusChange: (response) => {
      console.log('debug response', response)

      const notifier = getNotifier(messages)
      notifier(response)
    },
  })
}
