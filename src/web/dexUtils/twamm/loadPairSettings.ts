import { Connection } from '@solana/web3.js'

import { loadAccountsFromTWAMMProgram } from './loadAccountFromTwammProgram'

export const loadPairSettings = async ({
  connection,
}: {
  connection: Connection
}) => {
  return await loadAccountsFromTWAMMProgram({
    connection,
    filters: [
      {
        dataSize: 290,
      },
    ],
  })
}
