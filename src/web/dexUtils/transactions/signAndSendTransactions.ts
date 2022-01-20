import { sendSignedTransactions, signTransactions } from '.'
import { SendTransactionsParams } from './types'

export const signAndSendTransactions = async (
  params: SendTransactionsParams
) => {
  const {
    transactionsAndSigners,
    connection,
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

    return await sendSignedTransactions(signedTransactions, connection, {
      successMessage,
      commitment,
    })
  } catch (e: any) {
    return e.message || e || 'failed'
  }
}
