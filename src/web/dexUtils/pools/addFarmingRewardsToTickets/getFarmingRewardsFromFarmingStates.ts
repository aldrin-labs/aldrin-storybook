import {
  AmountToClaim,
  FarmingState,
  FarmingTicket,
  SnapshotQueue,
} from '@sb/dexUtils/common/types'
import { getFarmingRewardsFromSnapshots } from './getFarmingRewardsFromSnapshots'

/**
 * Calculates rewards for all farming state related to farming ticket
 */
export const getFarmingRewardsFromFarmingStates = ({
  ticket,
  snapshotQueues,
  farmingStates,
}: {
  ticket: FarmingTicket
  snapshotQueues: SnapshotQueue[]
  farmingStates: FarmingState[]
}): AmountToClaim[] => {
  const rewardsForFarmingStates = farmingStates.reduce(
    (farmingStatesAcc: AmountToClaim[], farmingState) => {

      // get snapshot queues for this farming state
      const snapshotQueue = snapshotQueues.find(
        (snapshotQueue) =>
          snapshotQueue.publicKey === farmingState.farmingSnapshots
      )

      if (!snapshotQueue) {
        return farmingStatesAcc
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
        return farmingStatesAcc
      }

      const rewardsFromSnapshots = getFarmingRewardsFromSnapshots({
        ticket,
        farmingState,
        stateAttached,
        snapshots: snapshotQueue.snapshots,
      })

      return [
        ...farmingStatesAcc,
        {
          farmingState: farmingState.farmingState,
          amount: rewardsFromSnapshots,
        },
      ]
    },
    []
  )

  return rewardsForFarmingStates
}
