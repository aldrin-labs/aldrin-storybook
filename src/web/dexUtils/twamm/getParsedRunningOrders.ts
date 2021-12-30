import { Program, Provider } from '@project-serum/anchor'
import { Connection, PublicKey } from '@solana/web3.js'

import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { TWAMM_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { WalletAdapter } from '../types'
import { loadOrdersArrayForTwamm } from './loadOrdersArrayForTwamm'
import { TwammOrder } from './types'
import TwammProgramIdl from '@core/idls/twamm.json'


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

  const programId = new PublicKey(TWAMM_PROGRAM_ADDRESS)

  const program = new Program(
    TwammProgramIdl,
    programId,
    new Provider(connection, wallet, Provider.defaultOptions())
  )

  const OrdersArray = orders.map((orderArray) => {
    const data = Buffer.from(orderArray.account.data)
    const orderArrayData = program.coder.accounts.decode('OrderArray', data)

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
