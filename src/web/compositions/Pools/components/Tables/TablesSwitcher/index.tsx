import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getDexTokensPrices as getDexTokensPricesRequest } from '@core/graphql/queries/pools/getDexTokensPrices'
import { getFeesEarnedByPool as getFeesEarnedByPoolRequest } from '@core/graphql/queries/pools/getFeesEarnedByPool'
import { getPoolsInfo as getPoolsInfoRequest } from '@core/graphql/queries/pools/getPoolsInfo'
import { getWeeklyAndDailyTradingVolumesForPools as getWeeklyAndDailyTradingVolumesForPoolsRequest } from '@core/graphql/queries/pools/getWeeklyAndDailyTradingVolumesForPools'
import { withPublicKey } from '@core/hoc/withPublicKey'
import { DAY, endOfHourTimestamp } from '@core/utils/dateUtils'
import { getRandomInt } from '@core/utils/helpers'
import KudelskiLogo from '@icons/kudelski.svg'
import Loop from '@icons/loop.svg'
import AMMAudit from '@sb/AMMAudit/AldrinAMMAuditReport.pdf'
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
import { useFarmingTicketsMap } from '@sb/dexUtils/pools/hooks/useFarmingTicketsMap'
import { useSnapshotQueues } from '@sb/dexUtils/pools/hooks/useSnapshotQueues'
import { useUserTokenAccounts } from '@sb/dexUtils/useUserTokenAccounts'
import { useWallet } from '@sb/dexUtils/wallet'
import React, { useState } from 'react'
import { Route, useHistory } from 'react-router'
import { Link, useRouteMatch } from 'react-router-dom'
import { compose } from 'recompose'
import { getFeesEarnedByAccount as getFeesEarnedByAccountRequest } from '@core/graphql/queries/pools/getFeesEarnedByAccount'
import { ApolloQueryResult } from 'apollo-client'
import { useVestings } from '@sb/dexUtils/vesting'
import { toMap } from '@sb/utils'
import { COLORS } from '@variables/variables'
import { CURVE } from '@sb/dexUtils/pools/types'
import { PoolPage } from '../../PoolPage'
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
} from './styles'
import { CreatePoolModal } from '../../Popups'
import { RestakeAllPopup } from '../../Popups/RestakeAllPopup'
import { takePoolsFarmingSnapshots } from '../../../../../dexUtils/pools/actions/takeSnapshots'

export type PoolsInfo = { getPoolsInfo: PoolInfo[] }

const AUTHORIZED_POOLS = [
  'Gubmyfw5Ekdp4pkXk9be5yNckSgCdgd7JEThx8SFzCQQ', // RIN_USDC
  '7nrkzur3LUxgfxr3TBj9GpUsiABCwMgzwtNhHKG4hPYz', // RIN_SOL
  'FC4sYMpsMvdsq8hHMEtmWA8xN25W71t2c7RycU5juX35', // mSOL_USDT
  '2JANvFVV2M8dv7twzL1EF3PhEJaoJpvSt6PhnjW6AHG6', // mSOL_ETH
  '13FjT6LMUH9LQLQn6KGjJ1GNXKvgzoDSdxvHvAd4hcan', // mSOL_BTC
  'Af4TpzGpo8Yc61bCNwactPKH9F951tHPzp8XGxWRLNE1', // mSOL_USDC
  '4GUniSDrCAZR3sKtLa1AWC8oyYubZeKJQ8KraQmy3Wt5', // SOL_USDC
  'EnKhda5n5LYbZjPv7d7WChkSXzo5RgV8eSVVkGCXsQUn', // mSOL_UST
  'CAHchWN1xoxNvXmqmmj6U834ip585rXZbh9NkvE9vTea', // mSOL_MNGO
]

interface TableSwitcherProps {
  getPoolsInfoQueryRefetch: () => Promise<ApolloQueryResult<PoolsInfo>>
  getPoolsInfoQuery: PoolsInfo
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
  getFeesEarnedByAccountQuery: { getFeesEarnedByAccount: FeesEarned[] }
  getFeesEarnedByPoolQuery: { getFeesEarnedByPool: FeesEarned[] }
  getWeeklyAndDailyTradingVolumesForPoolsQuery: {
    getWeeklyAndDailyTradingVolumesForPools?: TradingVolumeStats[]
  }
}

const TableSwitcherComponent: React.FC<TableSwitcherProps> = (props) => {
  const {
    getPoolsInfoQueryRefetch,
    getPoolsInfoQuery: { getPoolsInfo: pools = [] },
    getDexTokensPricesQuery: { getDexTokensPrices = [] },
    getFeesEarnedByAccountQuery: { getFeesEarnedByAccount = [] },
    getFeesEarnedByPoolQuery: { getFeesEarnedByPool = [] },
    getWeeklyAndDailyTradingVolumesForPoolsQuery,
  } = props

  const [searchValue, setSearchValue] = useState('')
  const [selectedTable, setSelectedTable] = useState<
    'all' | 'userLiquidity' | 'stablePools' | 'permissionlessPools'
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

  const [snapshotQueues] = useSnapshotQueues({
    wallet,
    connection,
  })

  const [farmingTicketsMap, refreshFarmingTickets] = useFarmingTicketsMap({
    wallet,
    connection,
    pools,
    snapshotQueues,
  })

  const refreshAll = () => {
    refreshUserTokensData()
    refreshFarmingTickets()
  }

  const dexTokensPricesMap = getDexTokensPrices.reduce(
    (acc, tokenPrice) => acc.set(tokenPrice.symbol, tokenPrice),
    new Map<string, DexTokensPrices>()
  )

  const feesByPoolMap = getFeesEarnedByPool.reduce(
    (acc, fees) => acc.set(fees.pool, fees),
    new Map<string, FeesEarned>()
  )

  const earnedFeesInPoolForUserMap = getFeesEarnedByAccount.reduce(
    (acc, feesEarned) => acc.set(feesEarned.pool, feesEarned),
    new Map<string, FeesEarned>()
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
  })

  const stablePools = pools.filter((pool) => pool.curveType === CURVE.STABLE)
  const permPools = pools.filter(
    (pool) => !AUTHORIZED_POOLS.includes(pool.swapToken)
  )

  const tradingVolumes =
    getWeeklyAndDailyTradingVolumesForPoolsQuery.getWeeklyAndDailyTradingVolumesForPools ||
    []

  const tradingVolumesMap = tradingVolumes.reduce(
    (acc, tv) => acc.set(tv.pool, tv),
    new Map<string, TradingVolumeStats>()
  )

  return (
    <>
      <button
        type="button"
        onClick={() =>
          takePoolsFarmingSnapshots({
            pools: pools.filter(
              (p) =>
                p.name ===
                '4wjPQJ6PrkC4dHhYghwJzGBVP78DkBzA2U3kHoFNBuhj_8upjSpvjcdpuzhfR1zriwg5NXkwDruejqNE9WNbPRtyA'
            ),
            wallet,
            connection,
          })
        }
      >
        Take snapshots
      </button>
      <TabContainer>
        <div>
          <TableModeButton
            isActive={selectedTable === 'all'}
            onClick={() => setSelectedTable('all')}
          >
            All Pools
          </TableModeButton>
          <TableModeButton
            isActive={selectedTable === 'stablePools'}
            onClick={() => setSelectedTable('stablePools')}
          >
            Stable Pools
          </TableModeButton>
          <TableModeButton
            isActive={selectedTable === 'permissionlessPools'}
            onClick={() => setSelectedTable('permissionlessPools')}
          >
            Permissionless Pools
          </TableModeButton>
          <TableModeButton
            isActive={selectedTable === 'userLiquidity'}
            onClick={() => setSelectedTable('userLiquidity')}
          >
            Your liquidity ({userLiquidityPools.length})
          </TableModeButton>
        </div>
        <InputWrap>
          <SearchInput
            name="search"
            placeholder="Search"
            value={searchValue}
            onChange={onChangeSearch}
            append={<SvgIcon src={Loop} height="1.6rem" width="1.6rem" />}
          />
          <AddPoolButton as={Link} to={`${path}/create`}>
            <SvgIcon src={PlusIcon} width="1.2em" />
            &nbsp;Create a Pool
          </AddPoolButton>

          <a
            style={{ textDecoration: 'none' }}
            href={AMMAudit}
            target="_blank"
            rel="noreferrer"
          >
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
          </a>
        </InputWrap>
      </TabContainer>
      <TableContainer>
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
        {selectedTable === 'permissionlessPools' && (
          <AllPoolsTable
            searchValue={searchValue}
            pools={permPools}
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
        />
      </Route>

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
    loaderColor: COLORS.white,
  }),
  queryRendererHoc({
    name: 'getPoolsInfoQuery',
    query: getPoolsInfoRequest,
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000 * getRandomInt(1, 2),
    loaderColor: COLORS.white,
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
    loaderColor: COLORS.white,
  }),
  queryRendererHoc({
    name: 'getFeesEarnedByPoolQuery',
    query: getFeesEarnedByPoolRequest,
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000 * getRandomInt(5, 10),
    loaderColor: COLORS.white,
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
    loaderColor: COLORS.white,
    variables: () => ({
      dailyTimestampTo: endOfHourTimestamp(),
      dailyTimestampFrom: endOfHourTimestamp() - DAY,
      weeklyTimestampTo: endOfHourTimestamp(),
      weeklyTimestampFrom: endOfHourTimestamp() - DAY * 7,
    }),
  })
)(TableSwitcherComponent)
