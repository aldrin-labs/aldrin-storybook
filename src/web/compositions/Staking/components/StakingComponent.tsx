import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getBuyBackAmountForPeriod } from '@core/graphql/queries/pools/getBuyBackAmountForPeriod'
import { getStakingPoolInfo } from '@core/graphql/queries/staking/getStakingPool'
import { dayDuration } from '@core/utils/dateUtils'
import { getRandomInt } from '@core/utils/helpers'
import { DexTokensPrices } from '@sb/compositions/Pools/index.types'
import { DAYS_TO_CHECK_BUY_BACK } from '@sb/dexUtils/staking/config'
import { getCurrentFarmingStateFromAll } from '@sb/dexUtils/staking/getCurrentFarmingStateFromAll'
import { StakingPool } from '@sb/dexUtils/staking/types'
import { useAccountBalance } from '@sb/dexUtils/staking/useAccountBalance'
import { useInterval } from '@sb/dexUtils/useInterval'
import { useUserTokenAccounts } from '@sb/dexUtils/useUserTokenAccounts'
import { PublicKey } from '@solana/web3.js'
import dayjs from 'dayjs'
import React from 'react'
import { compose } from 'recompose'
import { Cell } from '@sb/components/Layout'
import { RootRow } from '../styles'
import StatsComponent from './StatsComponent'
import UserStakingInfo from './UserStakingInfo'



interface StakingComponentProps {
  getStakingPoolInfoQuery: { getStakingPoolInfo: StakingPool }
  getBuyBackAmountForPeriodQuery: { getBuyBackAmountForPeriod: number }
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
}

const StakingComponent: React.FC<StakingComponentProps> = (
  props: StakingComponentProps
) => {
  const { getStakingPoolInfoQuery, getBuyBackAmountForPeriodQuery } = props

  const [allTokenData, refreshAllTokenData] = useUserTokenAccounts()

  const stakingPool = getStakingPoolInfoQuery.getStakingPoolInfo || {}

  const [totalStaked, refreshTotalStaked] = useAccountBalance({
    publicKey: new PublicKey(stakingPool.stakingVault),
  })

  const allStakingFarmingStates = stakingPool.farming || []

  const currentFarmingState = getCurrentFarmingStateFromAll(
    allStakingFarmingStates
  )

  const tokenData = allTokenData.find(
    (token) => token.mint === currentFarmingState.farmingTokenMint
  )

  const buyBackAmount =
    getBuyBackAmountForPeriodQuery.getBuyBackAmountForPeriod *
    10 ** currentFarmingState?.farmingTokenMintDecimals

  useInterval(() => {
    refreshTotalStaked()
  }, 30000)

  return (
    <>
      <RootRow>
        <Cell col={12} colLg={6}>
          <UserStakingInfo
            stakingPool={stakingPool}
            currentFarmingState={currentFarmingState}
            tokenData={tokenData}
            totalStaked={totalStaked}
            refreshAllTokenData={refreshAllTokenData}
            refreshTotalStaked={refreshTotalStaked}
            allTokenData={allTokenData}
          />
        </Cell>
        <Cell col={12} colLg={6}>
          <StatsComponent
            buyBackAmount={buyBackAmount}
            totalStaked={totalStaked}
            currentFarmingState={currentFarmingState}
            tokenData={tokenData}
          />
        </Cell>
      </RootRow>
    </>
  )
}

export default compose(
  queryRendererHoc({
    query: getStakingPoolInfo,
    name: 'getStakingPoolInfoQuery',
    fetchPolicy: 'cache-and-network',
  }),
  queryRendererHoc({
    name: 'getBuyBackAmountForPeriodQuery',
    query: getBuyBackAmountForPeriod,
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000 * getRandomInt(5, 10),
    variables: () => {
      const endOfDay = dayjs()
        .endOf('day')
        .unix()

      return {
        timestampFrom: endOfDay - dayDuration * DAYS_TO_CHECK_BUY_BACK,
        timestampTo: endOfDay,
      }
    },
  })
)(StakingComponent)
