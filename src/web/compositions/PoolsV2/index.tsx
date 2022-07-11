import React, { useEffect, useState } from 'react'
import { useTheme } from 'styled-components'

import { Button } from '@sb/components/Button'
import { Page } from '@sb/components/Layout'

import { TVLChart } from './components/Charts/TVLChart/TotalValueLockedChart'
import { VolumeChart } from './components/Charts/VolumeChart/TradingVolumeChart'
import { PlusIcon } from './components/Icons'
import { Switcher } from './components/TablesSwitcher'
import { RootRow, StyledWideContent, ButtonsContainer } from './index.styles'

export const PoolsComponent: React.FC = () => {
  const theme = useTheme()
  const [tableView, setTableView] = useState('classicLiquidity')
  useEffect(() => {
    document.title = 'Aldrin | Liquidity Pools'
    return () => {
      document.title = 'Aldrin'
    }
  }, [])

  return (
    <Page>
      <StyledWideContent>
        <RootRow>
          <Switcher tableView={tableView} setTableView={setTableView} />
          <ButtonsContainer>
            <Button
              $borderRadius="md"
              $padding="xl"
              $width="rg"
              $fontSize="sm"
              $variant="violet"
              as="a"
              href="https://docs.aldrin.com/amm/aldrin-pools-guide-for-farmers"
              target="_blank"
            >
              Aldrin Pools Guide
            </Button>
            <Button
              $borderRadius="md"
              $padding="xl"
              $width="rg"
              $fontSize="sm"
              $variant="violet"
            >
              <PlusIcon />
              Create Pool
            </Button>
          </ButtonsContainer>
        </RootRow>
        <RootRow>
          <TVLChart />
          <VolumeChart />
        </RootRow>
      </StyledWideContent>
    </Page>
  )
}
