import { SnapshotQueue } from '../common/types'
import { notifyForDevelop } from '../notifications'

export const getSnapshotQueueWithAMMFees = ({
  farmingSnapshotsQueueAddress,
  snapshotQueues,
  poolsFees,
}: {
  farmingSnapshotsQueueAddress: string
  snapshotQueues: SnapshotQueue[]
  poolsFees: number
}) => {
  const currentSnapshotQueueIndex =
    snapshotQueues.findIndex(
      (snapshot) => snapshot.publicKey === farmingSnapshotsQueueAddress
    ) || 0

  if (currentSnapshotQueueIndex === -1) {
    notifyForDevelop({ message: 'No current snapshot', type: 'error' })
  }

  const currentSnapshotsQueue = snapshotQueues[currentSnapshotQueueIndex]
  const currentSnapshots = currentSnapshotsQueue?.snapshots

  const feesForOneSnapshot = poolsFees / currentSnapshots?.length

  let feesAdded = feesForOneSnapshot
  const snapshotsWithFees = currentSnapshots?.map((el) => {
    const snapshotWithFees = {
      tokensTotal: Math.floor(el.tokensTotal + feesAdded),
      isInitialized: el.isInitialized,
      tokensFrozen: el.tokensFrozen,
      time: el.time,
    }
    feesAdded += feesForOneSnapshot

    return snapshotWithFees
  })

  return [
    ...snapshotQueues.slice(0, currentSnapshotQueueIndex),
    { ...currentSnapshotsQueue, snapshots: snapshotsWithFees },
    ...snapshotQueues.slice(currentSnapshotQueueIndex + 1),
  ]
}
