import {
  INSTANT_FARMING_REWARD_PART_DENOMINATOR,
  INSTANT_FARMING_REWARD_PART_NUMERATOR,
  VESTING_FARMING_REWARD_PART_DENOMINATOR,
  VESTING_FARMING_REWARD_PART_NUMERATOR,
} from '@sb/dexUtils/common/config'
import {
  FarmingState,
  FarmingTicket,
  Snapshot,
  StateAttached,
} from '@sb/dexUtils/common/types'
import BN from 'bn.js'

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

      let { prevSnapshot, amount } = snapshotsAcc

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

      const totalUserSnapshotReward = new BN(
        snapshot.tokensTotal - prevSnapshot.tokensTotal
      )
        .mul(new BN(ticket.tokensFrozen))
        .div(new BN(snapshot.tokensFrozen))

      let unlockedUserSnapshotReward = totalUserSnapshotReward
        .mul(new BN(INSTANT_FARMING_REWARD_PART_NUMERATOR))
        .div(new BN(INSTANT_FARMING_REWARD_PART_DENOMINATOR))

      const currentTime = Date.now() / 1000

      // if vesting period passed
      if (snapshot.time + vestingPeriod <= currentTime) {
        unlockedUserSnapshotReward = unlockedUserSnapshotReward.add(
          totalUserSnapshotReward
            .mul(new BN(VESTING_FARMING_REWARD_PART_NUMERATOR))
            .div(new BN(VESTING_FARMING_REWARD_PART_DENOMINATOR))
        )
      }

      const unlockedUserSnapshotRewardWithoutDecimals =
        unlockedUserSnapshotReward.toNumber() / 10 ** farmingTokenMintDecimals

      return {
        prevSnapshot: snapshot,
        amount: unlockedUserSnapshotRewardWithoutDecimals + amount,
      }
    },
    startRewardsForFarmingState
  )

  return userRewardsForFarmingState.amount
}
