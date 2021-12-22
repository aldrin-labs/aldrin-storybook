import { Connection, Transaction } from '@solana/web3.js'

import { WalletAdapter } from '@sb/dexUtils/types'

import { getNotificationText } from '../../../dexUtils/serum'
import { signAndSendTransactions } from '../../../dexUtils/transactions'
import { splitBy } from '../../../utils'
import { OrderWithMarket } from './getOpenOrdersFromOrderbooks'

export const cancelOrdersForAllMarkets = async ({
  wallet,
  connection,
  orders,
}: {
  wallet: WalletAdapter
  connection: Connection
  orders: OrderWithMarket[]
}) => {
  console.log('orders:', orders, splitBy(orders, 10))
  const transactions = splitBy(orders, 10).map((ordersChunk) => {
    const tx = new Transaction()
    ordersChunk.forEach((order) =>
      tx.add(
        order.market.makeCancelOrderInstruction(
          connection,
          wallet.publicKey,
          order
        )
      )
    )
    return tx
  })

  console.log('transactions: ', transactions)

  return signAndSendTransactions({
    transactions: transactions.map((tx) => ({ transaction: tx, signers: [] })),
    wallet,
    connection,
    successMessage: getNotificationText({
      operationType: 'cancelAll',
    }),
  })
}
