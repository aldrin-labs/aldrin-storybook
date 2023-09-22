import { Connection } from '@solana/web3.js'

import { chunk } from './chunk'

export const getMultipleAccounts = async ({
  connection,
  accounts,
  params = { encoding: 'jsonParsed' },
}: {
  connection: Connection
  accounts: string[]
  params?: any
}) => {
  const splittedAccounts = chunk(accounts, 100)
  const parsedAccountsResults = await Promise.all(
    splittedAccounts.map((splittedAcc: string) =>
      (connection as any)._rpcRequest('getMultipleAccounts', [
        splittedAcc,
        params,
      ])
    )
  )
  const parsedAccounts = parsedAccountsResults
    .map(({ result }) => result.value)
    .flat()

  return parsedAccounts
}
