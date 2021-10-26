import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getStakingPoolInfo } from '@core/graphql/queries/staking/getStakingPool'
import { useConnection } from '@sb/dexUtils/connection'
import { STAKING_FARMING_TOKEN_MINT_ADDRESS } from '@sb/dexUtils/staking/config'
import { StakingPool } from '@sb/dexUtils/staking/types'
import { useUserTokenAccounts } from '@sb/dexUtils/useUserTokenAccounts'
import { useWallet } from '@sb/dexUtils/wallet'
import React from 'react'
import { compose } from 'recompose'
import { Cell } from '../../../components/Layout'
import { RootRow } from '../Staking.styles'
import StatsComponent from './StatsComponent'
import { UserStakingInfo } from './UserStakingInfo'

interface StakingComponentProps {
  getStakingPoolInfoQuery: { getStakingPoolInfo: StakingPool }
}

const StakingComponent: React.FC<StakingComponentProps> = (
  props: StakingComponentProps
) => {
  const { getStakingPoolInfoQuery } = props

  const { wallet, connected } = useWallet()
  const connection = useConnection()
  const [allTokenData, refreshAllTokenData] = useUserTokenAccounts({
    wallet,
    connection,
  })
  const tokenData = allTokenData.find(
    (token) => token.mint === STAKING_FARMING_TOKEN_MINT_ADDRESS
  )

  return (
    <>
      <RootRow>
        <Cell col={12} colLg={6}>
          <UserStakingInfo
            stakingPool={getStakingPoolInfoQuery.getStakingPoolInfo}
            tokenMint={STAKING_FARMING_TOKEN_MINT_ADDRESS}
            tokenData={tokenData}
          />
        </Cell>
        <Cell col={12} colLg={6}>
          <StatsComponent
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
    fetchPolicy: 'cache-only',
  })
)(StakingComponent)
