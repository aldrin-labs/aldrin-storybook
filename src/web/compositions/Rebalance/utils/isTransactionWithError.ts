import { TransactionType } from '../Rebalance.types'

export const isTransactionWithError = (transaction: TransactionType) =>
  transaction.isNotEnoughLiquidity || transaction.amount === 0
