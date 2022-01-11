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
  return snapshotQueues.map((sq) => {
    if (sq.publicKey !== farmingSnapshotsQueueAddress) {
      return sq
    }
    const currentSnapshots = sq.snapshots
    const feesForOneSnapshot = buyBackAmount / currentSnapshots?.length

    const snapshotsWithFees = currentSnapshots.map((el, idx) => {
      const snapshotWithFees = {
        ...el,
        tokensTotal:
          el.tokensTotal + Math.round(feesForOneSnapshot * (idx + 1)),
      }
      return snapshotWithFees
    })

    return {
      ...sq,
      snapshots: snapshotsWithFees,
    }
  })
}
