import { Theme } from '@sb/types/materialUI'
import useMobileSize from '@webhooks/useMobileSize'
import React, { useState } from 'react'
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
