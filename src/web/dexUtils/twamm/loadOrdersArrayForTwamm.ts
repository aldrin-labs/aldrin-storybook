import { Connection } from '@solana/web3.js'

import { loadAccountsFromTWAMMProgram } from './loadAccountFromTwammProgram'

export const loadOrdersArrayForTwamm = async ({
  connection,
}: {
  connection: Connection
}) => {
  return loadAccountsFromTWAMMProgram({
    connection,
    filters: [
      {
        dataSize: 3560,
      },
    ],
  })
}
