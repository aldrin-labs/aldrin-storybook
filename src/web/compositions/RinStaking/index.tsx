import React from 'react'

import { Content } from '../../components/Layout'
import { BlockWithHints } from './components/BlockWithHints'
import StakingComponent from './components/StakingComponent'
import { StakingPage } from './styles'

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
