import React, { useEffect, useState } from 'react'

import { Page } from '@sb/components/Layout'
import { Pool } from '@sb/dexUtils/amm/types'
import { useConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'

import { getAllTokensData, TokenInfo } from '@core/solana'
import { loadPoolData } from '@core/solana/programs/amm/fetchers/loadPool'

import { ConnectWalletPopup } from '../Chart/components/ConnectWalletPopup/ConnectWalletPopup'
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
import { PoolInfo } from './components/YourPools'
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
  const [isConnectWalletPopupOpen, setIsConnectWalletPopupOpen] =
    useState(false)
  const [selectedPool, selectPool] = useState<Pool>()
  const [allTokensData, setAllTokensData] = useState<TokenInfo[]>([])

  const { wallet } = useWallet()
  const connection = useConnection()

  const positionsAmount = 2
  const showPositionsChart =
    tableView === 'yourPositions' && positionsAmount > 1
  const isUserHavePositions = true
  const isUserHavePools = true

  useEffect(() => {
    document.title = 'Aldrin | Liquidity Pools'

    const getPool = async () => {
      const poolsData = await loadPoolData({ wallet, connection })
      const pool = poolsData.filter((p) => {
        return (
          p?.account?.admin.toString() ===
          'F1wL4GpmXx7exSSMTQM3fg4vMiALuN3vh5WWxWgYK8Rm'
        )
      })[0]

      const tokensData = await getAllTokensData(wallet.publicKey, connection)

      setAllTokensData(tokensData)
      selectPool(pool)
    }
    getPool()
    return () => {
      document.title = 'Aldrin'
    }
  }, [])

  if (!selectedPool) return null

  return (
    <Page>
      <StyledWideContent>
        <RootRow>
          <TablesSwitcher
            isUserHavePositions={isUserHavePositions}
            isUserHavePools={isUserHavePools}
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
              onClick={() =>
                // setIsCreatPoolPopupOpen(true)
                {}
              }
              $borderRadius="md"
              $width="rg"
              $variant="violet"
              disabled={!wallet.connected}
            >
              <PlusIcon />
              Create Pool
            </SButton>
          </ButtonsContainer>
        </RootRow>
        {tableView === 'classicLiquidity' && (
          <RootRow margin="30px 0 0 0">
            <TVLChart />
            <VolumeChart chartHeight={80} />
          </RootRow>
        )}
        {showPositionsChart && <PositionsCharts />}
        {tableView === 'yourPositions' && (
          <>
            <PositionsSwitcher
              positionsDataView={positionsDataView}
              setPositionsDataView={setPositionsDataView}
            />
            <PositionInfo
              pool={selectedPool}
              allTokensData={allTokensData}
              positionsDataView={positionsDataView}
            />
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
        {tableView === 'yourPools' && (
          <>
            <PoolInfo pool={selectedPool} allTokensData={allTokensData} />
          </>
        )}
        {(tableView === 'classicLiquidity' ||
          tableView === 'yourPositions') && (
          <TableRow
            setIsPoolsDetailsPopupOpen={setIsPoolsDetailsPopupOpen}
            isFiltersShown={isFiltersShown}
          />
        )}
        {/* <EmptyRow /> */}
      </StyledWideContent>
      <PoolsDetails
        allTokensData={allTokensData}
        open={isPoolsDetailsPopupOpen}
        pool={selectedPool}
        onClose={() => {
          setIsPoolsDetailsPopupOpen(false)
        }}
      />
      <CreatePoolModal
        open={isCreatePoolPopupOpen}
        onClose={() => setIsCreatPoolPopupOpen(false)}
        setIsConnectWalletPopupOpen={setIsConnectWalletPopupOpen}
      />
      <ConnectWalletPopup
        open={isConnectWalletPopupOpen}
        onClose={() => setIsConnectWalletPopupOpen(false)}
      />
    </Page>
  )
}
