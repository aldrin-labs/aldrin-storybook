import { BN } from 'bn.js'
import React, { useEffect, useState } from 'react'

import { Page } from '@sb/components/Layout'
import { useConnection } from '@sb/dexUtils/connection'
import { signAndSendTransactions } from '@sb/dexUtils/transactions'
import { useWallet } from '@sb/dexUtils/wallet'

import { buildTransactions } from '@core/solana'
import { loadPoolData } from '@core/solana/programs/amm/fetchers/loadPool'
import { depositLiquidityPoolTransaction } from '@core/solana/programs/amm/instructions/depositLiquidityTransaction'

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

  const { wallet } = useWallet()
  const connection = useConnection()
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
  const isUserHavePools = true

  const createPool = async () => {
    const poolsData = await loadPoolData({ wallet, connection })
    const pool = poolsData.filter((p) => {
      return p.account.admin.toString() === wallet.publicKey.toString()
    })[0]

    const depositLiquidity = await depositLiquidityPoolTransaction({
      wallet,
      connection,
      maxAmountTokens: new BN(0.001),
      pool,
    })

    const tx = buildTransactions(
      depositLiquidity.instructions.map((instruction) => ({ instruction })),
      wallet.publicKey,
      depositLiquidity.signers
    )

    const status = await signAndSendTransactions({
      transactionsAndSigners: tx,
      wallet,
      connection,
    })

    console.log({ status })
  }

  // VaC2ZcdAdaqhBMH3rkC9ZdvPrgQBhvp5smnmD7Hm71

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
                createPool()
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
        {tableView === 'yourPools' && (
          <>
            <PoolInfo />
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
        open={isPoolsDetailsPopupOpen}
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
