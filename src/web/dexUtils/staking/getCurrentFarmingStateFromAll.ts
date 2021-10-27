import { FarmingState } from '../common/types'

export const getCurrentFarmingStateFromAll = (
  allStakingFarmingStates: FarmingState[]
) => {
  console.log('allStakingFarmingStates', allStakingFarmingStates)
  const currentStakingFarmingState = [...allStakingFarmingStates].sort(
    (stateA, stateB) => stateB?.startTime - stateA?.startTime
  )

  return currentStakingFarmingState[0]
}
