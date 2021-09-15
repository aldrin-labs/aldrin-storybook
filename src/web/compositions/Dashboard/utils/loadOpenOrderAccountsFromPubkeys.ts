import { sleep } from '@core/utils/helpers'
import { Connection, PublicKey } from '@solana/web3.js'
import { OpenOrders } from '@project-serum/serum'
import { DEX_PID } from '@core/config/dex'

export const loadOpenOrderAccountsFromPubkeys = async ({
  connection,
  openOrdersAccountsPubkeys,
}: {
  connection: Connection
  openOrdersAccountsPubkeys: PublicKey[]
}): Promise<OpenOrders[]> => {
  const updatedOpenOrdersAccounts: OpenOrders[] = []
  let i = 0

  console.time('updateOpenOrdersAccounts')

  for (let openOrdersAccountPubkey of openOrdersAccountsPubkeys) {
    const openOrdersAccountInfo = await connection.getAccountInfo(
      openOrdersAccountPubkey
    )

    if (!openOrdersAccountInfo) continue

    const openOrdersAccount = OpenOrders.fromAccountInfo(
      openOrdersAccountPubkey,
      openOrdersAccountInfo,
      DEX_PID
    )

    updatedOpenOrdersAccounts.push(openOrdersAccount)

    if (i % 4 === 0) await sleep(1 * 1000)

    i++
  }

  console.timeEnd('updateOpenOrdersAccounts')

  return updatedOpenOrdersAccounts
}
