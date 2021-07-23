import { Orderbooks, TransactionType } from '../Rebalance.types'

export const getPricesForTransactionsFromOrderbook = ({
  transactionsList,
  orderbooks,
}: {
  transactionsList: TransactionType[]
  orderbooks: Orderbooks
}) => {
  let orderbooksClone = { ...orderbooks }

  const rebalanceAllTransactionsPrices = transactionsList.map((transaction) => {
    const isBuy = transaction.side === 'buy'
    const obCategory = isBuy ? 'asks' : 'bids'

    const obData = orderbooksClone[transaction.symbol][obCategory]
    let obDataToModify = [...obData]

    // total for buy, amount for sell
    let tempTransactionAmount = transaction.rawAmount
    let tempTransactionTotal = transaction.rawAmount

    // amount for buy, total for sell
    const transactionValue = obData.reduce(
      (acc: number, [rowPrice, rowAmount]: [number, number]) => {
        const rowValue = isBuy ? rowAmount * rowPrice : rowAmount

        // for buy we have total - need to determine amount
        if (isBuy) {
          if (tempTransactionTotal >= rowValue) {
            obDataToModify.shift()
            tempTransactionTotal -= rowValue
            return acc + rowAmount
          } else {
            // remove part
            const transactionLeftAmount = tempTransactionTotal / rowPrice
            const amount = acc + transactionLeftAmount

            if (tempTransactionTotal > 0) {
              obDataToModify = [
                [rowPrice, rowAmount - transactionLeftAmount],
                ...obDataToModify.slice(1),
              ]
            }
            tempTransactionTotal = 0
            return amount
          }
        } else {
          // for sell we have amount - need to determine total
          if (tempTransactionAmount >= rowValue) {
            obDataToModify.shift()
            tempTransactionAmount -= rowValue
            return acc + rowAmount * rowPrice
          } else {
            const total = acc + tempTransactionAmount * rowPrice

            if (tempTransactionAmount > 0) {
              obDataToModify = [
                [rowPrice, rowAmount - tempTransactionAmount],
                ...obDataToModify.slice(1),
              ]
            }
            tempTransactionAmount = 0
            return total
          }
        }
      },
      0
    )

    orderbooksClone[transaction.symbol][obCategory] = obDataToModify

    // for sell - use amount and devide total by amount
    // for buy - use total and get amount, then devide total by amount
    const transactionPrice = isBuy
      ? transaction.rawAmount / transactionValue
      : transactionValue / transaction.rawAmount

    return {
      symbol: transaction.symbol,
      price: transactionPrice,
      notEnoughLiquidity: isBuy ? tempTransactionTotal > 0 : tempTransactionAmount > 0,
    }
  })

  return rebalanceAllTransactionsPrices
}
