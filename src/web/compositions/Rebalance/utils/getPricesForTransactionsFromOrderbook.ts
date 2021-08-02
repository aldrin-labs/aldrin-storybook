import { Orderbooks, TransactionMainData } from '../Rebalance.types'

export const getPricesForTransactionsFromOrderbook = ({
  calculateOnlyForFirstTransactions,
  transactionsList,
  orderbooks,
}: {
  calculateOnlyForFirstTransactions?: boolean
  transactionsList: TransactionMainData[]
  orderbooks: Orderbooks
}): [
  { symbol: string; price: number; notEnoughLiquidity: boolean }[],
  Orderbooks
] => {
  let orderbooksClone = { ...orderbooks }

  const rebalanceAllTransactionsPrices = transactionsList.map((transaction) => {
    const isBuy = transaction.side === 'buy'
    const orderbookSide = isBuy ? 'asks' : 'bids'

    const orderbookBySymbol = orderbooksClone[transaction.symbol]

    if (!orderbookBySymbol)
      return { price: 0, symbol: transaction.symbol, notEnoughLiquidity: true }

    const orderbookBySide = orderbookBySymbol[orderbookSide]

    if (!orderbookBySide)
      return { price: 0, symbol: transaction.symbol, notEnoughLiquidity: true }

    // delete best ask/bids because it may change quickly
    orderbookBySide.shift()

    let obDataToModify = [...orderbookBySide]

    // total for buy, amount for sell
    let tempTransactionAmount = transaction.amount
    let tempTransactionTotal = transaction.amount

    // amount for buy, total for sell
    const transactionValue = orderbookBySide.reduce(
      (acc: number, [rowPrice, rowAmount]: [number, number]) => {
        const rowValue = isBuy ? rowAmount * rowPrice : rowAmount

        // for buy we have total - need to determine amount
        if (isBuy) {
          if (tempTransactionTotal >= rowValue) {
            obDataToModify.shift()
            tempTransactionTotal -= rowValue

            console.log(
              'tempTransactionTotal full delete',
              transaction.symbol,
              tempTransactionTotal,
              rowAmount,
              rowPrice,
              acc + rowAmount
            )

            return acc + rowAmount
          } else {
            // remove part
            const transactionLeftAmount = tempTransactionTotal / rowPrice
            const amount = acc + transactionLeftAmount
            console.log(
              'tempTransactionTotal part delete',
              transaction.symbol,
              tempTransactionTotal,
              rowAmount,
              rowPrice,
              acc + transactionLeftAmount
            )

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

    orderbooksClone[transaction.symbol][orderbookSide] = obDataToModify

    console.log('obData', orderbookBySymbol)
    console.log('obDataToModify', obDataToModify)

    // for sell - use amount and devide total by amount
    // for buy - use total and get amount, then devide total by amount
    const transactionPrice = isBuy
      ? transaction.amount / transactionValue
      : transactionValue / transaction.amount

    console.log('transactionPrice', transaction.symbol, transactionPrice)
    console.log(
      'transactionValue',
      transaction.symbol,
      transactionValue,
      'transaction.amount',
      transaction.amount
    )

    return {
      symbol: transaction.symbol,
      price: transactionPrice,
      notEnoughLiquidity: isBuy
        ? tempTransactionTotal > 0
        : tempTransactionAmount > 0,
    }
  })

  return [rebalanceAllTransactionsPrices, orderbooksClone]
}
