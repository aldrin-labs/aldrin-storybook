import React, { useEffect, useState } from 'react'
import { useTheme } from 'styled-components'

import { Page } from '@sb/components/Layout'

import { TVLChart, VolumeChart } from './components/Charts'
import { ExtendedFiltersSection } from './components/FiltersSection'
import { FilterIcon, PlusIcon } from './components/Icons'
import { PoolsDetails } from './components/Popups/PoolsDetails'
import { SearchInput } from './components/SearchInput'
import { TableRow } from './components/TableRow'
import { TablesSwitcher } from './components/TablesSwitcher'
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
  const [isPoolsDetailsPopupOpen, setIsPoolsDetailsPopupOpen] = useState(false)
  const theme = useTheme()
  useEffect(() => {
    document.title = 'Aldrin | Liquidity Pools'
    return () => {
      document.title = 'Aldrin'
    }
  }, [])

  const isUserHavePools = true
  const isUserHavePositions = false

  return (
    <Page>
      <StyledWideContent>
        <RootRow>
          <TablesSwitcher
            isUserHavePools={isUserHavePools}
            isUserHavePositions={isUserHavePositions}
            tableView={tableView}
            setTableView={setTableView}
          />
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
        <TableRow
          setIsPoolsDetailsPopupOpen={setIsPoolsDetailsPopupOpen}
          isFiltersShown={isFiltersShown}
        />
        {/* <EmptyRow /> */}
      </StyledWideContent>
      <PoolsDetails
        open={isPoolsDetailsPopupOpen}
        onClose={() => {
          setIsPoolsDetailsPopupOpen(false)
        }}
      />
    </Page>
  )
}
