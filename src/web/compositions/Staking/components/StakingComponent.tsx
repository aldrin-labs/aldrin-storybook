import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import { getFeesEarnedByPool } from '@core/graphql/queries/pools/getFeesEarnedByPool'
import { getStakingPoolInfo } from '@core/graphql/queries/staking/getStakingPool'
import {
  dayDuration,
  daysInMonth,
  endOfHourTimestamp,
} from '@core/utils/dateUtils'
import { getRandomInt } from '@core/utils/helpers'
import { DexTokensPrices, FeesEarned } from '@sb/compositions/Pools/index.types'
import { useConnection } from '@sb/dexUtils/connection'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import {
  STAKING_FARMING_TOKEN_MINT_ADDRESS,
  STAKING_PART_OF_AMM_FEES,
} from '@sb/dexUtils/staking/config'
import { getCurrentFarmingStateFromAll } from '@sb/dexUtils/staking/getCurrentFarmingStateFromAll'
import { StakingPool } from '@sb/dexUtils/staking/types'
import { useAllStakingTickets } from '@sb/dexUtils/staking/useAllStakingTickets'
import { useInterval } from '@sb/dexUtils/useInterval'
import { useUserTokenAccounts } from '@sb/dexUtils/useUserTokenAccounts'
import { useWallet } from '@sb/dexUtils/wallet'
import React from 'react'
import { compose } from 'recompose'
import { Cell } from '../../../components/Layout'
import { RootRow } from '../styles'
import { getTotalFeesFromPools } from '../utils/getTotalFeesFromPools'
import StatsComponent from './StatsComponent'
import UserStakingInfo from './UserStakingInfo'

interface StakingComponentProps {
  getStakingPoolInfoQuery: { getStakingPoolInfo: StakingPool }
  getFeesEarnedByPoolQuery: { getFeesEarnedByPool: FeesEarned[] }
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
}

const StakingComponent: React.FC<StakingComponentProps> = (
  props: StakingComponentProps
) => {
  const {
    getStakingPoolInfoQuery,
    getFeesEarnedByPoolQuery,
    getDexTokensPricesQuery,
  } = props
  const { wallet } = useWallet()
  const connection = useConnection()
  const [allTokenData, refreshAllTokenData] = useUserTokenAccounts({
    wallet,
    connection,
  })

  // get balance from lp token holder account
  const [
    allStakingFarmingTickets,
    refreshFarmingTickets,
  ] = useAllStakingTickets({
    wallet,
    connection,
  })
  const dexTokensPricesMap = getDexTokensPricesQuery?.getDexTokensPrices?.reduce(
    (acc, tokenPrice) => acc.set(tokenPrice.symbol, tokenPrice),
    new Map()
  )

  const totalFeesFromPools = getTotalFeesFromPools({
    poolsFeesData: getFeesEarnedByPoolQuery.getFeesEarnedByPool,
    dexTokensPricesMap,
  })

  const stakingPool = getStakingPoolInfoQuery.getStakingPoolInfo || {}
  const allStakingFarmingStates = stakingPool.farming || []

  const currentFarmingState = getCurrentFarmingStateFromAll(
    allStakingFarmingStates
  )

  const tokenData = allTokenData.find(
    (token) => token.mint === currentFarmingState.farmingTokenMint
  )

  const tokenPrice =
    dexTokensPricesMap?.get(
      getTokenNameByMintAddress(currentFarmingState.farmingTokenMint)
    ).price || 0

  const poolsFees =
    ((totalFeesFromPools * STAKING_PART_OF_AMM_FEES) / tokenPrice) *
    10 ** currentFarmingState.farmingTokenMintDecimals

  useInterval(() => {
    refreshFarmingTickets()
  }, 60000)

  return (
    <>
      <RootRow>
        <Cell col={12} colLg={6}>
          <UserStakingInfo
            poolsFees={poolsFees}
            stakingPool={stakingPool}
            currentFarmingState={currentFarmingState}
            tokenData={tokenData}
            refreshAllTokenData={refreshAllTokenData}
            allStakingFarmingTickets={allStakingFarmingTickets}
            refreshAllStakingFarmingTickets={refreshFarmingTickets}
            allTokenData={allTokenData}
          />
        </Cell>
        <Cell col={12} colLg={6}>
          <StatsComponent
            poolsFees={poolsFees}
            allStakingFarmingTickets={allStakingFarmingTickets}
            stakingPool={stakingPool}
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
    name: 'getFeesEarnedByPoolQuery',
    query: getFeesEarnedByPool,
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000 * getRandomInt(5, 10),
    variables: () => ({
      timestampFrom: endOfHourTimestamp() - dayDuration * daysInMonth,
      timestampTo: endOfHourTimestamp(),
    }),
  }),
  queryRendererHoc({
    query: getDexTokensPrices,
    name: 'getDexTokensPricesQuery',
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000,
  })
)(StakingComponent)
