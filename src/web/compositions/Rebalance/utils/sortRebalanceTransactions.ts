import { TransactionType } from "../Rebalance.types"

export const sortRebalanceTransactions = (transactions: TransactionType[]) => {
  // sell, then buy transactions
  const sortedRebalanceTransactions = transactions.sort((a, b) => {
    if (a.side === 'sell' && b.side === 'sell') return 0
    if (a.side === 'sell') return -1
    return 1
  })

  return sortedRebalanceTransactions
}