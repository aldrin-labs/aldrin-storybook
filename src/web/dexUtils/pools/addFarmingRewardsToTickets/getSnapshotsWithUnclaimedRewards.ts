import {
  FarmingState,
  FarmingTicket,
  Snapshot,
  SnapshotQueue,
} from '@sb/dexUtils/common/types'
import BN from 'bn.js'

/**
 * Return unclaimed snapshots for farming state related to farming ticket
 */
export const getSnapshotsWithUnclaimedRewards = ({
  ticket,
  snapshotQueues,
  farmingState,
  calculatedAmount = new BN(0)
}: {
  ticket: FarmingTicket
  snapshotQueues: SnapshotQueue[]
  farmingState: FarmingState
  calculatedAmount?: BN
}): Snapshot[] => {
  const snapshotQueue = snapshotQueues.find(
    (snapshotQueue) => snapshotQueue.publicKey === farmingState.farmingSnapshots
  )

  if (!snapshotQueue) {
    return []
  }

  const stateAttached = ticket.statesAttached?.find(
    (el) => farmingState.farmingState === el.farmingState
  )

  // if state attached and last withdraw time more than last farming state snapshot -
  // farming ended, skip queue
  if (
    stateAttached &&
    stateAttached.lastVestedWithdrawTime >= farmingState?.currentTime
  ) {
    return []
  }

  return snapshotQueue.snapshots.filter((snapshot) => {
    return (
      snapshot.time > +ticket.startTime &&
      snapshot.time < +ticket.endTime &&
      (!stateAttached || snapshot.time > stateAttached?.lastVestedWithdrawTime)
    )
  })
}
