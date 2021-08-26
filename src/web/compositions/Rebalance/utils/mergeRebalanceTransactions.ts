import { TransactionType } from '../Rebalance.types'

export const mergeRebalanceTransactions = (transactions: TransactionType[]) => {
  let mergedTransactions: TransactionType[] = []

  transactions.forEach((transactionToMerge) => {
    const sameTransactionIndex = mergedTransactions.findIndex(
      (transactionToMergeWith) =>
        transactionToMergeWith.depthLevel === transactionToMerge.depthLevel &&
        transactionToMergeWith.side === transactionToMerge.side &&
        transactionToMergeWith.tokenA === transactionToMerge.tokenA &&
        transactionToMergeWith.tokenB === transactionToMerge.tokenB
    )

    const isTransactionCanBeMerged = sameTransactionIndex !== -1

    if (isTransactionCanBeMerged) {
      const transactionToMergeWith = mergedTransactions[sameTransactionIndex]
      
      const amount = transactionToMergeWith.amount + transactionToMerge.amount
      const total = transactionToMergeWith.total + transactionToMerge.total
      const price = (transactionToMergeWith.price + transactionToMerge.price) / 2
      const feeUSD = transactionToMergeWith.feeUSD + transactionToMerge.feeUSD
      const openOrdersAccount =
      transactionToMergeWith.openOrders.length === 0
        ? []
        : transactionToMerge.openOrders

      const mergedTransaction = { ...transactionToMergeWith, amount, total, price, openOrdersAccount, feeUSD }

      mergedTransactions = [
        ...mergedTransactions.slice(0, sameTransactionIndex),
        mergedTransaction,
        ...mergedTransactions.slice(sameTransactionIndex + 1),
      ]
    } else {
      mergedTransactions.push(transactionToMerge)
    }
  })

  return mergedTransactions
}
