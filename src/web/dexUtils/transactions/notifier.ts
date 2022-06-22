import SnackbarUtils from '@sb/utils/SnackbarUtils'

import { onStatusChangeParams } from '@core/solana'

import { notify } from '../notifications'

interface NotificationMessages {
  [status: string]: string | [string, string]
}

export const getNotifier =
  (messages: NotificationMessages) =>
  (params: onStatusChangeParams): (() => void) | undefined => {
    const { status, txId, type = 'success', persist = false } = params
    const notificationMessage = messages[status]

    if (notificationMessage) {
      const message = Array.isArray(notificationMessage)
        ? notificationMessage[0]
        : notificationMessage

      const description = Array.isArray(notificationMessage)
        ? notificationMessage[1]
        : undefined

      if (message) {
        const key = notify({
          message,
          description,
          type,
          txid: txId,
          persist,
        })

        return () => SnackbarUtils.close(key)
      }
    }

    return undefined
  }
