import { SnapshotQueue } from '../common/types'

export const getSnapshotQueueWithAMMFees = ({
  farmingSnapshotsQueueAddress,
  snapshotQueues,
  buyBackAmount,
}: {
  farmingSnapshotsQueueAddress: string
  snapshotQueues: SnapshotQueue[]
  buyBackAmount: number
}) => {
  const currentSnapshotQueueIndex =
    snapshotQueues.findIndex(
      (snapshot) => snapshot.publicKey === farmingSnapshotsQueueAddress
    ) || 0

  if (currentSnapshotQueueIndex === -1) {
    return snapshotQueues
  }

  const currentSnapshotsQueue = snapshotQueues[currentSnapshotQueueIndex]
  const currentSnapshots = currentSnapshotsQueue?.snapshots
  const feesForOneSnapshot = buyBackAmount / currentSnapshots?.length

  let feesAdded = feesForOneSnapshot

  const snapshotsWithFees = currentSnapshots?.map((el) => {
    const snapshotWithFees = {
      ...el,
      tokensTotal: el.tokensTotal + feesAdded,
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
