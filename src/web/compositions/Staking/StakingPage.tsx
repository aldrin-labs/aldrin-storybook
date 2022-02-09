import React from 'react'

import { BlackPage, Row, Cell } from '@sb/components/Layout'

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
        </Row>
      </Content>
    </BlackPage>
  )
}
