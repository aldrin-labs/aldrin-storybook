import { signTransactions } from '@core/solana'

import { sendSignedTransactions } from '.'
import { SendTransactionsParams } from './types'

export const signAndSendTransactions = async (
  params: SendTransactionsParams
) => {
  const {
    transactionsAndSigners,
    connection,
    fallbackConnection,
    wallet,
    focusPopup,
    successMessage,
    commitment,
  } = params

  try {
    const signedTransactions = await signTransactions(
      transactionsAndSigners,
      connection,
      wallet,
      focusPopup
    )

    return await sendSignedTransactions({
      transactions: signedTransactions,
      connection,
      fallbackConnection,
      successMessage,
      commitment,
    })
  } catch (e: any) {
    return e.message || e || 'failed'
  }
}
