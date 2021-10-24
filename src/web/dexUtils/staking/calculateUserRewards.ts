import { DEFAULT_FARMING_TICKET_END_TIME } from '../common/config'
import { FarmingTicket, StakingSnapshotQueue } from '../common/types'

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

      const userRewardsForTicket = snapshotsInTicketTimestampInterval.reduce(
        (acc, snapshot) => {
          const userAllocation = ticket.tokensFrozen / snapshot.tokensTotal
          const userTokensAllocation = userAllocation * snapshot.tokensFrozen
          return userTokensAllocation + acc
        },
        0
      )

      return userRewardsForTicket
    },
    0
  )

  return userRewardsForAllTickets
}
