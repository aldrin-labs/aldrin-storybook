import { FarmingState } from '../common/types'

export const getCurrentFarmingStateFromAll = (
  allStakingFarmingStates: FarmingState[]
) => {
  const currentStakingFarmingState = allStakingFarmingStates.sort(
    (stateA, stateB) => stateB.startTime - stateA.startTime
  )[0]
  
  return currentStakingFarmingState
}
