import { Connection } from '@solana/web3.js'

import { SNAPSHOT_QUEUE_SIZE } from '@sb/dexUtils/common/config'
import { loadAccountsFromPoolsProgram } from '@sb/dexUtils/pools/loadAccountsFromPoolsProgram'
import { loadAccountsFromPoolsV2Program } from '@sb/dexUtils/pools/loadAccountsFromPoolsV2Program'

import { POOLS_PROGRAM_ADDRESS } from '@core/solana'

export const loadSnapshotQueues = async ({
  connection,
  programId = POOLS_PROGRAM_ADDRESS,
}: {
  connection: Connection
  programId?: string
}) => {
  if (programId === POOLS_PROGRAM_ADDRESS) {
    const poolsProgramV1SnapshotQueues = await loadAccountsFromPoolsProgram({
      connection,
      filters: [
        {
          dataSize: SNAPSHOT_QUEUE_SIZE,
        },
      ],
    })

    return poolsProgramV1SnapshotQueues
  }

  const poolsProgramV2SnapshotQueues = await loadAccountsFromPoolsV2Program({
    connection,
    filters: [
      {
        dataSize: SNAPSHOT_QUEUE_SIZE,
      },
    ],
  })

  return poolsProgramV2SnapshotQueues
}
