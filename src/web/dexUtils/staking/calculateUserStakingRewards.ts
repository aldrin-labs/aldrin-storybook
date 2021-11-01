import { FarmingTicket, Snapshot, SnapshotQueue } from '../common/types'

interface CalculateRewardsParams {
  snapshotQueues: SnapshotQueue[]
  farmingTickets: FarmingTicket[]
}

interface CalculatedUserRewards {
  prevSnapshot: Snapshot | null
  amount: number
}

export const calculateUserStakingRewards = (params: CalculateRewardsParams) => {
  const { snapshotQueues, farmingTickets } = params
  const userRewardsForAllTickets = farmingTickets.reduce((acc, ticket) => {
    const filteredSnapshots = snapshotQueues.filter(
      (snapshotQueue) =>
        !ticket.statesAttached?.find(
          (el) => snapshotQueue.publicKey === el.farmingState
        )
    )

    const snapshots = filteredSnapshots.flatMap((el) => el.snapshots)

    const snapshotsInTicketTimestampInterval = snapshots.filter(
      (snapshot) =>
        snapshot.time >= +ticket.startTime && snapshot.time <= +ticket.endTime
    )

    const r: CalculatedUserRewards = { prevSnapshot: null, amount: acc }

    const userRewardsForTicket = snapshotsInTicketTimestampInterval.reduce(
      (acc1, snapshot: Snapshot) => {
        const userAllocation = ticket.tokensFrozen / snapshot.tokensFrozen

        if (acc1.prevSnapshot === null) {
          return { prevSnapshot: snapshot, amount: acc1.amount }
        }

        const userTokensAllocation =
          userAllocation *
          (snapshot.tokensTotal - acc1.prevSnapshot.tokensTotal)

        return {
          prevSnapshot: snapshot,
          amount: userTokensAllocation + acc1.amount,
        }
      },
      r
    )

    return userRewardsForTicket.amount
  }, 0)

  return userRewardsForAllTickets
}
