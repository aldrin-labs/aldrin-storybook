import React from 'react'

import { CLiquidityIcon, YourPoolsIcon, YourPositionsIcon } from '../Icons'
import { Container, SwitcherButton } from './index.styles'

export const TablesSwitcher = ({
  setTableView,
  tableView,
  isUserHavePositions,
  isUserHavePools,
  setIsFiltersShown,
}: {
  setTableView: (a: string) => void
  tableView: string
  isUserHavePositions: boolean
  isUserHavePools: boolean
  setIsFiltersShown: (a: boolean) => void
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
      {/* <SwitcherButton
        isActive={tableView === 'concentratedLiquidity'}
        onClick={() => {
          setTableView('concentratedLiquidity')
        }}
      >
        <FlashIcon isActive={tableView === 'concentratedLiquidity'} />
        Concentrated Liquidity
      </SwitcherButton> */}
      {isUserHavePositions && (
        <SwitcherButton
          isActive={tableView === 'yourPositions'}
          onClick={() => {
            setTableView('yourPositions')
            setIsFiltersShown(false)
          }}
        >
          <YourPositionsIcon isActive={tableView === 'yourPositions'} /> Your
          Positions
        </SwitcherButton>
      )}
      {isUserHavePools && (
        <SwitcherButton
          isActive={tableView === 'yourPools'}
          onClick={() => {
            setTableView('yourPools')
            setIsFiltersShown(false)
          }}
        >
          <YourPoolsIcon isActive={tableView === 'yourPools'} /> Your Pools
        </SwitcherButton>
      )}
    </Container>
  )
}
