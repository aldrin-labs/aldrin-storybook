import { Connection } from '@solana/web3.js'

import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { TWAMM_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { WalletAdapter } from '../types'
import { loadOrdersArrayForTwamm } from './loadOrdersArrayForTwamm'

export const getParsedRunningOrders = async ({
  connection,
  wallet,
}: {
  connection: Connection
  wallet: WalletAdapter
}) => {
  const orders = await loadOrdersArrayForTwamm({
    connection,
  })

  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: TWAMM_PROGRAM_ADDRESS,
  })

  const OrdersArray = orders.map((order) => {
    const data = Buffer.from(order.account.data)
    const ordersData = program.coder.accounts.decode('OrderArray', data)

    console.log('data', ordersData, data)

    // const parsedSnapshotData: Snapshot[] = snapshotQueueData.snapshots
    //   .map((el) => {
    //     return {
    //       time: el.time.toNumber(),
    //       isInitialized: el.isInitialized,
    //       tokensFrozen: parseFloat(el?.tokensFrozen?.toString()),
    //       tokensTotal: parseFloat(el?.farmingTokens?.toString()),
    //     }
    //   })
    //   .filter((snapshot) => snapshot.isInitialized)

    return {}
  })

  return OrdersArray
}
