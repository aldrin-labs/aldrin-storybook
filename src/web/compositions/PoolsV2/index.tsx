import React, { useEffect, useState } from 'react'

import { Page } from '@sb/components/Layout'

import { TVLChart, VolumeChart } from './components/Charts'
import { ExtendedFiltersSection } from './components/FiltersSection'
import { FilterIcon, PlusIcon } from './components/Icons'
import { PoolsDetails } from './components/Popups/PoolsDetails'
import { SearchInput } from './components/SearchInput'
import { TableRow } from './components/TableRow'
import { TablesSwitcher } from './components/TablesSwitcher'
import { PositionInfo } from './components/YourPositions'
import { PositionsSwitcher } from './components/YourPositions/Switcher'
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
  const [positionsDataView, setPositionsDataView] = useState('simple')
  const [isFiltersShown, setIsFiltersShown] = useState(false)
  const [isPoolsDetailsPopupOpen, setIsPoolsDetailsPopupOpen] = useState(false)

  useEffect(() => {
    document.title = 'Aldrin | Liquidity Pools'
    return () => {
      document.title = 'Aldrin'
    }
  }, [])

  const isUserHavePositions = true

  return (
    <Page>
      <StyledWideContent>
        <RootRow>
          <TablesSwitcher
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
        {tableView === 'classicLiquidity' && (
          <RootRow margin="30px 0 0 0">
            <TVLChart />
            <VolumeChart />
          </RootRow>
        )}
        {tableView === 'yourPositions' && (
          <>
            <PositionsSwitcher
              positionsDataView={positionsDataView}
              setPositionsDataView={setPositionsDataView}
            />
            <PositionInfo />
          </>
        )}
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
