import React from 'react'

import { PositionsCounter } from '.'
import { RootRow } from '../../index.styles'
import { Container, SwitcherButton } from '../TablesSwitcher/index.styles'

export const PositionsSwitcher = ({
  positionsDataView,
  setPositionsDataView,
}: {
  positionsDataView: string
  setPositionsDataView: (a: string) => void
}) => {
  return (
    <RootRow margin="30px 0 0 0">
      <PositionsCounter />
      <Container $variant="small">
        <SwitcherButton
          isActive={positionsDataView === 'simple'}
          onClick={() => {
            setPositionsDataView('simple')
          }}
          $variant="small"
        >
          Simple
        </SwitcherButton>
        <SwitcherButton
          isActive={positionsDataView === 'detailed'}
          onClick={() => {
            setPositionsDataView('detailed')
          }}
          $variant="small"
        >
          Detailed
        </SwitcherButton>
      </Container>
    </RootRow>
  )
}
