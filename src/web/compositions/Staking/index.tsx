import React from 'react'
import { Content, StakingPage } from '../../components/Layout'
import { BlockWithHints } from './components/BlockWithHints'
import StakingComponent from './components/StakingComponent'
import { CenteredPage } from './styles'

export const Staking = () => {
  return (
    <StakingPage>
      <Content>
        <StakingComponent />
        <BlockWithHints />
      </Content>
    </StakingPage>
  )
}
