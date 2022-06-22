import { FarmingState } from '../common/types'

export const isOpenFarmingState = (farmingState: FarmingState) =>
  farmingState.tokensTotal > farmingState.tokensUnlocked &&
  farmingState.tokensPerPeriod > 0

export const filterOpenFarmingStates = (farmingStates: FarmingState[] = []) =>
  farmingStates.filter(isOpenFarmingState)
