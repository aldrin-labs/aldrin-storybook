import { Theme } from '@sb/types/materialUI'
import React from 'react'
import { Content, Page } from '../../components/Layout'
import { StakingComponent } from './components/StakingComponent'
import { BlockWithHints } from './components/BlockWithHints'

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
