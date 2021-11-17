import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import { getFeesEarnedByAccount } from '@core/graphql/queries/pools/getFeesEarnedByAccount'
import { getPoolsInfo } from '@core/graphql/queries/pools/getPoolsInfo'
import { withPublicKey } from '@core/hoc/withPublicKey'
import { getRandomInt } from '@core/utils/helpers'
import KudelskiLogo from '@icons/kudelski.svg'
import Loop from '@icons/loop.svg'
import { Theme } from '@material-ui/core'
import AMMAudit from '@sb/AMMAudit/AldrinAMMAuditReport.pdf'
import { Block, BlockContent } from '@sb/components/Block'
import { Checkbox } from '@sb/components/Checkbox'
import SvgIcon from '@sb/components/SvgIcon'
import { Text } from '@sb/components/Typography'
import {
  DexTokensPrices,
  FeesEarned,
  PoolInfo,
  PoolWithOperation,
  TradingVolumeStats
} from '@sb/compositions/Pools/index.types'
import { getUserPoolsFromAll } from '@sb/compositions/Pools/utils/getUserPoolsFromAll'
import { useConnection } from '@sb/dexUtils/connection'
import { useFarmingTicketsMap } from '@sb/dexUtils/pools/useFarmingTicketsMap'
import { useSnapshotQueues } from '@sb/dexUtils/pools/useSnapshotQueues'
import { useUserTokenAccounts } from '@sb/dexUtils/useUserTokenAccounts'
import { useWallet } from '@sb/dexUtils/wallet'
import React, { useState } from 'react'
import { Route } from 'react-router'
import { useRouteMatch } from 'react-router-dom'
import { compose } from 'recompose'
import { LISTING_REQUEST_GOOGLE_FORM } from '../../../../../../utils/config'
import { AddLiquidityPopup } from '../../Popups'
import { ClaimRewards } from '../../Popups/ClaimRewards/ClaimRewards'
import { DetailsModal } from '../../Popups/DetailsModal'
import { StakePopup } from '../../Popups/Staking/StakePopup'
import AllPoolsTable from '../AllPools/AllPoolsTable'
import UserLiquitidyTable from '../UserLiquidity/UserLiquidityTable'
import PlusIcon from './plus.svg'
import {
  AddPoolButton, InputWrap,
  SearchInput,
  TabContainer,
  TableContainer,
  TableModeButton
} from './TablesSwitcher.styles'
import { getFeesEarnedByPool } from '@core/graphql/queries/pools/getFeesEarnedByPool'
import { getWeeklyAndDailyTradingVolumesForPools } from '@core/graphql/queries/pools/getWeeklyAndDailyTradingVolumesForPools'
import { endOfHourTimestamp, DAY } from '@core/utils/dateUtils'

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
    getWeeklyAndDailyTradingVolumesForPoolsQuery
  } = props

  const [selectedPool, selectPool] = useState<PoolInfo | null>(null)
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

  const [isAddLiquidityPopupOpen, setIsAddLiquidityPopupOpen] = useState(false)
  const [isWithdrawalPopupOpen, setIsWithdrawalPopupOpen] = useState(false)
  const [isStakePopupOpen, setIsStakePopupOpen] = useState(false)
  const [isRemindToStakePopupOpen, setIsRemindToStakePopupOpen] = useState(
    false
  )

  const [isClaimRewardsPopupOpen, setIsClaimRewardsPopupOpen] = useState(false)
  const [includePermissionless, setIncludePermissionless] = useState(true)

  // after operation with pool we update data after some time
  // and for better ux we need to show loader for button which was use for this operation
  const [
    poolWaitingForUpdateAfterOperation,
    setPoolWaitingForUpdateAfterOperation,
  ] = useState<PoolWithOperation>({
    operation: '',
    pool: '',
  })

  const { wallet } = useWallet()
  const connection = useConnection()

  const [allTokensData, refreshAllTokensData] = useUserTokenAccounts({
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

  const refreshTokensWithFarmingTickets = () => {
    refreshAllTokensData()
    refreshFarmingTickets()
  }

  const isAllPoolsSelected = selectedTable === 'all'

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
    allTokensData,
    farmingTicketsMap,
  }).length

  const tradingVolumes = getWeeklyAndDailyTradingVolumesForPoolsQuery.getWeeklyAndDailyTradingVolumesForPools || []

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
              Your liquidity ({userLiquidityPools})
            </TableModeButton>
          </div>
          <InputWrap>
            <Checkbox
              color="error"
              label="Show Permissionless Pools"
              checked={includePermissionless}
              onChange={setIncludePermissionless}
            />
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
          {selectedTable === 'all' ? (
            <AllPoolsTable
              theme={theme}
              searchValue={searchValue}
              includePermissionless={includePermissionless}
              poolsInfo={pools}
              dexTokensPricesMap={dexTokensPricesMap}
              feesByPool={getFeesEarnedByPool}
              tradingVolumes={tradingVolumes}
            />
          ) : (
              <UserLiquitidyTable
                theme={theme}
                searchValue={searchValue}
                includePermissionless={includePermissionless}
                poolsInfo={pools}
                poolWaitingForUpdateAfterOperation={
                  poolWaitingForUpdateAfterOperation
                }
                dexTokensPricesMap={dexTokensPricesMap}
                allTokensData={allTokensData}
                farmingTicketsMap={farmingTicketsMap}
                earnedFeesInPoolForUserMap={earnedFeesInPoolForUserMap}
                selectPool={selectPool}
                refreshTokensWithFarmingTickets={refreshTokensWithFarmingTickets}
                setPoolWaitingForUpdateAfterOperation={
                  setPoolWaitingForUpdateAfterOperation
                }
                setIsAddLiquidityPopupOpen={setIsAddLiquidityPopupOpen}
                setIsWithdrawalPopupOpen={setIsWithdrawalPopupOpen}
                setIsStakePopupOpen={setIsStakePopupOpen}
                setIsUnstakePopupOpen={setIsUnstakePopupOpen}
                setIsClaimRewardsPopupOpen={setIsClaimRewardsPopupOpen}
              />
            )}

          {selectedPool && isAddLiquidityPopupOpen && (
            <AddLiquidityPopup
              theme={theme}
              searchValue={searchValue}
              includePermissionless={includePermissionless}
              poolsInfo={pools}
              poolWaitingForUpdateAfterOperation={
                poolWaitingForUpdateAfterOperation
              }
              dexTokensPricesMap={dexTokensPricesMap}
              allTokensData={allTokensData}
              close={() => setIsWithdrawalPopupOpen(false)}
              open={isWithdrawalPopupOpen}
              setIsUnstakePopupOpen={setIsUnstakePopupOpen}
              refreshAllTokensData={refreshAllTokensData}
              setPoolWaitingForUpdateAfterOperation={
                setPoolWaitingForUpdateAfterOperation
              }
            />
          )}

          {selectedPool && (isStakePopupOpen || isRemindToStakePopupOpen) && (
            <StakePopup
              theme={theme}
              open={isStakePopupOpen || isRemindToStakePopupOpen}
              selectedPool={selectedPool}
              dexTokensPricesMap={dexTokensPricesMap}
              farmingTicketsMap={farmingTicketsMap}
              earnedFeesInPoolForUserMap={earnedFeesInPoolForUserMap}
              selectPool={selectPool}
              refreshTokensWithFarmingTickets={refreshTokensWithFarmingTickets}
              setPoolWaitingForUpdateAfterOperation={
                setPoolWaitingForUpdateAfterOperation
              }
              setIsAddLiquidityPopupOpen={setIsAddLiquidityPopupOpen}
              setIsWithdrawalPopupOpen={setIsWithdrawalPopupOpen}
              setIsStakePopupOpen={setIsStakePopupOpen}
              setIsUnstakePopupOpen={setIsUnstakePopupOpen}
              setIsClaimRewardsPopupOpen={setIsClaimRewardsPopupOpen}
            />
          )}

          {selectedPool && isClaimRewardsPopupOpen && (
            <ClaimRewards
              theme={theme}
              open={isClaimRewardsPopupOpen}
              selectedPool={selectedPool}
              farmingTicketsMap={farmingTicketsMap}
              snapshotQueues={snapshotQueues}
              allTokensData={allTokensData}
              close={() => setIsClaimRewardsPopupOpen(false)}
              refreshTokensWithFarmingTickets={refreshTokensWithFarmingTickets}
              setPoolWaitingForUpdateAfterOperation={
                setPoolWaitingForUpdateAfterOperation
              }
            />
          )}

          {/* {isDetailsModalOpen && <DetailsModal onClose={() => setDetailsModalOpen(false)} />} */}
        </TableContainer>
      </BlockContent>
      <Route path={`${path}/:symbol`}>
        <DetailsModal
          pools={pools}
          prices={dexTokensPricesMap}
          tradingVolumes={tradingVolumes}
          fees={getFeesEarnedByPool}
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
    // variables: () => ({
    //   timestampFrom: endOfHourTimestamp() - dayDuration,
    //   timestampTo: endOfHourTimestamp(),
    // }),
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
