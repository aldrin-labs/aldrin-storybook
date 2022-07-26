import React from 'react'

import { RootRow } from '../../index.styles'
import { Container } from '../TableRow/index.styles'
import {
  Container as SwitcherContainer,
  SwitcherButton,
} from '../TablesSwitcher/index.styles'
import { PositionCard } from './PositionCard'

export const PositionsCounter = () => {
  return (
    <SwitcherContainer $variant="text">
      Classic Liquidity Positions{' '}
      <SwitcherButton $variant="text">1</SwitcherButton>
    </SwitcherContainer>
  )
}

export const PositionInfo = () => {
  return (
    <RootRow margin="30px 0 0 0">
      <Container height="auto" margin="0" width="100%">
        <PositionCard />
      </Container>
    </RootRow>
  )
}
