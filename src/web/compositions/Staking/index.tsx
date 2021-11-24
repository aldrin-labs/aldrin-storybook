import React from 'react'
import { Content } from '../../components/Layout'
import { BlockWithHints } from './components/BlockWithHints'
import StakingComponent from './components/StakingComponent'
import { CenteredPage } from './styles'

export const Staking = () => {
  return (
    <CenteredPage>
      <Content>
        <StakingComponent />
        <BlockWithHints />
      </Content>
    </CenteredPage>
  )
}
