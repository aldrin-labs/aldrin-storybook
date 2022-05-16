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
  }

  return sendSingle({
    ...params,
    onStatusChange: getNotifier(messages),
  })
}
