import { Transaction } from '@solana/web3.js'
import MultiEndpointsConnection from '../MultiEndpointsConnection'
import { sendSignedTransaction } from './sendSignedTransaction'

/** Send batch of signed transactions, wait for finalizing of last transaction */
export const sendSignedTransactions = async (
  transactions: Transaction[],
  connection: MultiEndpointsConnection
) => {
  for (let i = 0; i < transactions.length; i += 1) {
    const signedTransaction = transactions[i]
    // send transaction and wait 1s before sending next
    // eslint-disable-next-line no-await-in-loop
    const result = await sendSignedTransaction({
      transaction: signedTransaction,
      connection,
      timeout: 30_000,
      commitment: i === transactions.length - 1 ? 'finalized' : 'recent', // Wait for finalization of last transaction
    })

    if (result !== 'success') {
      return result
    }
  }

  return 'success'
}
