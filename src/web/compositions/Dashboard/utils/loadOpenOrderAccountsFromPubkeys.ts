import { Connection, PublicKey } from '@solana/web3.js'
import { OpenOrders } from '@project-serum/serum'
import { notifyForDevelop, notifyWithLog } from '@sb/dexUtils/notifications'

export const loadOpenOrderAccountsFromPubkeys = async ({
  connection,
  openOrdersAccountsPubkeys,
}: {
  connection: Connection
  openOrdersAccountsPubkeys: PublicKey[]
}): Promise<OpenOrders[]> => {
  const updatedOpenOrdersAccounts: OpenOrders[] = []
  const openOrdersAccountsAddresses = openOrdersAccountsPubkeys.map((account) =>
    account.toString()
  )

  console.time('updateOpenOrdersAccounts')

  const loadedOpenOrdersAccountsInfo = await connection._rpcRequest(
    'getMultipleAccounts',
    [openOrdersAccountsAddresses, { encoding: 'base64' }]
  )

  if (
    loadedOpenOrdersAccountsInfo.result.error ||
    !loadedOpenOrdersAccountsInfo.result.value
  ) {
    notifyWithLog({
      message:
        'Something went wrong while loading open orders accounts, please try again later.',
      result: loadedOpenOrdersAccountsInfo.result,
    })

    return updatedOpenOrdersAccounts
  }

  loadedOpenOrdersAccountsInfo.result.value.map(
    (encodedOpenOrdersAccountInfo: any, i: number) => {
      const openOrdersAccountPubkey = openOrdersAccountsPubkeys[i]
      const data = new Buffer(encodedOpenOrdersAccountInfo.data[0], 'base64')
      const programId = new PublicKey(encodedOpenOrdersAccountInfo.owner)

      const decodedByLayout = OpenOrders.getLayout(programId).decode(data)

      const openOrders = new OpenOrders(
        openOrdersAccountPubkey,
        decodedByLayout,
        programId
      )

      if (
        !openOrders ||
        !openOrders.accountFlags.initialized ||
        !openOrders.accountFlags.openOrders
      ) {
        notifyForDevelop({
          message: 'OpenOrders decoded incorrectly.',
          openOrders,
        })
        return
      }

      updatedOpenOrdersAccounts.push(openOrders)
    }
  )

  console.timeEnd('updateOpenOrdersAccounts')

  return updatedOpenOrdersAccounts
}
