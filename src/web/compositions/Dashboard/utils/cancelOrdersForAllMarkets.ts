import { Transaction } from '@solana/web3.js'

import MultiEndpointsConnection from '@sb/dexUtils/MultiEndpointsConnection'
import { getNotificationText } from '@sb/dexUtils/serum'
import { signAndSendTransactions } from '@sb/dexUtils/transactions'
import { WalletAdapter } from '@sb/dexUtils/types'

import { splitBy } from '../../../utils'
import { OrderWithMarket } from './getOpenOrdersFromOrderbooks'

export const cancelOrdersForAllMarkets = async ({
  wallet,
  connection,
  orders,
}: {
  wallet: WalletAdapter
  connection: MultiEndpointsConnection
  orders: OrderWithMarket[]
}) => {
  const transactions = splitBy(orders, 10).map((ordersChunk) => {
    const tx = new Transaction()
    ordersChunk.forEach((order) =>
      tx.add(
        order.market.makeCancelOrderInstruction(
          connection.getConnection(),
          wallet.publicKey,
          order
        )
      )
    )
    return tx
  })

  return signAndSendTransactions({
    transactionsAndSigners: transactions.map((tx) => ({
      transaction: tx,
      signers: [],
    })),
    wallet,
    connection,
    successMessage: getNotificationText({
      operationType: 'cancelAll',
    }),
  })
}
