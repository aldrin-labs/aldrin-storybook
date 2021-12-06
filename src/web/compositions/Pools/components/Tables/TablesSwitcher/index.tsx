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
import { Block, BlockContent } from '@sb/components/Block'
import { Button } from '@sb/components/Button'
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
import { Route } from 'react-router'
import { useRouteMatch } from 'react-router-dom'
import { compose } from 'recompose'
import { getFeesEarnedByAccount as getFeesEarnedByAccountRequest } from '@core/graphql/queries/pools/getFeesEarnedByAccount'
import { LISTING_REQUEST_GOOGLE_FORM } from '../../../../../../utils/config'
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

interface TableSwitcherProps {
  getPoolsInfoQuery: { getPoolsInfo: PoolInfo[] }
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
  getFeesEarnedByAccountQuery: { getFeesEarnedByAccount: FeesEarned[] }
  getFeesEarnedByPoolQuery: { getFeesEarnedByPool: FeesEarned[] }
  getWeeklyAndDailyTradingVolumesForPoolsQuery: {
    getWeeklyAndDailyTradingVolumesForPools?: TradingVolumeStats[]
  }
}

const TableSwitcherComponent: React.FC<TableSwitcherProps> = (props) => {
  const {
    getPoolsInfoQuery: { getPoolsInfo: pools = [] },
    getDexTokensPricesQuery: { getDexTokensPrices = [] },
    getFeesEarnedByAccountQuery: { getFeesEarnedByAccount = [] },
    getFeesEarnedByPoolQuery: { getFeesEarnedByPool = [] },
    getWeeklyAndDailyTradingVolumesForPoolsQuery,
  } = props

  const [createPoolModalOpened, setCreatePoolModalOpened] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [selectedTable, setSelectedTable] = useState<'all' | 'userLiquidity'>(
    'all'
  )

  const { path } = useRouteMatch()

  const onChangeSearch = (value: string) => {
    if (!`${value}`.match(/[a-zA-Z1-9]/) && value !== '') {
      return
    }

    setSearchValue(value)
  }

  const { wallet } = useWallet()
  const connection = useConnection()

  const [userTokensData, refreshUserTokensData] = useUserTokenAccounts()

  const [snapshotQueues, refreshSnapshotQueues] = useSnapshotQueues({
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

  const isAllPoolsSelected = selectedTable === 'all'

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

  const userLiquidityPools = getUserPoolsFromAll({
    poolsInfo: pools,
    allTokensData: userTokensData,
    farmingTicketsMap,
  })

  const tradingVolumes =
    getWeeklyAndDailyTradingVolumesForPoolsQuery.getWeeklyAndDailyTradingVolumesForPools ||
    []

  const tradingVolumesMap = tradingVolumes.reduce(
    (acc, tv) => acc.set(tv.pool, tv),
    new Map<string, TradingVolumeStats>()
  )

  return (
    <Block>
      <BlockContent>
        <TabContainer>
          <div>
            <TableModeButton
              isActive={isAllPoolsSelected}
              onClick={() => setSelectedTable('all')}
            >
              All Pools
            </TableModeButton>
            <TableModeButton
              isActive={!isAllPoolsSelected}
              onClick={() => setSelectedTable('userLiquidity')}
            >
              Your liquidity ({userLiquidityPools.length})
            </TableModeButton>
          </div>
          <InputWrap>
            {/* <Checkbox
              color="error"
              label="Show Permissionless Pools"
              checked={includePermissionless}
              onChange={setIncludePermissionless}
            /> */}
            <SearchInput
              name="search"
              placeholder="Search"
              value={searchValue}
              onChange={onChangeSearch}
              append={<SvgIcon src={Loop} height="1.6rem" width="1.6rem" />}
            />
            <AddPoolButton
              title="Create new pool"
              as="a"
              href={LISTING_REQUEST_GOOGLE_FORM}
              target="_blank"
            >
              <SvgIcon src={PlusIcon} width="1.2em" />
            </AddPoolButton>
            <Button onClick={() => setCreatePoolModalOpened(true)}>
              ADD POOL
            </Button>
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
          {selectedTable === 'all' ? (
            <AllPoolsTable
              searchValue={searchValue}
              pools={pools}
              dexTokensPricesMap={dexTokensPricesMap}
              feesByPool={feesByPoolMap}
              tradingVolumes={tradingVolumesMap}
            />
          ) : (
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
      </BlockContent>
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
        />
      </Route>
      {createPoolModalOpened && (
        <CreatePoolModal onClose={() => setCreatePoolModalOpened(false)} />
      )}
    </Block>
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
  }),
  queryRendererHoc({
    name: 'getPoolsInfoQuery',
    query: getPoolsInfoRequest,
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000 * getRandomInt(1, 2),
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
  }),
  queryRendererHoc({
    name: 'getFeesEarnedByPoolQuery',
    query: getFeesEarnedByPoolRequest,
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000 * getRandomInt(5, 10),
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
    variables: () => ({
      dailyTimestampTo: endOfHourTimestamp(),
      dailyTimestampFrom: endOfHourTimestamp() - DAY,
      weeklyTimestampTo: endOfHourTimestamp(),
      weeklyTimestampFrom: endOfHourTimestamp() - DAY * 7,
    }),
  })
)(TableSwitcherComponent)
