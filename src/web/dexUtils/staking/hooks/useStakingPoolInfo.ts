import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import useSWR from 'swr'

import { getRINCirculationSupply } from '@core/api'
import { client } from '@core/graphql/apolloClient'
import { getBuyBackAmountForPeriod } from '@core/graphql/queries/pools/getBuyBackAmountForPeriod'
import { getStakingPoolInfo } from '@core/graphql/queries/staking/getStakingPool'
import { getCurrentFarmingStateFromAll } from '@core/solana'
import { DAY } from '@core/utils/dateUtils'

import {
  DAYS_TO_CHECK_BUY_BACK,
  STAKING_FARMING_TOKEN_DIVIDER,
} from '../config'
import { StakingPool } from '../types'

dayjs.extend(utc)

const loadBuyBackAmount = async () => {
  try {
    const endOfDay = dayjs.utc().endOf('day').unix()

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
    console.warn('Unable to load buyback amount: ', e)
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
        // 0,
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
  return useSWR('staking-pool-full-info', fetcher)
}
