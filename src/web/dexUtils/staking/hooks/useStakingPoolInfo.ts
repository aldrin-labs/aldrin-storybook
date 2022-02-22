import dayjs from 'dayjs'
import useSWR from 'swr'

import { getRINCirculationSupply } from '@core/api'
import { client } from '@core/graphql/apolloClient'
import { getBuyBackAmountForPeriod } from '@core/graphql/queries/pools/getBuyBackAmountForPeriod'
import { getStakingPoolInfo } from '@core/graphql/queries/staking/getStakingPool'
import { DAY } from '@core/utils/dateUtils'

import {
  DAYS_TO_CHECK_BUY_BACK,
  STAKING_FARMING_TOKEN_DIVIDER,
} from '../config'
import { getCurrentFarmingStateFromAll } from '../getCurrentFarmingStateFromAll'
import { StakingPool } from '../types'

const loadBuyBackAmount = async () => {
  const endOfDay = dayjs.utc().endOf('day').unix()
  try {
    const data = await client.query<{ getBuyBackAmountForPeriod: number }>({
      query: getBuyBackAmountForPeriod,
      fetchPolicy: 'network-only',
      variables: {
        timestampFrom: endOfDay - DAY * DAYS_TO_CHECK_BUY_BACK,
        timestampTo: endOfDay,
      },
    })
    return data.data.getBuyBackAmountForPeriod
  } catch (e) {
    return 0
  }
}
export const useStakingPoolInfo = () => {
  const fetcher = async () => {
    const [poolInfo, buybackAmountData, rinCirculationSupply] =
      await Promise.all([
        client.query<{ getStakingPoolInfo: StakingPool }>({
          query: getStakingPoolInfo,
          fetchPolicy: 'network-only',
        }),
        loadBuyBackAmount(),
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
      buyBackAmount: buybackAmountData,
      rinCirculationSupply,
      treasuryDailyRewards,
    }
  }
  return useSWR('staking-pool-full-info', fetcher, { refreshInterval: 60_000 })
}
