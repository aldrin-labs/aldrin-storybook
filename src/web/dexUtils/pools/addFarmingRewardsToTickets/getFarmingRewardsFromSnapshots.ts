import BN from 'bn.js'

import {
  INSTANT_FARMING_REWARD_PART_NUMERATOR,
  INSTANT_FARMING_REWARD_PART_DENOMINATOR,
  VESTING_FARMING_REWARD_PART_NUMERATOR,
  VESTING_FARMING_REWARD_PART_DENOMINATOR,
} from '@sb/dexUtils/common/config'
import {
  FarmingState,
  FarmingTicket,
  Snapshot,
  StateAttached,
} from '@sb/dexUtils/common/types'

interface CalculatedUserRewards {
  prevSnapshot: Snapshot | null
  amount: number
}

/**
 * Calculates rewards for snapshots from farming state related to farming ticket
 */
export const getFarmingRewardsFromSnapshots = ({
  ticket,
  farmingState,
  stateAttached,
  snapshots,
}: {
  ticket: FarmingTicket
  farmingState: FarmingState
  stateAttached?: StateAttached
  snapshots: Snapshot[]
}): number => {
  const startRewardsForFarmingState: CalculatedUserRewards = {
    prevSnapshot: null,
    amount: 0,
  }

  const now = Date.now() / 1000
  const ticketEndTime = parseFloat(ticket.endTime)

  const userRewardsForFarmingState = snapshots.reduce(
    (snapshotsAcc, snapshot: Snapshot, index, snapshotsArr) => {
      const { farmingTokenMintDecimals, vestingPeriod } = farmingState || {
        farmingTokenMintDecimals: null,
      }

      if (!farmingTokenMintDecimals) {
        return snapshotsAcc
      }

      if (
        snapshot.time <= +ticket.startTime ||
        snapshot.time >= +ticket.endTime ||
        (stateAttached &&
          snapshot.time <= stateAttached?.lastVestedWithdrawTime)
      ) {
        return snapshotsAcc
      }

      const { amount } = snapshotsAcc
      let { prevSnapshot } = snapshotsAcc

      if (prevSnapshot === null) {
        if (index === 0) {
          prevSnapshot = {
            ...snapshot,
            tokensFrozen: 0,
            tokensTotal: 0,
          }
        } else {
          prevSnapshot = snapshotsArr[index - 1]
        }
      }

      const totalUserSnapshotReward = new BN(snapshot.tokensTotal.toFixed(0))
        .sub(new BN(prevSnapshot.tokensTotal.toFixed(0)))
        .mul(new BN(ticket.tokensFrozen.toFixed(0)))
        .div(new BN(snapshot.tokensFrozen.toFixed(0)))

      let unlockedUserSnapshotReward = new BN(0)

      if (
        !stateAttached ||
        (stateAttached.lastWithdrawTime < snapshot.time &&
          ticketEndTime >= snapshot.time)
      ) {
        unlockedUserSnapshotReward = unlockedUserSnapshotReward.add(
          totalUserSnapshotReward
            .mul(new BN(INSTANT_FARMING_REWARD_PART_NUMERATOR))
            .div(new BN(INSTANT_FARMING_REWARD_PART_DENOMINATOR))
        )
      }

      const lastVestedWithdrawTime =
        stateAttached?.lastVestedWithdrawTime || parseFloat(ticket.startTime)

      if (
        lastVestedWithdrawTime < snapshot.time &&
        snapshot.time + vestingPeriod < now
      ) {
        unlockedUserSnapshotReward = unlockedUserSnapshotReward.add(
          totalUserSnapshotReward
            .mul(new BN(VESTING_FARMING_REWARD_PART_NUMERATOR))
            .div(new BN(VESTING_FARMING_REWARD_PART_DENOMINATOR))
        )
      }

      const unlockedUserSnapshotRewardWithoutDecimals =
        parseFloat(unlockedUserSnapshotReward.toString()) /
        10 ** farmingTokenMintDecimals

      return {
        prevSnapshot: snapshot,
        amount: unlockedUserSnapshotRewardWithoutDecimals + amount,
      }
    },
    startRewardsForFarmingState
  )

  return userRewardsForFarmingState.amount
}
