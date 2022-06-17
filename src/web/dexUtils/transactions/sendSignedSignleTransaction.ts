import SnackbarUtils from '@sb/utils/SnackbarUtils'

import { notify } from '../notifications'
import { AsyncSendSignedTransactionResult } from '../types'
import { DEFAULT_CONFIRMATION_TIMEOUT } from './constants'
import {
  SignAndSendTransactionResult,
  SendSignedTransactionParams,
} from './types'
import { waitTransactionConfirmation } from './waitTransactionConfirmation'

const INSUFFICIENT_BALANCE_LOG = 'insufficient lamports'

export const sendSignedSignleTransactionRaw = async (
  params: SendSignedTransactionParams
): Promise<[string, SignAndSendTransactionResult]> => {
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

  let awaitConfirmationNotificationKey = null

  if (showNotification) {
    awaitConfirmationNotificationKey = notify({
      message: 'Confirming transaction',
      type: 'loading',
      txid: txId,
      persist: true,
    })
  }

  console.log('Started awaiting confirmation for', txId)

  const confirmationResult = await waitTransactionConfirmation({
    txId,
    connection,
    timeout,
    commitment,
  })

  if (awaitConfirmationNotificationKey) {
    SnackbarUtils.close(awaitConfirmationNotificationKey)
  }

  if (confirmationResult === 'failed') {
    try {
      const transactionDetails = await connection.getParsedConfirmedTransaction(
        txId
      )

      const hasInsufficientSolError =
        transactionDetails?.meta?.logMessages?.find((msg) =>
          msg.toLowerCase().includes(INSUFFICIENT_BALANCE_LOG)
        )
      if (hasInsufficientSolError) {
        notify({
          message: 'Not enough SOL',
          description:
            'Please make sure you have SOL to complete the transaction',
          type: 'error',
        })
      }
    } catch (e) {
      console.warn('Unable to parse transaction logs: ', e)
      return [txId, 'failed']
    }
  }

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

  return [txId, confirmationResult]
}

export const sendSignedSignleTransaction = async (
  params: SendSignedTransactionParams
): AsyncSendSignedTransactionResult => {
  const [_txId, confirmationResult] = await sendSignedSignleTransactionRaw(
    params
  )
  return confirmationResult
}
