import { SendTransactionStatus } from '@core/solana'

import { notify } from '../notifications'

interface NotificationMessages {
  [status: string]: string | [string, string]
}
export const getNotifier =
  (messages: NotificationMessages) =>
  (status: SendTransactionStatus, txId?: string) => {
    const notificationMessage = messages[status]

    if (notificationMessage) {
      const message = Array.isArray(notificationMessage)
        ? notificationMessage[0]
        : notificationMessage
      const description = Array.isArray(notificationMessage)
        ? notificationMessage[1]
        : undefined

      notify({
        message,
        description,
        type: 'success',
        txid: txId,
      })
    }
  }
