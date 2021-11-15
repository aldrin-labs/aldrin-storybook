import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getFeesEarnedByPool } from '@core/graphql/queries/pools/getFeesEarnedByPool'
import { getStakingPoolInfo } from '@core/graphql/queries/staking/getStakingPool'
import {
  dayDuration,
  daysInMonth,
  endOfHourTimestamp,
} from '@core/utils/dateUtils'
import { getRandomInt } from '@core/utils/helpers'
import { FeesEarned } from '@sb/compositions/Pools/index.types'
import { useConnection } from '@sb/dexUtils/connection'
import { STAKING_FARMING_TOKEN_MINT_ADDRESS } from '@sb/dexUtils/staking/config'
import { StakingPool } from '@sb/dexUtils/staking/types'
import { useAllStakingTickets } from '@sb/dexUtils/staking/useAllStakingTickets'
import { useInterval } from '@sb/dexUtils/useInterval'
import { useUserTokenAccounts } from '@sb/dexUtils/useUserTokenAccounts'
import { useWallet } from '@sb/dexUtils/wallet'
import React from 'react'
import { compose } from 'recompose'
import { Cell } from '../../../components/Layout'
import { RootRow } from '../styles'
import StatsComponent from './StatsComponent'
import UserStakingInfo from './UserStakingInfo'

interface StakingComponentProps {
  getStakingPoolInfoQuery: { getStakingPoolInfo: StakingPool }
  getFeesEarnedByPoolQuery: { getFeesEarnedByPool: FeesEarned[] }
}

const StakingComponent: React.FC<StakingComponentProps> = (
  props: StakingComponentProps
) => {
  const { getStakingPoolInfoQuery, getFeesEarnedByPoolQuery } = props
  const { wallet } = useWallet()
  const connection = useConnection()
  const [allTokenData, refreshAllTokenData] = useUserTokenAccounts({
    wallet,
    connection,
  })
  const tokenData = allTokenData.find(
    (token) => token.mint === STAKING_FARMING_TOKEN_MINT_ADDRESS
  )
  const [
    allStakingFarmingTickets,
    refreshFarmingTickets,
  ] = useAllStakingTickets({
    wallet,
    connection,
  })

  useInterval(() => {
    refreshFarmingTickets()
  }, 60000)

  return (
    <>
      <RootRow>
        <Cell col={12} colLg={6}>
          <UserStakingInfo
            stakingPool={getStakingPoolInfoQuery.getStakingPoolInfo}
            tokenMint={STAKING_FARMING_TOKEN_MINT_ADDRESS}
            tokenData={tokenData}
            refreshAllTokenData={refreshAllTokenData}
            allStakingFarmingTickets={allStakingFarmingTickets}
            refreshAllStakingFarmingTickets={refreshFarmingTickets}
            allTokenData={allTokenData}
          />
        </Cell>
        <Cell col={12} colLg={6}>
          <StatsComponent
            allStakingFarmingTickets={allStakingFarmingTickets}
            stakingPool={getStakingPoolInfoQuery.getStakingPoolInfo}
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
  })
)(StakingComponent)
