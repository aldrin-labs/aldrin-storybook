import { Connection } from '@solana/web3.js'

import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { TWAMM_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { WalletAdapter } from '../types'
import { loadOrdersArrayForTwamm } from './loadOrdersArrayForTwamm'
import { TwammOrder } from './types'

export const getParsedRunningOrders = async ({
  connection,
  wallet,
}: {
  connection: Connection
  wallet: WalletAdapter
}): Promise<TwammOrder[]> => {
  const orders = await loadOrdersArrayForTwamm({
    connection,
  })

  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: TWAMM_PROGRAM_ADDRESS,
  })

  const OrdersArray = orders.map((orderArray) => {
    const data = Buffer.from(orderArray.account.data)
    const orderArrayData = program.coder.accounts.decode('OrderArray', data)

    console.log('orderArrayData', orderArrayData)

    const parsedOrdersData = orderArrayData.orders
      .map((order, orderIndex) => {
        return {
          index: orderIndex,
          isInitialized: order.isInitialized,
          startTime: order.startTime.toNumber(),
          endTime: order.endTime.toNumber(),
          amountFilled: order.amountFilled.toNumber(),
          amountToFill: order.amountToFill.toNumber(),
          amount: order.amount.toNumber(),
          tokensSwapped: order.tokensSwapped.toNumber(),
          // orderArray data
          orderArrayPublicKey: orderArray.pubkey.toString(),
          side: orderArrayData.side,
          twammFromTokenVault: orderArrayData.twammFromTokenVault.toString(),
          twammToTokenVault: orderArrayData.twammToTokenVault.toString(),
          pair: orderArrayData.pairSettings.toString(),
          signer: order.authority.toString(),
        }
      })
      .filter((order) => order.isInitialized)

    return parsedOrdersData
  })

  return OrdersArray
}
