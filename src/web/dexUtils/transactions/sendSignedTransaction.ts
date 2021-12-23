import { notify } from '../notifications'
import {
  AsyncSendSignedTransactionResult,
  SendSignedTransactionParams,
} from './types'
import { DEFAULT_CONFIRMATION_TIMEOUT } from './constants'
import { waitTransactionConfirmation } from './waitTransactionConfirmation'

export const sendSignedTransaction = async (
  params: SendSignedTransactionParams
): AsyncSendSignedTransactionResult => {
  const {
    connection,
    transaction,
    sentMessage = 'Transaction sent',
    successMessage = 'Transaction confirmed',
    timeout = DEFAULT_CONFIRMATION_TIMEOUT,
    showNotification = true,
    skipPreflight = true,
    commitment,
  } = params

  const rawTransaction = transaction.serialize()

  const startTime = Date.now()

  const txId = await connection
    .getConnection()
    .sendRawTransaction(rawTransaction, {
      skipPreflight,
    })

  if (showNotification) {
    notify({
      message: sentMessage,
      type: 'success',
      txid: txId,
    })
  }

  console.log('Started awaiting confirmation for', txId)
  const confirmationResult = await waitTransactionConfirmation({
    txId,
    connection,
    timeout,
    commitment,
  })

  if (confirmationResult === 'success') {
    notify({ message: successMessage, type: 'success', txid: txId })
  }

  console.log('Confirmation time: ', txId, `${Date.now() - startTime}ms`)

  return confirmationResult
}
