import { isCancelledTransactionError } from '@sb/dexUtils/common/isCancelledTransactionError'
import { TransactionAndSigner } from '@sb/dexUtils/common/types'
import { sendSignedTransaction, signTransactions } from '@sb/dexUtils/send'
import { WalletAdapter } from '@sb/dexUtils/types'
import { Connection } from '@solana/web3.js'

export const signAndSendTransaction = async ({
  wallet,
  connection,
  transactionsAndSigners,
}: {
  wallet: WalletAdapter
  connection: Connection
  transactionsAndSigners: TransactionAndSigner[]
}) => {
  try {
    const signedTransactions = await signTransactions({
      wallet,
      connection,
      transactionsAndSigners,
    })

    if (!signedTransactions) {
      return 'failed'
    }

    for (let signedTransaction of signedTransactions) {
      // send transaction and wait 1s before sending next
      const result = await sendSignedTransaction({
        transaction: signedTransaction,
        connection,
        timeout: 10_000,
      })

      if (result === 'timeout') {
        return 'blockhash_outdated'
      } else if (result === 'failed') {
        return 'failed'
      }

      // await sleep(2000)
    }
  } catch (e) {
    console.log('end farming catch error', e)

    if (isCancelledTransactionError(e)) {
      return 'cancelled'
    }
  }

  return 'success'
}
