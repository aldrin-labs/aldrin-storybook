import { COLORS } from '@variables/variables'
import React from 'react'

import { Cell } from '@sb/components/Layout'

import { Loader } from '../../../components/Loader/Loader'
import { useStakingPoolInfo } from '../../../dexUtils/staking/hooks'
import { RootRow } from '../styles'
import UserStakingInfo from './UserStakingInfo'

const StakingComponent = () => {
  const { data: poolInfo } = useStakingPoolInfo()

  if (!poolInfo) {
    return (
      <>
        <br /> <Loader color={COLORS.white} width="5em" />
      </>
    )
  }

  return (
    <>
      <RootRow>
        <Cell col={12} colLg={12}>
          <UserStakingInfo
            buyBackAmount={poolInfo.buyBackAmount}
            stakingPool={poolInfo.poolInfo}
            currentFarmingState={poolInfo.currentFarmingState}
            treasuryDailyRewards={poolInfo.treasuryDailyRewards}
          />
        </Cell>
      </RootRow>
    </>
  )
}

export default StakingComponent
