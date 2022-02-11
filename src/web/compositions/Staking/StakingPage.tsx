import React from 'react'

import { Row, Cell } from '@sb/components/Layout'

import { MarinadeStakingBlock } from './components/MarinadeStakingBlock'
import { PlutoniasStakingBlock } from './components/PlutoniansStaking/PlutoniansStaking'
import { RinStakingBlock } from './components/RinStakingBlock'
import { Content, Page } from './styles'

export const StakingPage: React.FC = () => {
  return (
    <Page>
      <Content>
        <Row>
          <Cell col={12} colXl={6}>
            <RinStakingBlock />
          </Cell>
          <Cell col={12} colLg={6} colXl={3}>
            <MarinadeStakingBlock />
          </Cell>
          <Cell col={12} colLg={6} colXl={3}>
            <PlutoniasStakingBlock />
          </Cell>
        </Row>
      </Content>
    </Page>
  )
}
