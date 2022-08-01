import { signAndSendTransactions } from './signAndSendTransactions'
import { SendTransactionParams } from './types'

export const signAndSendSingleTransaction = async (
  params: SendTransactionParams
) => {
  const {
    transaction,
    connection,
    wallet,
    signers = [],
    focusPopup = true,
    sentMessage,
    successMessage,
    commitment,
  } = params

  return signAndSendTransactions({
    transactionsAndSigners: [{ transaction, signers }],
    wallet,
    focusPopup,
    connection,
    sentMessage,
    successMessage,
    commitment,
  })
}
