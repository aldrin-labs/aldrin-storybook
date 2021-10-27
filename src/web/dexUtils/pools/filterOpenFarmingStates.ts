import { FarmingState } from '@sb/compositions/Pools/index.types'

export const filterOpenFarmingStates = (farmingStates: FarmingState[]) =>
  farmingStates.filter((state) => state.tokensTotal !== state.tokensUnlocked)
