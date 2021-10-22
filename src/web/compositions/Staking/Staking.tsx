import React from 'react'
import { Theme } from '@sb/types/materialUI'
import { Content, Page } from '../../components/Layout'
import { BlockWithHints } from './components/BlockWithHints'
import { StakingComponent } from './components/StakingComponent'

export const Staking = ({ theme }: { theme: Theme }) => {
  return (
    <Page>
      <Content>
        <StakingComponent />
        <BlockWithHints />
      </Content>
    </Page>
  )
}
