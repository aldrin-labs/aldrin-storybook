import { Connection } from '@solana/web3.js'

import { SnapshotQueue } from '@sb/dexUtils/common/types'
import { WalletAdapter } from '@sb/dexUtils/types'

import {
  ProgramsMultiton,
  POOLS_PROGRAM_ADDRESS,
  POOLS_V2_PROGRAM_ADDRESS,
} from '@core/solana'

import { loadSnapshotQueues } from './loadSnapshotQueues'
import { parseSnapshotQueues } from './parseSnapshotQueues'

export const getParsedSnapshotQueues = async ({
  wallet,
  connection,
}: {
  wallet: WalletAdapter
  connection: Connection
}): Promise<SnapshotQueue[]> => {
  // load snapshot queues from all pools programs
  const [snapshotQueuesFromPoolsV1, snapshotQueuesFromPoolsV2] =
    await Promise.all([
      loadSnapshotQueues({
        connection,
        programId: POOLS_PROGRAM_ADDRESS,
      }),
      loadSnapshotQueues({
        connection,
        programId: POOLS_V2_PROGRAM_ADDRESS,
      }),
    ])

  const programV1 = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: POOLS_PROGRAM_ADDRESS,
  })

  const parsedSnapshotQueuesFromPoolsV1 = parseSnapshotQueues({
    snapshotQueues: snapshotQueuesFromPoolsV1,
    program: programV1,
  })

  const programV2 = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: POOLS_V2_PROGRAM_ADDRESS,
  })

  const parsedSnapshotQueuesFromPoolsV2 = parseSnapshotQueues({
    snapshotQueues: snapshotQueuesFromPoolsV2,
    program: programV2,
  })

  return [
    ...parsedSnapshotQueuesFromPoolsV1,
    ...parsedSnapshotQueuesFromPoolsV2,
  ]
}
