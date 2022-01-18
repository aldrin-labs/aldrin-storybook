import {
  sendSignedSignleTransaction as sendSingle,
  SendTransactionStatus,
} from '@core/solana/transactions'

import { notify } from '../notifications'
import {
  AsyncSendSignedTransactionResult,
  SendSignedTransactionParams,
} from './types'

export const sendSignedSignleTransaction = async (
  params: SendSignedTransactionParams
): AsyncSendSignedTransactionResult => {
  const {
    sentMessage = 'Transaction sent',
    successMessage = 'Transaction confirmed',
    showNotification = true,
  } = params

  const notifier = (status: SendTransactionStatus, txId?: string) => {
    if (showNotification) {
      if (status === 'sent') {
        const message = Array.isArray(sentMessage)
          ? sentMessage[0]
          : sentMessage
        const description = Array.isArray(sentMessage)
          ? sentMessage[1]
          : undefined

        if (showNotification) {
          notify({
            message,
            description,
            type: 'success',
            txid: txId,
          })
        }
      } else if (status === 'success') {
        const message = Array.isArray(successMessage)
          ? successMessage[0]
          : successMessage
        const description = Array.isArray(successMessage)
          ? successMessage[1]
          : undefined

        if (showNotification) {
          notify({
            message,
            description,
            type: 'success',
            txid: txId,
          })
        }
      }
    }
  }

  return sendSingle({
    ...params,
    onStatusChange: notifier,
  })
}
