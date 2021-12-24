import {
  Commitment,
  Connection,
  SignatureResult,
  SignatureStatus,
} from '@solana/web3.js'
import { Metrics } from '@core/utils/metrics'
import { WaitConfirmationParams } from './types'
import { getProviderNameFromUrl } from '../connection'
import MultiEndpointsConnection from '../MultiEndpointsConnection'
import { sleep } from '../utils'

/**
 * Promisify timeout, add cancel function
 *
 * @returns [Promise, CancelFunction]
 *  */
const timeoutPromise = (
  timeout: number
): [Promise<'timeout'>, (reason?: any) => void] => {
  let timeoutId: any
  const promise = new Promise<'timeout'>((resolve, reject) => {
    timeoutId = setTimeout(() => {
      resolve('timeout')
    }, timeout)
  })

  const canceler = () => {
    clearTimeout(timeoutId)
  }
  return [promise, canceler]
}

/**
 * Promisify connection.onSignature, add cancel function
 * @returns [Promise, CancelFunction]
 */
const onSignature = (
  txId: string,
  connection: Connection,
  commitment: Commitment
): [Promise<SignatureResult>, (reason?: any) => void] => {
  let subId: number
  // let rejectFn: (reason?: any) => void

  const promise = new Promise<SignatureResult>((resolve, reject) => {
    subId = connection.onSignature(
      txId,
      (sigResult) => {
        console.log('WS confirmed', txId, sigResult)
        if (sigResult.err) {
          reject(sigResult.err)
        } else {
          resolve(sigResult)
        }
      },
      commitment
    )
  })

  const canceler = async () => {
    try {
      await connection.removeSignatureListener(subId)
    } catch (e) {
      // Usually it's failed because subscription already removed by connection - do nothing
    }
  }

  return [promise, canceler]
}

const CONFIRMATION_STATUSES: Commitment[] = [
  'processed',
  'confirmed',
  'finalized',
]

const pollTransactionStatus = (
  txId: string,
  connection: MultiEndpointsConnection,
  commitment: Commitment,
  pollInterval: number,
  timeout: number
): [Promise<SignatureStatus>, (reason?: any) => void] => {
  let done = false
  let timeoutId: any

  const buildPromise = async (): Promise<SignatureStatus> => {
    timeoutId = setTimeout(() => {
      done = true
    }, timeout)

    try {
      while (!done) {
        // eslint-disable-next-line no-await-in-loop
        await sleep(pollInterval)
        // eslint-disable-next-line no-await-in-loop
        const sigResult = await connection
          .getConnection()
          .getSignatureStatus(txId)

        console.log(`Tx ${txId} status: `, sigResult.value)
        if (!done) {
          if (sigResult.value?.err) {
            console.warn(
              `Error transaction ${txId} confirmation: `,
              sigResult.value.err
            )
            done = true
            throw new Error('failed')
          }
          if (sigResult.value) {
            if (CONFIRMATION_STATUSES.includes(commitment)) {
              // Finalized transactions
              if (sigResult.value.confirmationStatus === commitment) {
                done = true
                return sigResult.value
              }
            } else if (sigResult.value.confirmations) {
              // Finish loop after tx confirmation
              done = true
              return sigResult.value
            }
          }
        }
      }
    } catch (e) {
      console.warn(`Failed to fetch transaction ${txId}  status:`, e)
      throw e
    }

    throw new Error('failed')
  }

  const canceler = () => {
    clearTimeout(timeoutId)
    done = true
  }

  return [buildPromise(), canceler]
}

export const waitTransactionConfirmation = async (
  params: WaitConfirmationParams
) => {
  const {
    txId,
    timeout = 60_000, // 1 minute
    connection,
    pollInterval = 1200, // TODO: add polling
    commitment = 'recent',
  } = params
  // const done = false

  const rawConnection = connection.getConnection()

  const [wsPromise, wsCancel] = onSignature(
    txId,
    rawConnection,
    commitment
  )
  const [tPromise, timeoutCanceler] = timeoutPromise(timeout)
  const [pollPromise, pollCancell] = pollTransactionStatus(
    txId,
    connection,
    commitment,
    pollInterval,
    timeout
  )

  const cancelAll = () => {
    timeoutCanceler()
    wsCancel()
    pollCancell()
  }

  try {
    const result = await Promise.race([tPromise, pollPromise, wsPromise])
    console.log(`Transaction ${txId} confirmation result: `, result)
    if (result === 'timeout') {
      cancelAll()
      const rpcProvider = getProviderNameFromUrl({ rawConnection })
      Metrics.sendMetrics({
        metricName: `error.rpc.${rpcProvider}.timeoutConfirmationTransaction`,
      })

      // Polling retry
      try {
        const [polling2] = pollTransactionStatus(
          txId,
          connection,
          commitment,
          pollInterval * 2,
          timeout
        )
        await polling2
      } catch (e) {
        Metrics.sendMetrics({
          metricName: `error.rpc.${rpcProvider}.secondTimeoutConfirmationTransaction`,
        })
        return 'timeout'
      }
    } else if (result.err) {
      console.warn(`Transaction ${txId} not confirmed: `, result.err)
      return 'failed'
    }
  } catch (e) {
    cancelAll()
    console.error(`Error awaiting transaction ${txId} confirmation: `, e)
    const rpcProvider = getProviderNameFromUrl({
      rawConnection,
    })
    Metrics.sendMetrics({
      metricName: `error.rpc.${rpcProvider}.connectionError-${JSON.stringify(
        e
      )}`,
    })
    return 'failed'
  }
  cancelAll()

  return 'success'
}
