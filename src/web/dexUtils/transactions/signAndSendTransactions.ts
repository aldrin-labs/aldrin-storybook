import { sendSignedTransactions } from '.'
import { SendTransactionsParams } from './types'

export const signAndSendTransactions = async (
  params: SendTransactionsParams
) => {
  const {
    transactionsAndSigners: transactionAndSigners,
    connection,
    wallet,
    focusPopup = true,
    sentMessage,
    successMessage,
    commitment,
  } = params
  const recentHash = (
    await connection.getConnection().getRecentBlockhash('max')
  ).blockhash

  if (!wallet.publicKey) {
    throw new Error('no Public key for wallet')
  }
  const walletPk = wallet.publicKey

  const processedTransactions = transactionAndSigners.map((t) => {
    const { transaction, signers } = t

    transaction.feePayer = walletPk
    transaction.recentBlockhash = recentHash

    if (signers.length > 0) {
      transaction.partialSign(...signers)
    }

    return transaction
  })

  try {
    const signedTransactions = await wallet.signAllTransactions(
      processedTransactions,
      focusPopup
    )
    // Return focus
    window.focus()

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
