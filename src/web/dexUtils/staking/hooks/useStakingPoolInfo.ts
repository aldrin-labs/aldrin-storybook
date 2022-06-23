import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import useSWR from 'swr'

import { getRINCirculationSupply } from '@core/api'
import { client } from '@core/graphql/apolloClient'
import { getStakingPoolInfo } from '@core/graphql/queries/staking/getStakingPool'
import { getCurrentFarmingStateFromAll } from '@core/solana'
import { DAY } from '@core/utils/dateUtils'

import { STAKING_FARMING_TOKEN_DIVIDER } from '../config'
import { StakingPool } from '../types'

dayjs.extend(utc)

export const useStakingPoolInfo = () => {
  const fetcher = async () => {
    const [poolInfo, rinCirculationSupply] = await Promise.all([
      client.query<{ getStakingPoolInfo: StakingPool }>({
        query: getStakingPoolInfo,
        fetchPolicy: 'network-only',
      }),
      getRINCirculationSupply(),
    ])

    const allStakingFarmingStates =
      poolInfo.data.getStakingPoolInfo.farming || []

    const currentFarmingState = getCurrentFarmingStateFromAll(
      allStakingFarmingStates
    )

    const treasuryDailyRewards =
      (currentFarmingState.tokensPerPeriod / STAKING_FARMING_TOKEN_DIVIDER) *
      (DAY / currentFarmingState.periodLength)

    return {
      poolInfo: poolInfo.data.getStakingPoolInfo,
      currentFarmingState,
      rinCirculationSupply,
      treasuryDailyRewards,
    }
  }
  return useSWR('staking-pool-full-info', fetcher)
}
