import { sendSignedTransactions } from '.'
import { signTransactions } from './signTransactions'
import { SendTransactionsParams } from './types'

export const signAndSendTransactions = async (
  params: SendTransactionsParams
) => {
  const {
    transactionsAndSigners,
    connection,
    wallet,
    focusPopup,
    sentMessage,
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

    return sendSignedTransactions(signedTransactions, connection, {
      sentMessage,
      successMessage,
      commitment,
    })
  } catch (e) {
    console.warn('Error sign or send transactions:', e)
    if (e instanceof Error) {
      const errorText = e.message
      if (errorText.includes('rejected')) {
        return 'cancelled'
      }
    }
    return 'rejected'
  }
}
