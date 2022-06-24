import SnackbarUtils from '@sb/utils/SnackbarUtils'

import { onStatusChangeParams, SendTransactionDetails } from '@core/solana'

import { notify } from '../notifications'

interface NotificationMessages {
  [status: string]: string | [string, string]
}

export const getNotifier =
  (messages: NotificationMessages) => (status: onStatusChangeParams) => {
    const { type, transactionId, status: transactionStatus } = status
    const notificationMessage = messages[transactionStatus]

    if (notificationMessage) {
      const message = Array.isArray(notificationMessage)
        ? notificationMessage[0]
        : notificationMessage

      let description = Array.isArray(notificationMessage)
        ? notificationMessage[1]
        : undefined

      if (status.details?.includes(SendTransactionDetails.TIMEOUT)) {
        description = 'Transaction confirmation timeout. Try again later.'
      } else if (
        status.details?.includes(SendTransactionDetails.NOT_ENOUGH_SOL)
      ) {
        description = 'Not enough SOL. Please top up you balance.'
      }

      if (message) {
        const key = notify({
          type,
          message,
          description,
          txid: transactionId,
        })

        return () => SnackbarUtils.close(key)
      }
    }

    return undefined
  }
