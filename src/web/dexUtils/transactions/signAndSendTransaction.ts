import { SendTransactionParams } from './types'
import { sendSignedTransaction } from './sendSignedTransaction'

export const signAndSendTransaction = async (params: SendTransactionParams) => {
  const {
    transaction,
    connection,
    wallet,
    signers = [],
    focusPopup = true,
    commitment = 'finalized',
  } = params

  transaction.recentBlockhash = (
    await connection.getConnection().getRecentBlockhash('max')
  ).blockhash

  console.log('signers', signers, wallet)

  if (!wallet.publicKey) {
    throw new Error(`No publicKey for wallet: ${wallet}`)
  }

  transaction.feePayer = wallet.publicKey

  if (signers.length > 0) {
    transaction.partialSign(...signers)
  }

  const signedTransaction = await wallet.signTransaction(
    transaction,
    focusPopup
  )
  // Return focus
  window.focus()

  return sendSignedTransaction({
    ...params,
    transaction: signedTransaction,
    commitment,
  })
}
