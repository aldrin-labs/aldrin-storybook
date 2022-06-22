import { FarmingState } from '@sb/dexUtils/common/types'

const maxAmountOfSnapshotsInSnapshotQueue = 1500

// Issue from program side:
// For farmings with defined farming duration more than 1500 snapshots (hours) (tokensTotal / tokensPerPeriod)
// it's impossible to take new snapshots once snapshotQueue is filled.

// Issue from user side:
// For users it shows like farming is live, but rewards aren't incoming.

// Our solution for already broken farmingStates:
// We're changing tokensTotal to amount of tokens that unlocked during 1500 snapshots.
// (so rewards which can not be distributed are cutting, we leave only possible to distribute rewards)

// For not broken farmings code will take default tokensTotal value using Math.min, because farming
// duration will be <= 1500 snapshots (max in UI 60 days - 1440 snapshots)

export const fixCorruptedFarmingStates = (farmings: FarmingState[] | null) =>
  farmings?.map((farm: FarmingState) => {
    return {
      ...farm,
      tokensTotal: Math.min(
        farm.tokensTotal,
        farm.tokensPerPeriod * maxAmountOfSnapshotsInSnapshotQueue
      ),
    }
  })

// TODO: Remove once update AMM to new version
