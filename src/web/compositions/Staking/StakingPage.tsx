import React from 'react'

import { BlackPage, Row, Cell } from '@sb/components/Layout'

import { MarinadeStakingBlock } from './components/MarinadeStakingBlock'
import { PlutoniasStakingBlock } from './components/PlutoniansStaking/PlutoniansStaking'
import { RinStakingBlock } from './components/RinStakingBlock'
import { Content } from './styles'

export const StakingPage: React.FC = (props) => {
  return (
    <BlackPage>
      <Content>
        <Row>
          <Cell col={12} colLg={6}>
            <RinStakingBlock />
          </Cell>
          <Cell col={6} colLg={3}>
            <MarinadeStakingBlock />
          </Cell>
          <Cell col={6} colLg={3}>
            <PlutoniasStakingBlock />
          </Cell>
        </Row>
      </Content>
    </BlackPage>
  )
}
