import { Connection } from '@solana/web3.js'

import { loadAccountsFromTWAMMProgram } from './loadAccountFromTwammProgram'

export const loadOrdersArrayForTwamm = async ({
  connection,
}: {
  connection: Connection
}) => {
  return await loadAccountsFromTWAMMProgram({
    connection,
    filters: [],
  })
}
