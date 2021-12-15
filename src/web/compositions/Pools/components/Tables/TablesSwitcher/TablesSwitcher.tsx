import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import { getFeesEarnedByAccount } from '@core/graphql/queries/pools/getFeesEarnedByAccount'
import { getFeesEarnedByPool } from '@core/graphql/queries/pools/getFeesEarnedByPool'
import { getPoolsInfo } from '@core/graphql/queries/pools/getPoolsInfo'
import { getWeeklyAndDailyTradingVolumesForPools } from '@core/graphql/queries/pools/getWeeklyAndDailyTradingVolumesForPools'
import { withPublicKey } from '@core/hoc/withPublicKey'
import { DAY, endOfHourTimestamp } from '@core/utils/dateUtils'
import { getRandomInt } from '@core/utils/helpers'
import KudelskiLogo from '@icons/kudelski.svg'
import Loop from '@icons/loop.svg'
import { Theme } from '@material-ui/core'
import AMMAudit from '@sb/AMMAudit/AldrinAMMAuditReport.pdf'
import { Block, BlockContent } from '@sb/components/Block'
import SvgIcon from '@sb/components/SvgIcon'
import { Text } from '@sb/components/Typography'
import {
  DexTokensPrices,
  FeesEarned,
  PoolInfo,
  TradingVolumeStats,
} from '@sb/compositions/Pools/index.types'
import { getUserPoolsFromAll } from '@sb/compositions/Pools/utils/getUserPoolsFromAll'
import { restakeAll } from '@sb/compositions/Pools/utils/restakeAll'
import { useConnection } from '@sb/dexUtils/connection'
import { checkIsPoolStable } from '@sb/dexUtils/pools/checkIsPoolStable'
import { useFarmingTicketsMap } from '@sb/dexUtils/pools/hooks/useFarmingTicketsMap'
import { useSnapshotQueues } from '@sb/dexUtils/pools/hooks/useSnapshotQueues'
import { useUserTokenAccounts } from '@sb/dexUtils/useUserTokenAccounts'
import { useWallet } from '@sb/dexUtils/wallet'
import React, { useState } from 'react'
import { Route } from 'react-router'
import { useRouteMatch } from 'react-router-dom'
import { compose } from 'recompose'
import { LISTING_REQUEST_GOOGLE_FORM } from '../../../../../../utils/config'
import { PoolPage } from '../../PoolPage'
import AllPoolsTable from '../AllPools/AllPoolsTable'
import UserLiquitidyTable from '../UserLiquidity/UserLiquidityTable'
import PlusIcon from './icons/plus.svg'
import {
  AddPoolButton,
  InputWrap,
  SearchInput,
  TabContainer,
  TableContainer,
  TableModeButton,
} from './TablesSwitcher.styles'

import { RestakeAllPopup } from '../../Popups/RestakeAllPopup'

interface TableSwitcherProps {
  theme: Theme
  getPoolsInfoQuery: { getPoolsInfo: PoolInfo[] }
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
  getFeesEarnedByAccountQuery: { getFeesEarnedByAccount: FeesEarned[] }
  getFeesEarnedByPoolQuery: { getFeesEarnedByPool: FeesEarned[] }
  getWeeklyAndDailyTradingVolumesForPoolsQuery: {
    getWeeklyAndDailyTradingVolumesForPools?: TradingVolumeStats[]
  }
}

const TablesSwitcher: React.FC<TableSwitcherProps> = (props) => {
  const {
    theme,
    getPoolsInfoQuery: { getPoolsInfo: pools = [] },
    getDexTokensPricesQuery: { getDexTokensPrices = [] },
    getFeesEarnedByAccountQuery: { getFeesEarnedByAccount = [] },
    getFeesEarnedByPoolQuery: { getFeesEarnedByPool = [] },
    getWeeklyAndDailyTradingVolumesForPoolsQuery,
  } = props

  const [searchValue, setSearchValue] = useState('')
  const [selectedTable, setSelectedTable] = useState<
    'all' | 'stablePools' | 'userLiquidity'
  >('all')

  const { path } = useRouteMatch()

  const onChangeSearch = (value: string) => {
    if (!`${value}`.match(/[a-zA-Z1-9]/) && value !== '') {
      return
    }

    setSearchValue(value)
  }

  const [includePermissionless, setIncludePermissionless] = useState(true)

  const { wallet } = useWallet()
  const connection = useConnection()

  const [userTokensData, refreshUserTokensData] = useUserTokenAccounts({
    wallet,
    connection,
  })

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
  const isStablePoolsSelected = selectedTable === 'stablePools'
  const isUserLiquiditySelected = selectedTable === 'userLiquidity'

  const dexTokensPricesMap = getDexTokensPrices.reduce(
    (acc, tokenPrice) => acc.set(tokenPrice.symbol, tokenPrice),
    new Map<string, DexTokensPrices>()
  )

  const earnedFeesInPoolForUserMap = getFeesEarnedByAccount.reduce(
    (acc, feesEarned) => acc.set(feesEarned.pool, feesEarned),
    new Map<string, FeesEarned>()
  )

  const userLiquidityPools = getUserPoolsFromAll({
    poolsInfo: pools,
    allTokensData: userTokensData,
    farmingTicketsMap,
  }).length

  const stablePools = pools.filter(checkIsPoolStable)

  const tradingVolumes =
    getWeeklyAndDailyTradingVolumesForPoolsQuery.getWeeklyAndDailyTradingVolumesForPools ||
    []

  const poolsToShow = isStablePoolsSelected ? stablePools : pools

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
              isActive={isStablePoolsSelected}
              onClick={() => setSelectedTable('stablePools')}
            >
              Stable Pools ({stablePools.length})
            </TableModeButton>
            <TableModeButton
              isActive={isUserLiquiditySelected}
              onClick={() => setSelectedTable('userLiquidity')}
            >
              Your Liquidity ({userLiquidityPools})
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
              append={<SvgIcon src={Loop} height={'1.6rem'} width={'1.6rem'} />}
            />
            <AddPoolButton
              title="Create new pool"
              as="a"
              href={LISTING_REQUEST_GOOGLE_FORM}
              target="_blank"
            >
              <SvgIcon src={PlusIcon} width={'1.2em'} />
            </AddPoolButton>
            <a
              style={{ textDecoration: 'none' }}
              href={AMMAudit}
              target="_blank"
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
          {selectedTable !== 'userLiquidity' ? (
            <AllPoolsTable
              theme={theme}
              searchValue={searchValue}
              includePermissionless={includePermissionless}
              poolsInfo={poolsToShow}
              dexTokensPricesMap={dexTokensPricesMap}
              feesByPool={getFeesEarnedByPool}
              tradingVolumes={tradingVolumes}
            />
          ) : (
            <UserLiquitidyTable
              theme={theme}
              searchValue={searchValue}
              includePermissionless={includePermissionless}
              poolsInfo={poolsToShow}
              dexTokensPricesMap={dexTokensPricesMap}
              allTokensData={userTokensData}
              farmingTicketsMap={farmingTicketsMap}
              earnedFeesInPoolForUserMap={earnedFeesInPoolForUserMap}
            />
          )}
          {wallet.publicKey && (
            <RestakeAllPopup
              theme={theme}
              wallet={wallet}
              connection={connection}
              allPoolsData={pools}
              allTokensData={userTokensData}
              farmingTicketsMap={farmingTicketsMap}
              refreshTokensWithFarmingTickets={() => {
                refreshUserTokensData()
                refreshFarmingTickets()
              }}
            />
          )}
        </TableContainer>
      </BlockContent>
      <Route path={`${path}/:symbol`}>
        <PoolPage
          pools={poolsToShow}
          prices={dexTokensPricesMap}
          tradingVolumes={tradingVolumes}
          fees={getFeesEarnedByPool}
          farmingTickets={farmingTicketsMap}
          userTokensData={userTokensData}
          earnedFees={earnedFeesInPoolForUserMap}
          refreshUserTokensData={refreshUserTokensData}
          refreshAll={refreshAll}
          snapshotQueues={snapshotQueues}
        />
      </Route>
    </Block>
  )
}

export default compose(
  withPublicKey,
  queryRendererHoc({
    query: getDexTokensPrices,
    name: 'getDexTokensPricesQuery',
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000 * getRandomInt(1, 3),
  }),
  queryRendererHoc({
    name: 'getPoolsInfoQuery',
    query: getPoolsInfo,
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000 * getRandomInt(1, 2),
  }),
  queryRendererHoc({
    query: getFeesEarnedByAccount,
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
    query: getFeesEarnedByPool,
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000 * getRandomInt(5, 10),
    variables: () => ({
      timestampFrom: endOfHourTimestamp() - DAY,
      timestampTo: endOfHourTimestamp(),
    }),
  }),
  queryRendererHoc({
    name: 'getWeeklyAndDailyTradingVolumesForPoolsQuery',
    query: getWeeklyAndDailyTradingVolumesForPools,
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
)(TablesSwitcher)
