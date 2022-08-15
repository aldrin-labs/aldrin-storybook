import SnackbarUtils from '@sb/utils/SnackbarUtils'

import { onStatusChangeParams, SendTransactionDetails } from '@core/solana'

import { notify } from '../notifications'
import { NotificationParams } from './types'

type NotifierMessages = NotificationParams['messages']

export const getNotifier =
  (messages: NotifierMessages) => (status: onStatusChangeParams) => {
    const { type, transactionId, status: transactionStatus, persist } = status

    if (!messages || !messages[transactionStatus]) {
      console.error(
        'no messages for getNotifier or no message for status',
        transactionStatus
      )
      return () => {}
    }

    const notificationMessage = messages[transactionStatus]

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

    const key = notify({
      type,
      persist,
      message,
      description,
      txid: transactionId,
    })

    return () => SnackbarUtils.close(key)
  }
