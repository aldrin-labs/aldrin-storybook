import React from 'react'

import { CLiquidityIcon, YourPositionsIcon } from '../Icons'
import { Container, SwitcherButton } from './index.styles'

export const TablesSwitcher = ({
  setTableView,
  tableView,
  isUserHavePositions,
}: {
  setTableView: (a: string) => void
  tableView: string
  isUserHavePositions: boolean
}) => {
  return (
    <Container>
      <SwitcherButton
        isActive={tableView === 'classicLiquidity'}
        onClick={() => {
          setTableView('classicLiquidity')
        }}
      >
        <CLiquidityIcon isActive={tableView === 'classicLiquidity'} /> Classic
        Liquidity
      </SwitcherButton>
      {isUserHavePositions && (
        <SwitcherButton
          isActive={tableView === 'yourPositions'}
          onClick={() => {
            setTableView('yourPositions')
          }}
        >
          <YourPositionsIcon isActive={tableView === 'yourPositions'} /> Your
          Positions
        </SwitcherButton>
      )}
    </Container>
  )
}
