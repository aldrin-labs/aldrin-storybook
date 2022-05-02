import { Connection } from '@solana/web3.js'

import { SNAPSHOT_QUEUE_SIZE } from '../common/config'
import { loadAccountsFromStakingProgram } from './loadAccountsFromStakingProgram'

export const loadStakingSnapshots = async ({
  connection,
}: {
  connection: Connection
}) => {
  return await loadAccountsFromStakingProgram({
    connection,
    filters: [
      {
        dataSize: SNAPSHOT_QUEUE_SIZE,
      },
    ],
  })
}
