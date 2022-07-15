import React, { useEffect, useState } from 'react'
import { useTheme } from 'styled-components'

import { Page } from '@sb/components/Layout'

import { TVLChart } from './components/Charts/TVLChart/TotalValueLockedChart'
import { VolumeChart } from './components/Charts/VolumeChart/TradingVolumeChart'
import { ExtendedFiltersSection } from './components/FiltersSection/index'
import { FilterIcon, PlusIcon } from './components/Icons'
import { SearchInput } from './components/SearchInput'
import { TableRow } from './components/TableRow'
import { Switcher } from './components/TablesSwitcher'
import {
  RootRow,
  StyledWideContent,
  ButtonsContainer,
  FilterButton,
  SButton,
  FilterRow,
} from './index.styles'

export const PoolsComponent: React.FC = () => {
  const [tableView, setTableView] = useState('classicLiquidity')
  const [isFiltersShown, setIsFiltersShown] = useState(false)
  const theme = useTheme()
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
            <SButton
              $borderRadius="md"
              $width="rg"
              $variant="violet"
              as="a"
              href="https://docs.aldrin.com/amm/aldrin-pools-guide-for-farmers"
              target="_blank"
            >
              Aldrin Pools Guide
            </SButton>
            <SButton $borderRadius="md" $width="rg" $variant="violet">
              <PlusIcon />
              Create Pool
            </SButton>
          </ButtonsContainer>
        </RootRow>
        <RootRow margin="30px 0 0 0">
          <TVLChart />
          <VolumeChart />
        </RootRow>
        <FilterRow margin="30px auto 15px auto">
          <SearchInput />
          <FilterButton
            isActive={isFiltersShown}
            onClick={() => {
              setIsFiltersShown(!isFiltersShown)
            }}
          >
            <FilterIcon isActive={isFiltersShown} />
            Filters
          </FilterButton>
        </FilterRow>
        {isFiltersShown && <ExtendedFiltersSection />}
        <TableRow isFiltersShown={isFiltersShown} />
      </StyledWideContent>
    </Page>
  )
}
