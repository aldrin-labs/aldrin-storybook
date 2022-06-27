import { PublicKey } from '@solana/web3.js'
import { ApolloQueryResult } from 'apollo-client'
import React, { useState } from 'react'
import { Route, useHistory } from 'react-router'
import { Link, useRouteMatch } from 'react-router-dom'
import { compose } from 'recompose'
import { DefaultTheme } from 'styled-components'

import { FlexBlock } from '@sb/components/Layout'
import { queryRendererHoc } from '@sb/components/QueryRenderer'
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
import { addHarvestV2 } from '@sb/dexUtils/farming/actions/addHarvest'
import { createNewHarvestPeriod } from '@sb/dexUtils/farming/actions/newHarvestPeriod'
import { useFarmInfo } from '@sb/dexUtils/farming/useFarmInfo'
import { useFarmingCalcAccounts } from '@sb/dexUtils/pools/hooks'
import { useFarmingTicketsMap } from '@sb/dexUtils/pools/hooks/useFarmingTicketsMap'
import { useSnapshotQueues } from '@sb/dexUtils/pools/hooks/useSnapshotQueues'
import { CURVE } from '@sb/dexUtils/pools/types'
import { useUserTokenAccounts } from '@sb/dexUtils/token/hooks'
import { useVestings } from '@sb/dexUtils/vesting'
import { useWallet } from '@sb/dexUtils/wallet'
import { withPublicKey } from '@sb/hoc/withPublicKey'
import { toMap } from '@sb/utils'

import { AUTHORIZED_POOLS } from '@core/config/dex'
import { getDexTokensPrices as getDexTokensPricesRequest } from '@core/graphql/queries/pools/getDexTokensPrices'
import { getFeesEarnedByAccount as getFeesEarnedByAccountRequest } from '@core/graphql/queries/pools/getFeesEarnedByAccount'
import { getFeesEarnedByPool as getFeesEarnedByPoolRequest } from '@core/graphql/queries/pools/getFeesEarnedByPool'
import { getPoolsInfo as getPoolsInfoRequest } from '@core/graphql/queries/pools/getPoolsInfo'
import { getWeeklyAndDailyTradingVolumesForPools as getWeeklyAndDailyTradingVolumesForPoolsRequest } from '@core/graphql/queries/pools/getWeeklyAndDailyTradingVolumesForPools'
import { DAY, endOfHourTimestamp } from '@core/utils/dateUtils'
import { getRandomInt } from '@core/utils/helpers'

import KudelskiLogo from '@icons/kudelski.svg'

import {
  initializeFarmingV2,
  startFarmingV2,
  stopFarmingV2,
} from '../../../../../dexUtils/farming/actions'
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
  getPoolsInfoQueryRefetch: () => Promise<ApolloQueryResult<PoolsInfo>>
  getPoolsInfoQuery: PoolsInfo
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
  getFeesEarnedByAccountQuery: { getFeesEarnedByAccount: FeesEarned[] }
  getFeesEarnedByPoolQuery: { getFeesEarnedByPool: FeesEarned[] }
  getWeeklyAndDailyTradingVolumesForPoolsQuery: {
    getWeeklyAndDailyTradingVolumesForPools?: TradingVolumeStats[]
  }
  theme: DefaultTheme
}

const TableSwitcherComponent: React.FC<TableSwitcherProps> = (props) => {
  const {
    getPoolsInfoQueryRefetch,
    getPoolsInfoQuery: { getPoolsInfo: pools = [] },
    getDexTokensPricesQuery: { getDexTokensPrices = [] },
    getFeesEarnedByAccountQuery: { getFeesEarnedByAccount = [] },
    getFeesEarnedByPoolQuery: { getFeesEarnedByPool = [] },
    getWeeklyAndDailyTradingVolumesForPoolsQuery,
    theme,
  } = props

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

  const [snapshotQueues] = useSnapshotQueues()

  const [farmingTicketsMap, refreshFarmingTickets] = useFarmingTicketsMap({
    wallet,
    connection,
    pools,
    snapshotQueues,
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

  const { data: farms } = useFarmInfo()
  console.log('farms', farms)

  return (
    <>
      <button
        type="button"
        onClick={async () => {
          if (!farms) {
            throw new Error('No farms')
          }
          await initializeFarmingV2({
            stakeMint: new PublicKey(
              '7bzpxU9RS9DNBgvRDGGYwoPcHjAYU8AyGjKB4eDQQuHm'
            ),
            wallet,
            connection,
          })
        }}
      >
        Create farm
      </button>
      <button
        type="button"
        onClick={async () => {
          if (!farms) {
            throw new Error('No farms')
          }
          // TODO: pass farmer address if it exists
          await startFarmingV2({
            wallet,
            connection,
            amount: 10000,
            farm:
              farms?.get('7bzpxU9RS9DNBgvRDGGYwoPcHjAYU8AyGjKB4eDQQuHm') || {},
            userTokens: userTokensData,
          })
        }}
      >
        Start farming
      </button>
      <button
        type="button"
        onClick={async () => {
          if (!farms) {
            throw new Error('No farms')
          }
          // TODO: pass farmer address if it exists
          await addHarvestV2({
            wallet,
            connection,
            amount: 10000,
            farm:
              farms?.get('7bzpxU9RS9DNBgvRDGGYwoPcHjAYU8AyGjKB4eDQQuHm') || {},
            userTokens: userTokensData,
            harvestMint: new PublicKey(
              '7bzpxU9RS9DNBgvRDGGYwoPcHjAYU8AyGjKB4eDQQuHm'
            ),
          })
        }}
      >
        Add harvest
      </button>
      <button
        type="button"
        onClick={async () => {
          if (!farms) {
            throw new Error('No farms')
          }
          await createNewHarvestPeriod({
            wallet,
            connection,
            amount: 1000,
            farm:
              farms?.get('7bzpxU9RS9DNBgvRDGGYwoPcHjAYU8AyGjKB4eDQQuHm') || {},
            userTokens: userTokensData,
            harvestMint: new PublicKey(
              '7bzpxU9RS9DNBgvRDGGYwoPcHjAYU8AyGjKB4eDQQuHm'
            ),
            startsAt: 0,
            periodLengthInSlots: 10,
          })
        }}
      >
        Add new harvest period
      </button>
      <button
        type="button"
        onClick={async () => {
          if (!farms) {
            throw new Error('No farms')
          }
          // TODO: pass farmer address if it exists
          await stopFarmingV2({
            wallet,
            connection,
            amount: 10000,
            farm:
              farms?.get('7bzpxU9RS9DNBgvRDGGYwoPcHjAYU8AyGjKB4eDQQuHm') || {},
            userTokens: userTokensData,
          })
        }}
      >
        Stop farming
      </button>
      <TabContainer>
        <div>
          <TableModeButton
            isActive={selectedTable === 'all'}
            onClick={() => setSelectedTable('all')}
          >
            All Pools ({pools.length})
          </TableModeButton>
          <TableModeButton
            isActive={selectedTable === 'authorized'}
            onClick={() => setSelectedTable('authorized')}
          >
            Aldrin-led Pools ({authorizedPools.length})
          </TableModeButton>
          <TableModeButton
            isActive={selectedTable === 'nonAuthorized'}
            onClick={() => setSelectedTable('nonAuthorized')}
          >
            Ecosystem-led Pools ({nonAuthorizedPools.length})
          </TableModeButton>

          <TableModeButton
            isActive={selectedTable === 'stablePools'}
            onClick={() => setSelectedTable('stablePools')}
          >
            Stable Pools ({stablePools.length})
          </TableModeButton>

          <TableModeButton
            isActive={selectedTable === 'userLiquidity'}
            onClick={() => setSelectedTable('userLiquidity')}
          >
            Your liquidity ({userLiquidityPools.length})
          </TableModeButton>
        </div>
        <InputWrap>
          <FlexBlock alignItems="center">
            <SearchInput
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
            <AddPoolButton as={Link} to={`${path}/create`}>
              <SvgIcon src={PlusIcon} width="1.2em" />
              &nbsp;Create a Pool
            </AddPoolButton>
          </FlexBlock>
          <AuditInfo onClick={() => setIsAuditPopupOpen(true)}>
            <div>
              <Text margin="0" size="sm">
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
            farms={farms}
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
            farms={farms}
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
            farms={farms}
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
            farms={farms}
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
            farms={farms}
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
          snapshotQueues={snapshotQueues}
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

export const TableSwitcher = compose<TableSwitcherProps, any>(
  withPublicKey,
  queryRendererHoc({
    query: getDexTokensPricesRequest,
    name: 'getDexTokensPricesQuery',
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000 * getRandomInt(1, 3),
    loaderColor: (props) => props.theme.colors.white,
  }),
  queryRendererHoc({
    name: 'getPoolsInfoQuery',
    query: getPoolsInfoRequest,
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000 * getRandomInt(1, 2),
    loaderColor: (props) => props.theme.colors.white,
  }),
  queryRendererHoc({
    query: getFeesEarnedByAccountRequest,
    name: 'getFeesEarnedByAccountQuery',
    variables: (props) => ({
      account: props.wallet.publicKey?.toString() || '',
    }),
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000 * getRandomInt(5, 10),
    loaderColor: (props) => props.theme.colors.white,
  }),
  queryRendererHoc({
    name: 'getFeesEarnedByPoolQuery',
    query: getFeesEarnedByPoolRequest,
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000 * getRandomInt(5, 10),
    loaderColor: (props) => props.theme.colors.white,
    // TODO: Comment before merge
    variables: () => ({
      timestampFrom: endOfHourTimestamp() - DAY,
      timestampTo: endOfHourTimestamp(),
    }),
  }),
  queryRendererHoc({
    name: 'getWeeklyAndDailyTradingVolumesForPoolsQuery',
    query: getWeeklyAndDailyTradingVolumesForPoolsRequest,
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000 * getRandomInt(5, 10),
    loaderColor: (props) => props.theme.colors.white,
    variables: () => ({
      dailyTimestampTo: endOfHourTimestamp(),
      dailyTimestampFrom: endOfHourTimestamp() - DAY,
      weeklyTimestampTo: endOfHourTimestamp(),
      weeklyTimestampFrom: endOfHourTimestamp() - DAY * 7,
    }),
  })
)(TableSwitcherComponent)
