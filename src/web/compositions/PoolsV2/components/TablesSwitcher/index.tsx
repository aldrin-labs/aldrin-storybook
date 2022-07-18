import React from 'react'

import { CLiquidityIcon } from '../Icons'
import { Container, SwitcherButton } from './index.styles'

export const TablesSwitcher = ({
  setTableView,
  tableView,
  isUserHavePools,
  isUserHavePositions,
}: {
  setTableView: (a: string) => void
  tableView: string
  isUserHavePools: boolean
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
          Your Positions
        </SwitcherButton>
      )}
      {isUserHavePools && (
        <SwitcherButton
          isActive={tableView === 'yourPools'}
          onClick={() => {
            setTableView('yourPools')
          }}
        >
          Your Pools
        </SwitcherButton>
      )}
    </Container>
  )
}
