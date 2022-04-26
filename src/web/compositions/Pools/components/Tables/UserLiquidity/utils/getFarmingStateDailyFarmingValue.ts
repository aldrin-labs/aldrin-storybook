import { FarmingState } from '@sb/dexUtils/common/types'

import { DAY } from '@core/utils/dateUtils'

export const getFarmingStateDailyFarmingValue = ({
  farmingState,
  totalStakedLpTokensUSD,
}: {
  farmingState?: FarmingState
  totalStakedLpTokensUSD?: number
}) => {
  if (!farmingState || !totalStakedLpTokensUSD) return 0

  const tokensPerPeriod =
    farmingState.tokensPerPeriod /
    10 ** (farmingState.farmingTokenMintDecimals || 0)

  const dailyFarmingValue = tokensPerPeriod * (DAY / farmingState.periodLength)

  return dailyFarmingValue
}
