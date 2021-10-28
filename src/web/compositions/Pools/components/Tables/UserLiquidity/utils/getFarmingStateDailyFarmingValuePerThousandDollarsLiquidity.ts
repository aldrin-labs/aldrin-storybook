import { dayDuration } from '@core/utils/dateUtils'
import { FarmingState } from '@sb/compositions/Pools/index.types'

export const getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity = ({
  farmingState,
  totalStakedLpTokensUSD,
}: {
  farmingState?: FarmingState
  totalStakedLpTokensUSD?: number
}) => {
  if (!farmingState || !totalStakedLpTokensUSD) return 0

  const tokensPerPeriod =
    farmingState.tokensPerPeriod / 10 ** farmingState.farmingTokenMintDecimals

  const dailyFarmingValue =
    tokensPerPeriod * (dayDuration / farmingState.periodLength)

  return dailyFarmingValue
}
