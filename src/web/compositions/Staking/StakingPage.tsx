import React from 'react'

import { Row, Cell, WideContent } from '@sb/components/Layout'

import { MarinadeStakingBlock } from './components/MarinadeStakingBlock'
import { PlutoniasStakingBlock } from './components/PlutoniansStaking/PlutoniansStaking'
import { RinStakingBlock } from './components/RinStakingBlock'
import { Page } from './styles'
import { createNewHarvestPeriod } from '../../dexUtils/farming'

export const StakingPage: React.FC = () => {
  const createFarm = () => {
    createNewHarvestPeriod({

    })
  }
  return (
    <Page>
      <WideContent>
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
      </WideContent>
    </Page>
  )
}
