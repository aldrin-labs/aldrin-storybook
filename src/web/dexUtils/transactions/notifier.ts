import SnackbarUtils from '@sb/utils/SnackbarUtils'

import { OnStatusChangeParams, SendTransactionDetails } from '@core/solana'

import { notify } from '../notifications'

interface NotificationMessages {
  [status: string]: string | [string, string]
}
export const getNotifier =
  (messages: NotificationMessages) => (status: OnStatusChangeParams) => {
    const { status: txStatus, details, type, persist, transactionId } = status

    const notificationMessage = messages[txStatus]

    if (notificationMessage) {
      const message = Array.isArray(notificationMessage)
        ? notificationMessage[0]
        : notificationMessage

      let description = Array.isArray(notificationMessage)
        ? notificationMessage[1]
        : undefined

      if (details?.includes(SendTransactionDetails.TIMEOUT)) {
        description = 'Transaction confirmation timeout. Try again later.'
      } else if (details?.includes(SendTransactionDetails.NOT_ENOUGH_SOL)) {
        description = 'Not enough SOL. Please top up you balance.'
      }

      if (message) {
        const key = notify({
          message,
          description,
          type,
          txid: transactionId,
          persist,
        })

        if (persist) {
          return () => SnackbarUtils.close(key)
        }
      }
    }

    return undefined
  }
