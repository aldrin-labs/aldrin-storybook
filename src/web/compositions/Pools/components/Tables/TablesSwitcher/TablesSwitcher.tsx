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
import SvgIcon from '@sb/components/SvgIcon'
import { Text } from '@sb/components/Typography'
import {
  DexTokensPrices,
  FeesEarned,
  PoolInfo,
  PoolWithOperation,
} from '@sb/compositions/Pools/index.types'
import { getUserPoolsFromAll } from '@sb/compositions/Pools/utils/getUserPoolsFromAll'
import { useConnection } from '@sb/dexUtils/connection'
import { getParsedUserFarmingTickets } from '@sb/dexUtils/pools/getParsedUserFarmingTickets'
import { useFarmingTicketsMap } from '@sb/dexUtils/pools/useFarmingTicketsMap'
import { useSnapshotQueues } from '@sb/dexUtils/pools/useSnapshotQueues'
import { useUserTokenAccounts } from '@sb/dexUtils/useUserTokenAccounts'
import { useWallet } from '@sb/dexUtils/wallet'
import { PublicKey } from '@solana/web3.js'
import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'
import { AddLiquidityPopup, WithdrawalPopup } from '../../Popups'
import { ClaimRewards } from '../../Popups/ClaimRewards/ClaimRewards'
import { StakePopup } from '../../Popups/Staking/StakePopup'
import { UnstakePopup } from '../../Popups/Unstaking/UnstakePopup'
import AllPoolsTable from '../AllPools/AllPoolsTable'
import UserLiquitidyTable from '../UserLiquidity/UserLiquidityTable'
import {
  InputWrap,
  SearchInput,
  TabContainer,
  TableContainer,
  TableModeButton,
  AddPoolButton,
} from './TablesSwitcher.styles'
import { LISTING_REQUEST_GOOGLE_FORM } from '../../../../../../utils/config'

import PlusIcon from './plus.svg'
import { Checkbox } from '../../../../../components/Checkbox'

const TablesSwitcher = ({
  theme,
  getPoolsInfoQuery: { getPoolsInfo: pools = [] },
  getDexTokensPricesQuery: { getDexTokensPrices = [] },
  getFeesEarnedByAccountQuery: { getFeesEarnedByAccount = [] },
  getPoolsInfoQueryRefetch,
}: {
  theme: Theme
  getPoolsInfoQuery: { getPoolsInfo: PoolInfo[] }
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
  getFeesEarnedByAccountQuery: { getFeesEarnedByAccount: FeesEarned[] }
  getPoolsInfoQueryRefetch: () => void
}) => {
  const [selectedPool, selectPool] = useState<PoolInfo | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [selectedTable, setSelectedTable] = useState<'all' | 'userLiquidity'>(
    'all'
  )

  const onChangeSearch = (value: string) => {
    if (!`${value}`.match(/[a-zA-Z1-9]/) && value !== '') {
      return
    }

    setSearchValue(value)
  }

  const [isAddLiquidityPopupOpen, setIsAddLiquidityPopupOpen] = useState(false)
  const [isWithdrawalPopupOpen, setIsWithdrawalPopupOpen] = useState(false)
  const [isUnstakePopupOpen, setIsUnstakePopupOpen] = useState(false)
  const [isStakePopupOpen, setIsStakePopupOpen] = useState(false)
  const [includePermissionless, setIncludePermissionless] = useState(true)
  const [isRemindToStakePopupOpen, setIsRemindToStakePopupOpen] = useState(
    false
  )

  const [isClaimRewardsPopupOpen, setIsClaimRewardsPopupOpen] = useState(false)

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
    new Map()
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

  console.log({farmingTicketsMap, pools})

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
              poolWaitingForUpdateAfterOperation={
                poolWaitingForUpdateAfterOperation
              }
              includePermissionless={includePermissionless}
              poolsInfo={pools}
              allTokensData={allTokensData}
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
              poolsInfo={pools}
              open={isAddLiquidityPopupOpen}
              dexTokensPricesMap={dexTokensPricesMap}
              selectedPool={selectedPool}
              farmingTicketsMap={farmingTicketsMap}
              refreshTokensWithFarmingTickets={refreshTokensWithFarmingTickets}
              allTokensData={allTokensData}
              setPoolWaitingForUpdateAfterOperation={
                setPoolWaitingForUpdateAfterOperation
              }
              close={() => setIsAddLiquidityPopupOpen(false)}
              refreshAllTokensData={refreshAllTokensData}
              setIsRemindToStakePopupOpen={() =>
                setIsRemindToStakePopupOpen(true)
              }
            />
          )}

          {selectedPool && isWithdrawalPopupOpen && (
            <WithdrawalPopup
              theme={theme}
              poolsInfo={pools}
              selectedPool={selectedPool}
              dexTokensPricesMap={dexTokensPricesMap}
              farmingTicketsMap={farmingTicketsMap}
              earnedFeesInPoolForUserMap={earnedFeesInPoolForUserMap}
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
              close={() => {
                isRemindToStakePopupOpen
                  ? setIsRemindToStakePopupOpen(false)
                  : setIsStakePopupOpen(false)
              }}
              allTokensData={allTokensData}
              refreshTokensWithFarmingTickets={refreshTokensWithFarmingTickets}
              setPoolWaitingForUpdateAfterOperation={
                setPoolWaitingForUpdateAfterOperation
              }
              isReminderPopup={isRemindToStakePopupOpen}
            />
          )}

          {selectedPool && isUnstakePopupOpen && (
            <UnstakePopup
              theme={theme}
              open={isUnstakePopupOpen}
              selectedPool={selectedPool}
              close={() => setIsUnstakePopupOpen(false)}
              allTokensData={allTokensData}
              farmingTicketsMap={farmingTicketsMap}
              refreshTokensWithFarmingTickets={refreshTokensWithFarmingTickets}
              setPoolWaitingForUpdateAfterOperation={
                setPoolWaitingForUpdateAfterOperation
              }
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
        </TableContainer>
      </BlockContent>
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
  })
)(TablesSwitcher)
