import React, { useEffect, useState } from 'react'
import { Cell } from '../../../components/Layout'
import { RootRow } from '../Staking.styles'
import StatsComponent from './StatsComponent'
import { UserStakingInfo } from './UserStakingInfo'
import { MASTER_BUILD } from '@core/utils/config'
import { RIN_MINT } from '@sb/dexUtils/utils'
import { getAllTokensData } from '../../Rebalance/utils'
import { useConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'
import { TokenInfo } from '@sb/dexUtils/types'
import { getStakingPoolInfo } from '@core/graphql/queries/staking/getStakingPool'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { compose } from 'recompose'
import { StakingPool } from '@sb/dexUtils/staking/types'

interface StakingComponentProps {
  getStakingPoolInfoQuery: { getStakingPoolInfo: StakingPool }
}

const StakingComponent: React.FC<StakingComponentProps> = (
  props: StakingComponentProps
) => {
  const { getStakingPoolInfoQuery } = props

  // TODO: Remove on prod
  const MINT_ADDRESS = MASTER_BUILD
    ? RIN_MINT
    : 'BCP6eCN2W1Z918hVoF3q9xw79AxFHsVxM4RSPxxKXL2m'

  const { wallet, connected } = useWallet()
  const connection = useConnection()

  const [tokenData, setTokenData] = useState<TokenInfo | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const atd = await getAllTokensData(wallet.publicKey, connection)
      const tokenData = atd.find((token) => token.mint === MINT_ADDRESS)
      if (tokenData) {
        setTokenData(tokenData)
      }
    }
    if (connected) {
      fetchData()
    }
  }, [wallet, connected])

  return (
    <>
      <RootRow>
        <Cell col={12} colLg={6}>
          <UserStakingInfo
            stakingPool={getStakingPoolInfoQuery.getStakingPoolInfo}
            tokenMint={MINT_ADDRESS}
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
    fetchPolicy: 'cache-and-network',
  })
)(StakingComponent)
