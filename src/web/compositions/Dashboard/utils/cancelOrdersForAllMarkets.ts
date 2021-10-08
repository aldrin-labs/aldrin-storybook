import { sendTransaction } from '@sb/dexUtils/send'
import { WalletAdapter } from '@sb/dexUtils/types'
import { Connection, Transaction } from '@solana/web3.js'
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
  let transaction = new Transaction()
  let count = 0

  for (const order of orders) {
    transaction.add(
      order.market.makeCancelOrderInstruction(
        connection,
        wallet.publicKey,
        order
      )
    )
    count++
    if (count % 10 === 0) {
      await sendTransaction({
        transaction,
        wallet,
        connection,
        signers: [],
        sendingMessage: 'Sending cancel...',
        operationType: 'cancelAll',
      })
      transaction = new Transaction()
    }
  }

  if (transaction.instructions.length > 0) {
    await sendTransaction({
      transaction,
      wallet,
      connection,
      signers: [],
      sendingMessage: 'Sending cancel...',
      operationType: 'cancelAll',
    })
  }
}
