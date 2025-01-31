import React, { useMemo, useState } from 'react'
import { Route, useHistory } from 'react-router'
import { Link, useRouteMatch } from 'react-router-dom'
import { compose } from 'recompose'

import { FlexBlock } from '@sb/components/Layout'
import SvgIcon from '@sb/components/SvgIcon'
import { Text } from '@sb/components/Typography'
import {
  DexTokensPrices,
  FeesEarned,
  PoolInfo,
  TradingVolumeStats,
} from '@sb/compositions/Pools/index.types'
import { getUserPoolsFromAll } from '@sb/compositions/Pools/utils/getUserPoolsFromAll'
import { useConnection } from '@sb/dexUtils/connection'
import { useFarmingCalcAccounts } from '@sb/dexUtils/pools/hooks'
import { useFarmingTicketsMap } from '@sb/dexUtils/pools/hooks/useFarmingTicketsMap'
import { usePoolsInfo } from '@sb/dexUtils/pools/hooks/usePoolsInfo'
import { CURVE } from '@sb/dexUtils/pools/types'
import { useUserTokenAccounts } from '@sb/dexUtils/token/hooks'
import { useVestings } from '@sb/dexUtils/vesting'
import { useWallet } from '@sb/dexUtils/wallet'
import { withPublicKey } from '@sb/hoc/withPublicKey'
import { toMap } from '@sb/utils'

import { AUTHORIZED_POOLS } from '@core/config/dex'
import { fixCorruptedFarmingStates } from '@core/solana'

import KudelskiLogo from '@icons/kudelski.svg'

import { PoolPage } from '../../PoolPage'
import { CreatePoolModal } from '../../Popups'
import { AMMAuditPopup } from '../../Popups/AMMAuditPopup/AMMAuditPopup'
import { RestakeAllPopup } from '../../Popups/RestakeAllPopup'
import { AllPoolsTable } from '../AllPools'
import { UserLiquidityTable } from '../UserLiquidity'
import PlusIcon from './icons/plus.svg'
import {
  AddPoolButton,
  InputWrap,
  SearchInput,
  TabContainer,
  TableContainer,
  TableModeButton,
  AuditInfo,
  IconWrap,
} from './styles'

export type PoolsInfo = { getPoolsInfo: PoolInfo[] }

interface TableSwitcherProps {
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
  getFeesEarnedByAccountQuery: { getFeesEarnedByAccount: FeesEarned[] }
  getFeesEarnedByPoolQuery: { getFeesEarnedByPool: FeesEarned[] }
  getWeeklyAndDailyTradingVolumesForPoolsQuery: {
    getWeeklyAndDailyTradingVolumesForPools?: TradingVolumeStats[]
  }
}

const TableSwitcherComponent: React.FC<TableSwitcherProps> = (props) => {
  const {
    getDexTokensPricesQuery: { getDexTokensPrices = [] } = {
      getDexTokensPricesQuery: { getDexTokensPrices: [] },
    },
    getFeesEarnedByAccountQuery: { getFeesEarnedByAccount = [] } = {
      getFeesEarnedByAccountQuery: { getFeesEarnedByAccount: [] },
    },
    getFeesEarnedByPoolQuery: { getFeesEarnedByPool = [] } = {
      getFeesEarnedByPoolQuery: { getFeesEarnedByPool: [] },
    },
    getWeeklyAndDailyTradingVolumesForPoolsQuery = {
      getWeeklyAndDailyTradingVolumesForPools: [],
    },
  } = props

  const [rawPools, getPoolsInfoQueryRefetch] = usePoolsInfo()

  // console.debug('[usePoolsInfo] poolsInfo: ', rawPools)
  // console.debug('[usePoolsInfo] refresh: ', refresh)

  const [searchValue, setSearchValue] = useState('')
  const [isAuditPopupOpen, setIsAuditPopupOpen] = useState(false)
  const [selectedTable, setSelectedTable] = useState<
    'authorized' | 'nonAuthorized' | 'stablePools' | 'userLiquidity' | 'all'
  >('all')

  const { path } = useRouteMatch()

  const onChangeSearch = (value: string) => {
    if (!`${value}`.match(/[a-zA-Z1-9]/) && value !== '') {
      return
    }

    setSearchValue(value)
  }

  const { wallet } = useWallet()
  const connection = useConnection()
  const history = useHistory()

  const [userTokensData, refreshUserTokensData] = useUserTokenAccounts()
  const { data: calcAccounts, mutate: refreshCalcAccounts } =
    useFarmingCalcAccounts()

  // const [snapshotQueues] = useSnapshotQueues()

  const pools = rawPools.map((pool) => {
    return {
      ...pool,
      farming: fixCorruptedFarmingStates(pool.farming),
    }
  })

  const [farmingTicketsMap, refreshFarmingTickets] = useFarmingTicketsMap({
    wallet,
    connection,
    pools,
    snapshotQueues: [], // TODO:
  })

  const refreshAll = () => {
    refreshUserTokensData()
    refreshFarmingTickets()
    refreshCalcAccounts()
  }

  const dexTokensPricesMap = toMap(
    getDexTokensPrices,
    (tokenPrice) => tokenPrice.symbol
  )

  const feesByPoolMap = toMap(getFeesEarnedByPool, (fees) => fees.pool.trim())

  const earnedFeesInPoolForUserMap = toMap(
    getFeesEarnedByAccount,
    (feesEarned) => feesEarned.pool.trim()
  )

  const [vestings] = useVestings()

  const vestingsByMintForUser = toMap(
    vestings.filter((v) =>
      wallet.publicKey ? v.beneficiary.equals(wallet.publicKey) : false
    ),
    (v) => v.mint.toBase58()
  )

  const userLiquidityPools = getUserPoolsFromAll({
    poolsInfo: pools,
    allTokensData: userTokensData,
    farmingTicketsMap,
    vestings: vestingsByMintForUser,
    walletPublicKey: wallet.publicKey,
    calcAccounts,
  })

  const stablePools = pools.filter((pool) => pool.curveType === CURVE.STABLE)

  const authorizedPools = pools.filter((pool) =>
    AUTHORIZED_POOLS.includes(pool.poolTokenMint)
  )
  const nonAuthorizedPools = pools.filter(
    (pool) => !AUTHORIZED_POOLS.includes(pool.poolTokenMint)
  )

  const tradingVolumes =
    getWeeklyAndDailyTradingVolumesForPoolsQuery.getWeeklyAndDailyTradingVolumesForPools ||
    []

  const tradingVolumesMap = toMap(tradingVolumes, (tv) => tv.pool.trim())

  const activePoolsList = useMemo(() => {
    if (selectedTable === 'authorized') {
      return authorizedPools
    }
    if (selectedTable === 'nonAuthorized') {
      return nonAuthorizedPools
    }
    if (selectedTable === 'stablePools') {
      return stablePools
    }
    if (selectedTable === 'userLiquidity') {
      return userLiquidityPools
    }
    return pools
  }, [selectedTable, pools])

  const poolsLength = activePoolsList.length

  const tableHeight = Math.min(poolsLength * 13, 80)

  return (
    <>
      <TabContainer>
        <div>
          <TableModeButton
            data-testid="pools-mode-all-pools"
            isActive={selectedTable === 'all'}
            onClick={() => setSelectedTable('all')}
          >
            All Pools ({pools.length})
          </TableModeButton>
          <TableModeButton
            data-testid="pools-mode-aldrin-led-pools"
            isActive={selectedTable === 'authorized'}
            onClick={() => setSelectedTable('authorized')}
          >
            Aldrin-led Pools ({authorizedPools.length})
          </TableModeButton>
          <TableModeButton
            data-testid="pools-mode-eco-led-pools"
            isActive={selectedTable === 'nonAuthorized'}
            onClick={() => setSelectedTable('nonAuthorized')}
          >
            Ecosystem-led Pools ({nonAuthorizedPools.length})
          </TableModeButton>

          <TableModeButton
            data-testid="pools-mode-stable-pools"
            isActive={selectedTable === 'stablePools'}
            onClick={() => setSelectedTable('stablePools')}
          >
            Stable Pools ({stablePools.length})
          </TableModeButton>

          <TableModeButton
            data-testid="pools-mode-user-liquidity-pools"
            isActive={selectedTable === 'userLiquidity'}
            onClick={() => setSelectedTable('userLiquidity')}
          >
            Your liquidity ({userLiquidityPools.length})
          </TableModeButton>
        </div>
        <InputWrap>
          <FlexBlock alignItems="center">
            <SearchInput
              data-testid="pools-search-field"
              name="search"
              placeholder="Search..."
              size="8"
              value={searchValue}
              onChange={onChangeSearch}
              append={
                <IconWrap>
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.9639 11.1375L8.06847 7.24197C8.67296 6.46047 8.99996 5.50498 8.99996 4.49998C8.99996 3.29699 8.53046 2.16899 7.68147 1.31849C6.83247 0.467998 5.70148 0 4.49998 0C3.29849 0 2.16749 0.469498 1.31849 1.31849C0.467998 2.16749 0 3.29699 0 4.49998C0 5.70148 0.469498 6.83247 1.31849 7.68147C2.16749 8.53196 3.29699 8.99996 4.49998 8.99996C5.50498 8.99996 6.45897 8.67296 7.24047 8.06996L11.136 11.9639C11.1474 11.9754 11.1609 11.9844 11.1759 11.9906C11.1908 11.9968 11.2068 12 11.223 12C11.2391 12 11.2551 11.9968 11.27 11.9906C11.285 11.9844 11.2985 11.9754 11.31 11.9639L11.9639 11.3115C11.9754 11.3 11.9844 11.2865 11.9906 11.2715C11.9968 11.2566 12 11.2406 12 11.2245C12 11.2083 11.9968 11.1923 11.9906 11.1774C11.9844 11.1624 11.9754 11.1489 11.9639 11.1375ZM6.87597 6.87597C6.23997 7.51047 5.39698 7.85997 4.49998 7.85997C3.60298 7.85997 2.75999 7.51047 2.12399 6.87597C1.48949 6.23997 1.13999 5.39698 1.13999 4.49998C1.13999 3.60298 1.48949 2.75849 2.12399 2.12399C2.75999 1.48949 3.60298 1.13999 4.49998 1.13999C5.39698 1.13999 6.24147 1.48799 6.87597 2.12399C7.51047 2.75999 7.85997 3.60298 7.85997 4.49998C7.85997 5.39698 7.51047 6.24147 6.87597 6.87597Z"
                      fill="#F5F5FB"
                    />
                  </svg>
                </IconWrap>
              }
            />
            <AddPoolButton
              data-testid="pools-create-pool-btn"
              as={Link}
              to={`${path}/create`}
            >
              <SvgIcon src={PlusIcon} width="1.2em" />
              &nbsp;Create a Pool
            </AddPoolButton>
          </FlexBlock>
          <AuditInfo onClick={() => setIsAuditPopupOpen(true)}>
            <div>
              <Text color="white1" margin="0" size="sm">
                Audited by
              </Text>
            </div>
            <SvgIcon
              width="5em"
              height="auto"
              style={{ marginTop: '1rem' }}
              src={KudelskiLogo}
            />
          </AuditInfo>
        </InputWrap>
      </TabContainer>

      <TableContainer>
        {selectedTable === 'authorized' && (
          <AllPoolsTable
            searchValue={searchValue}
            pools={authorizedPools}
            dexTokensPricesMap={dexTokensPricesMap}
            feesByPool={feesByPoolMap}
            tradingVolumes={tradingVolumesMap}
            farmingTicketsMap={farmingTicketsMap}
          />
        )}

        {selectedTable === 'nonAuthorized' && (
          <AllPoolsTable
            searchValue={searchValue}
            pools={nonAuthorizedPools}
            dexTokensPricesMap={dexTokensPricesMap}
            feesByPool={feesByPoolMap}
            tradingVolumes={tradingVolumesMap}
            farmingTicketsMap={farmingTicketsMap}
          />
        )}
        {selectedTable === 'all' && (
          <AllPoolsTable
            searchValue={searchValue}
            pools={pools}
            dexTokensPricesMap={dexTokensPricesMap}
            feesByPool={feesByPoolMap}
            tradingVolumes={tradingVolumesMap}
            farmingTicketsMap={farmingTicketsMap}
          />
        )}
        {selectedTable === 'stablePools' && (
          <AllPoolsTable
            searchValue={searchValue}
            pools={stablePools}
            dexTokensPricesMap={dexTokensPricesMap}
            feesByPool={feesByPoolMap}
            tradingVolumes={tradingVolumesMap}
            farmingTicketsMap={farmingTicketsMap}
          />
        )}
        {selectedTable === 'userLiquidity' && (
          <UserLiquidityTable
            searchValue={searchValue}
            pools={userLiquidityPools}
            dexTokensPricesMap={dexTokensPricesMap}
            allTokensData={userTokensData}
            farmingTicketsMap={farmingTicketsMap}
            feesByPoolForUser={earnedFeesInPoolForUserMap}
          />
        )}
      </TableContainer>

      <Route path={`${path}/create`}>
        <CreatePoolModal
          refetchPools={getPoolsInfoQueryRefetch}
          onClose={() => history.push(`${path}`)}
          dexTokensPricesMap={dexTokensPricesMap}
        />
      </Route>
      <Route path={`${path}/:symbol`}>
        <PoolPage
          pools={pools}
          prices={dexTokensPricesMap}
          tradingVolumes={tradingVolumesMap}
          fees={getFeesEarnedByPool}
          farmingTickets={farmingTicketsMap}
          userTokensData={userTokensData}
          earnedFees={earnedFeesInPoolForUserMap}
          refreshUserTokensData={refreshUserTokensData}
          refreshAll={refreshAll}
          vestingsForWallet={vestingsByMintForUser}
          refetchPools={getPoolsInfoQueryRefetch}
        />
      </Route>

      <AMMAuditPopup
        open={isAuditPopupOpen}
        close={() => setIsAuditPopupOpen(false)}
      />

      {wallet.publicKey && (
        <RestakeAllPopup
          wallet={wallet}
          connection={connection}
          allPoolsData={pools}
          allTokensData={userTokensData}
          farmingTicketsMap={farmingTicketsMap}
          refreshTokensWithFarmingTickets={refreshAll}
        />
      )}
    </>
  )
}

export const TableSwitcher = compose<TableSwitcherProps, any>(withPublicKey)(
  TableSwitcherComponent
)
