import { notify } from '../notifications'
import { DEFAULT_CONFIRMATION_TIMEOUT } from './constants'
import {
  AsyncSendSignedTransactionResult,
  SendSignedTransactionParams,
} from './types'
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

  const txId = await connection.sendRawTransaction(rawTransaction, {
    skipPreflight,
  })

  const message = Array.isArray(sentMessage) ? sentMessage[0] : sentMessage
  const description = Array.isArray(sentMessage) ? sentMessage[1] : undefined

  if (showNotification) {
    notify({
      message,
      description,
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
    const smessage = Array.isArray(successMessage)
      ? successMessage[0]
      : successMessage
    const sdescription = Array.isArray(successMessage)
      ? successMessage[1]
      : undefined

    notify({
      message: smessage,
      description: sdescription,
      type: 'success',
      txid: txId,
    })
  }

  console.log(
    'Confirmation time: ',
    txId,
    confirmationResult,
    `${Date.now() - startTime}ms`
  )

  return confirmationResult
}
