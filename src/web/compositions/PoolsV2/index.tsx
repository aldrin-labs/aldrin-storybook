import React, { useEffect, useState } from 'react'

import { Page } from '@sb/components/Layout'

import { TVLChart, VolumeChart } from './components/Charts'
import { ExtendedFiltersSection } from './components/FiltersSection'
import { FilterIcon, PlusIcon } from './components/Icons'
import { CreatePoolModal } from './components/Popups/CreatePool'
import { Row } from './components/Popups/index.styles'
import { PoolsDetails } from './components/Popups/PoolsDetails'
import { SearchInput } from './components/SearchInput'
import { TableRow } from './components/TableRow'
import { TablesSwitcher } from './components/TablesSwitcher'
import { Container as SwitcherContainer } from './components/TablesSwitcher/index.styles'
import { PositionInfo } from './components/YourPositions'
import { PositionsCharts } from './components/YourPositions/PositionsChart'
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
  const [isCreatePoolPopupOpen, setIsCreatPoolPopupOpen] = useState(false)

  const positionsAmount = 2
  const showPositionsChart =
    tableView === 'yourPositions' && positionsAmount > 1

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
            setIsFiltersShown={setIsFiltersShown}
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
            <SButton
              onClick={() => setIsCreatPoolPopupOpen(true)}
              $borderRadius="md"
              $width="rg"
              $variant="violet"
            >
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
        {showPositionsChart && <PositionsCharts />}
        {tableView === 'yourPositions' && (
          <>
            <PositionsSwitcher
              positionsDataView={positionsDataView}
              setPositionsDataView={setPositionsDataView}
            />
            <PositionInfo positionsDataView={positionsDataView} />
          </>
        )}
        {tableView === 'classicLiquidity' && (
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
        )}
        {tableView === 'yourPositions' && (
          <Row margin="30px 0 0 0" width="100%">
            <SwitcherContainer $variant="text">
              You can also try
            </SwitcherContainer>
          </Row>
        )}
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
      <CreatePoolModal
        open={isCreatePoolPopupOpen}
        onClose={() => setIsCreatPoolPopupOpen(false)}
      />
    </Page>
  )
}
