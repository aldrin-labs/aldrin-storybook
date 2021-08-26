import { TransactionType } from '../Rebalance.types'

export const sortRebalanceTransactions = (transactions: TransactionType[]) => {
  const sortedRebalanceTransactions = transactions.sort((a, b) => {
    // if same depth - sell, then buy transactions
    if (a.depthLevel === b.depthLevel) {
      if (a.side === 'sell' && b.side === 'sell') return 0
      if (a.side === 'sell') return -1
      return 1
    } else { // 0 depth should go first
      return a.depthLevel - b.depthLevel
    }
  })

  return sortedRebalanceTransactions
}
