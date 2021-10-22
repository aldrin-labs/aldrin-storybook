import React from 'react'
import { Cell } from '../../../components/Layout'
import { RootRow } from '../Staking.styles'
import StatsComponent from './StatsComponent'
import { UserStakingInfo } from './UserStakingInfo'

export const StakingComponent: React.FC = () => {
  return (
    <>
      <RootRow>
        <Cell col={12} colLg={6}>
          <UserStakingInfo />
        </Cell>
        <Cell col={12} colLg={6}>
          <StatsComponent />
        </Cell>
      </RootRow>
    </>
  )
}
