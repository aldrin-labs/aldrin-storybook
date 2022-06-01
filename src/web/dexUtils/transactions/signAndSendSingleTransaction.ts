import { signAndSendTransactions } from './signAndSendTransactions'
import { SendTransactionParams } from './types'

export const signAndSendSingleTransaction = async (
  params: SendTransactionParams
) => {
  const {
    transaction,
    connection,
    fallbackConnection,
    wallet,
    signers = [],
    focusPopup = true,
    sentMessage,
    successMessage,
    commitment,
  } = params

  const result = await signAndSendTransactions({
    transactionsAndSigners: [{ transaction, signers }],
    wallet,
    focusPopup,
    connection,
    fallbackConnection,
    sentMessage,
    successMessage,
    commitment,
  })

  return result
}
