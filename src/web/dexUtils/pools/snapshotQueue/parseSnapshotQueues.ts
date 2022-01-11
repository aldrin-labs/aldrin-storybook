import { Program } from '@project-serum/anchor'

import {
  GetProgramAccountsResult,
  GetProgramAccountsResultItem,
  Snapshot,
  SnapshotQueue,
} from '@sb/dexUtils/common/types'

const parseSnapshotQueue = ({
  program,
  snapshotQueue,
}: {
  program: Program
  snapshotQueue: GetProgramAccountsResultItem
}): SnapshotQueue => {
  const data = Buffer.from(snapshotQueue.account.data)
  const snapshotQueueData = program.coder.accounts.decode('SnapshotQueue', data)

  const parsedSnapshots: Snapshot[] = snapshotQueueData.snapshots
    .map((el) => {
      return {
        time: el.time.toNumber(),
        isInitialized: el.isInitialized,
        tokensFrozen: parseInt(el?.tokensFrozen?.toString(), 10),
        tokensTotal: parseInt(el?.farmingTokens?.toString(), 10),
      }
    })
    .filter((snapshot: Snapshot) => snapshot.isInitialized)

  return {
    publicKey: snapshotQueue.pubkey.toString(),
    nextIndex: snapshotQueueData.nextIndex.toNumber(),
    snapshots: parsedSnapshots,
  }
}

const parseSnapshotQueues = ({
  program,
  snapshotQueues,
}: {
  program: Program
  snapshotQueues: GetProgramAccountsResult
}) => {
  return snapshotQueues.map((snapshotQueue) =>
    parseSnapshotQueue({ program, snapshotQueue })
  )
}

export { parseSnapshotQueues }
