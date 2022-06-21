import { FarmingState } from '@sb/dexUtils/common/types'

export const fixCorruptedFarmingStates = (farmings: FarmingState[]) =>
  farmings?.map((farm) => {
    return {
      ...farm,
      tokensTotal: Math.min(farm.tokensTotal, farm.tokensPerPeriod * 1500),
    }
  })
