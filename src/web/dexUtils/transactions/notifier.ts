import { SendSignedTransactionResponse } from '@core/solana'

import { notify } from '../notifications'

interface NotificationMessages {
  [status: string]: string | [string, string]
}
export const getNotifier =
  (messages: NotificationMessages) =>
  (status: SendSignedTransactionResponse) => {
    const notificationMessage = messages[status.status]

    if (notificationMessage) {
      const message = Array.isArray(notificationMessage)
        ? notificationMessage[0]
        : notificationMessage
      const description = Array.isArray(notificationMessage)
        ? notificationMessage[1]
        : undefined

      if (message) {
        notify({
          message,
          description,
          type: 'success',
          txid: status.transactionId,
        })
      }
    }
  }
