import SnackbarUtils from '@sb/utils/SnackbarUtils'

import { SendTransactionStatus } from '@core/solana'

import { notify } from '../notifications'

interface NotificationMessages {
  [status: string]: string | [string, string]
}
export const getNotifier =
  (messages: NotificationMessages) =>
  ({
    status,
    txId,
    type = 'success',
    persist = false,
  }: {
    status: SendTransactionStatus
    txId?: string
    type?: string
    persist?: boolean
  }) => {
    const notificationMessage = messages[status]

    if (notificationMessage) {
      const message = Array.isArray(notificationMessage)
        ? notificationMessage[0]
        : notificationMessage

      const description = Array.isArray(notificationMessage)
        ? notificationMessage[1]
        : undefined

      if (message) {
        const notifyKey = notify({
          message,
          description,
          type,
          txid: txId,
          persist,
        })

        return () => SnackbarUtils.close(notifyKey)
      }
    }

    return null
  }
