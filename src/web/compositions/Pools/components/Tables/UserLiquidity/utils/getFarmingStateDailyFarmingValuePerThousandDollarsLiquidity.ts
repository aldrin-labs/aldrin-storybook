import { FarmingState } from '@sb/dexUtils/common/types'

import { getFarmingStateDailyFarmingValue } from './getFarmingStateDailyFarmingValue'

export const getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity =
  (params: {
    farmingState?: FarmingState
    totalStakedLpTokensUSD?: number
  }) => {
    const { totalStakedLpTokensUSD } = params

    if (!totalStakedLpTokensUSD) {
      return 0
    }

    return (
      (getFarmingStateDailyFarmingValue(params) / totalStakedLpTokensUSD) * 1000
    )
  }
