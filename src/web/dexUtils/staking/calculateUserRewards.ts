import { DEFAULT_FARMING_TICKET_END_TIME } from '../common/config'
import {
  FarmingTicket,
  StakingSnapshot,
  StakingSnapshotQueue,
} from '../common/types'

export const calculateUserRewards = ({
  snapshotsQueues,
  allStakingFarmingTickets,
}: {
  snapshotsQueues: StakingSnapshotQueue[]
  allStakingFarmingTickets: FarmingTicket[]
}) => {
  const userRewardsForAllTickets = allStakingFarmingTickets.reduce(
    (acc, ticket) => {
      const filteredSnapshots = snapshotsQueues.filter(
        (snapshotQueue) =>
          !ticket.statesAttached?.find(
            (el) => snapshotQueue.publicKey === el.farmingState
          )
      )

      const snapshots = filteredSnapshots.map((el) => el.snapshots).flat()

      const snapshotsInTicketTimestampInterval = snapshots.filter(
        (snapshot) => {
          const isTicketOpen =
            ticket.endTime === DEFAULT_FARMING_TICKET_END_TIME

          return (
            snapshot.time >= +ticket.startTime &&
            (isTicketOpen || snapshot.time <= +ticket.endTime)
          )
        }
      )

      console.log({ snapshotsInTicketTimestampInterval, ticket })

      // @ts-ignore
      const userRewardsForTicket = snapshotsInTicketTimestampInterval.reduce(
        (
          acc: { prevSnapshot: StakingSnapshot | null; amount: number },
          snapshot: StakingSnapshot
        ) => {
          const userAllocation = ticket.tokensFrozen / snapshot.tokensFrozen

          if (acc.prevSnapshot === null) {
            return { prevSnapshot: snapshot, amount: 0 }
          }

          const userTokensAllocation =
            userAllocation *
            (snapshot.tokensTotal - acc.prevSnapshot.tokensTotal)

          return {
            prevSnapshot: snapshot,
            amount: userTokensAllocation + acc.amount,
          }
        },
        { prevSnapshot: null, amount: 0 }
      )

      return userRewardsForTicket.amount
    },
    0
  )

  console.log('userRewardsForAllTickets', userRewardsForAllTickets)

  return userRewardsForAllTickets
}
