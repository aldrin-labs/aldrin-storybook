import React from 'react'

import { Container, SwitcherButton } from './index.styles'

const tables = [
  { name: 'Classic Liquidity', key: 'classicLiquidity' },
  { name: 'Concentrated Liquidity', key: 'concentratedLiquidity' },
]

export const Switcher = ({
  setTableView,
  tableView,
}: {
  setTableView: (a: string) => void
  tableView: string
}) => {
  return (
    <Container>
      {tables.map((table) => (
        <SwitcherButton
          isActive={tableView === table.key}
          onClick={() => {
            setTableView(table.key)
          }}
        >
          {table.name}
        </SwitcherButton>
      ))}
    </Container>
  )
}
