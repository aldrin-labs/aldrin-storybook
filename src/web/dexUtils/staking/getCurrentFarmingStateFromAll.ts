import { FarmingState } from '../common/types'

export const getCurrentFarmingStateFromAll = (
  allStakingFarmingStates: FarmingState[]
) => {
  const currentStakingFarmingState = [...allStakingFarmingStates]
    .filter((state) => !state.feesDistributed)
    .sort(
      (stateA, stateB) => stateB?.startTime - stateA?.startTime
    )[0]

  return currentStakingFarmingState
}
