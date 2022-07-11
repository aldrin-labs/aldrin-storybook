import { SendTransactionStatus, signTransactions } from '@core/solana'

import { sendSignedTransactions } from '.'
import { getNotifier } from './notifier'
import { SendTransactionsParams } from './types'

const defaultMessages = {
  pending_sign: [
    'Transaction',
    'Transaction pending confirmation in wallet...',
  ],
}

export const signAndSendTransactions = async (
  params: SendTransactionsParams
) => {
  const {
    transactionsAndSigners,
    connection,
    wallet,
    successMessage,
    messages = defaultMessages,
    commitment,
  } = params

  try {
    const clearPendingSignNotification = getNotifier(messages)({
      status: SendTransactionStatus.PENDING_SIGN,
      persist: true,
    })

    const signedTransactions = await signTransactions(
      transactionsAndSigners,
      connection,
      wallet
    )

    await clearPendingSignNotification()

    return await sendSignedTransactions(signedTransactions, connection, {
      successMessage,
      commitment,
    })
  } catch (e: any) {
    return `${e?.message.toString()}`.includes('cancelled')
      ? 'cancelled'
      : 'failed'
  }
}
