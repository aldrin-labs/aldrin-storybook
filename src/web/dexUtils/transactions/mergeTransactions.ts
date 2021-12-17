import { Transaction } from '@solana/web3.js'

export function mergeTransactions(transactions: Transaction[]) {
  const transaction = new Transaction()
  transactions.forEach((t) => {
    if (t) {
      transaction.add(t)
    }
  })
  return transaction
}
