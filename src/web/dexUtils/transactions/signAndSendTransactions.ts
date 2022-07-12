import { signTransactions } from '@core/solana'

import { sendSignedTransactions } from '.'
import { SendTransactionsParams } from './types'

export const signAndSendTransactions = async (
  params: SendTransactionsParams
) => {
  const {
    transactionsAndSigners,
    connection,
    wallet,
    successMessage,
    commitment,
  } = params

  try {
    const signedTransactions = await signTransactions(
      transactionsAndSigners,
      connection,
      wallet
    )

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
