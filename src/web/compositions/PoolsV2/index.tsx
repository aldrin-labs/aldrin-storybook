import { PublicKey } from '@solana/web3.js'
import React, { useEffect, useState } from 'react'

import { Page } from '@sb/components/Layout'
import { useConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'

import { buildTransactions, RIN_MINT } from '@core/solana'
import { buildCreatePoolInstruction } from '@core/solana/programs/amm/instructions/createPoolTransaction'

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
import { createPoolTransaction } from '@core/solana/programs/amm/instructions/createPoolTransaction2'
import { signAndSendTransactions } from '@sb/dexUtils/transactions'

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
    const createPool = await createPoolTransaction({
      wallet,
      connection,
      amplifier: 0,
      tokenMintA: RIN_MINT,
      tokenMintB: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    })

    console.log({ createPool })

    const ts = buildTransactions(
      createPool.instructions.map((instr) => ({ instruction: instr })),
      wallet.publicKey,
      createPool.signers
    )

    const signedTs = await signAndSendTransactions({
      transactionsAndSigners: ts,
      wallet,
      connection,
    })

    console.log({ signedTs })
  }

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
