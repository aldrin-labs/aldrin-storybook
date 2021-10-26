import React from 'react'
import { Content, Page } from '../../components/Layout'
import { BlockWithHints } from './components/BlockWithHints'
import StakingComponent from './components/StakingComponent'

export const Staking = () => {
  return (
    <Page>
      <Content>
        <StakingComponent />
        <BlockWithHints />
      </Content>
    </Page>
  )
}
