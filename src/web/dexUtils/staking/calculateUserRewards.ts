import { DEFAULT_FARMING_TICKET_END_TIME } from '../common/config'
import {
  FarmingTicket,
  StakingSnapshot,
  StakingSnapshotQueue,
} from '../common/types'

interface CalculateRewardsParams {
  snapshotsQueues: StakingSnapshotQueue[]
  allStakingFarmingTickets: FarmingTicket[]
}

interface CalculatedUserRewards {
  prevSnapshot: StakingSnapshot | null
  amount: number
}

export const calculateUserRewards = (params: CalculateRewardsParams) => {
  const {
    snapshotsQueues,
    allStakingFarmingTickets,
  } = params
  const initialState: CalculatedUserRewards =  { prevSnapshot: null, amount: 0 }
  const userRewardsForAllTickets = allStakingFarmingTickets.reduce(
    (acc, ticket) => {
      const filteredSnapshots = snapshotsQueues.filter(
        (snapshotQueue) =>
          !ticket.statesAttached?.find(
            (el) => snapshotQueue.publicKey === el.farmingState
          )
      )

      const snapshots = filteredSnapshots.flatMap((el) => el.snapshots)

      const snapshotsInTicketTimestampInterval = snapshots.filter(
        (snapshot) => snapshot.time >= +ticket.startTime && snapshot.time <= +ticket.endTime
      )

      const r: CalculatedUserRewards = { prevSnapshot: null, amount: acc.amount }

      const userRewardsForTicket = snapshotsInTicketTimestampInterval.reduce(
        (
          acc1,
          snapshot: StakingSnapshot
        ) => {
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

      return userRewardsForTicket
    },
    initialState
  )

  return userRewardsForAllTickets
}
