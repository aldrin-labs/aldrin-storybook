import { getNotificationText } from '.'
import { signAndSendTransaction } from '../transactions'
import { CancelOrderParams } from './types'

export async function cancelOrder(params: CancelOrderParams) {
  const { market, wallet, connection, order } = params
  if (!wallet.publicKey) {
    throw new Error(`cancelOrders: no publicKey for wallet: ${wallet}`)
  }
  const { publicKey } = wallet
  const transaction = market.makeMatchOrdersTransaction(5)

  transaction.add(
    market.makeCancelOrderInstruction(connection, publicKey, order)
  )

  transaction.add(market.makeMatchOrdersTransaction(5))

  return signAndSendTransaction({
    transaction,
    wallet,
    connection,
    successMessage: getNotificationText({
      baseSymbol: order.marketName.split('/')[0],
      quoteSymbol: order.marketName.split('/')[1],
      side: order.side,
      amount: order.size,
      price: order.price,
      operationType: 'cancelOrder',
    }),
  })
}
