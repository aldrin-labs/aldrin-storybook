import React, { useState } from 'react'

import { Theme } from '@material-ui/core'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BlockTemplate } from '@sb/compositions/Pools/index.styles'
import { SearchInputWithLoop } from '../components'
import { getPoolsInfo } from '@core/graphql/queries/pools/getPoolsInfo'
import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer'

import AllPoolsTable from '../AllPools/AllPoolsTable'
import UserLiquitidyTable from '../UserLiquidity/UserLiquidityTable'

import {
  DexTokensPrices,
  FeesEarned,
  PoolInfo,
  PoolWithOperation,
} from '@sb/compositions/Pools/index.types'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import { AddLiquidityPopup, WithdrawalPopup } from '../../Popups'
import { useWallet } from '@sb/dexUtils/wallet'
import { useConnection } from '@sb/dexUtils/connection'
import { TableModeButton } from './TablesSwitcher.styles'
import { StakePopup } from '../../Popups/Staking/StakePopup'
import { UnstakePopup } from '../../Popups/Unstaking/UnstakePopup'
import { getFeesEarnedByAccount } from '@core/graphql/queries/pools/getFeesEarnedByAccount'
import { withPublicKey } from '@core/hoc/withPublicKey'
import { getUserPoolsFromAll } from '@sb/compositions/Pools/utils/getUserPoolsFromAll'
import { useUserTokenAccounts } from '@sb/dexUtils/useUserTokenAccounts'
import { useFarmingTicketsMap } from '@sb/dexUtils/pools/useFarmingTicketsMap'
import { getRandomInt } from '@core/utils/helpers'

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
  const [searchValue, onChangeSearch] = useState('')
  const [selectedTable, setSelectedTable] = useState<'all' | 'userLiquidity'>(
    'all'
  )

  const [isAddLiquidityPopupOpen, setIsAddLiquidityPopupOpen] = useState(false)
  const [isWithdrawalPopupOpen, setIsWithdrawalPopupOpen] = useState(false)
  const [isUnstakePopupOpen, setIsUnstakePopupOpen] = useState(false)
  const [isStakePopupOpen, setIsStakePopupOpen] = useState(false)

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

  const [farmingTicketsMap, refreshFarmingTickets] = useFarmingTicketsMap({
    wallet,
    connection,
    pools,
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
    new Map()
  )

  return (
    <RowContainer>
      <BlockTemplate
        width={'100%'}
        height={'auto'}
        style={{ marginTop: '2rem', borderRadius: '1.6rem' }}
        align={'start'}
        theme={theme}
        direction={'column'}
        justify={'end'}
      >
        <RowContainer padding="2rem" justify={'space-between'} align="center">
          <Row>
            <TableModeButton
              theme={theme}
              isActive={isAllPoolsSelected}
              onClick={() => setSelectedTable('all')}
            >
              All Pools
            </TableModeButton>
            <TableModeButton
              theme={theme}
              isActive={!isAllPoolsSelected}
              onClick={() => setSelectedTable('userLiquidity')}
            >
              Your liquidity (
              {
                getUserPoolsFromAll({
                  poolsInfo: pools,
                  allTokensData,
                  farmingTicketsMap,
                }).length
              }
              )
            </TableModeButton>
          </Row>
          <Row
            style={{ flexWrap: 'nowrap' }}
            justify={'flex-end'}
            width={'calc(100% / 3)'}
          >
            <SearchInputWithLoop
              searchValue={searchValue}
              onChangeSearch={onChangeSearch}
              placeholder={'Search...'}
            />
          </Row>
        </RowContainer>

        {selectedTable === 'all' ? (
          <AllPoolsTable
            theme={theme}
            searchValue={searchValue}
            poolWaitingForUpdateAfterOperation={
              poolWaitingForUpdateAfterOperation
            }
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
          />
        ) : (
          <UserLiquitidyTable
            theme={theme}
            searchValue={searchValue}
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
          />
        )}

        {selectedPool && isAddLiquidityPopupOpen && (
          <AddLiquidityPopup
            theme={theme}
            poolsInfo={pools}
            open={isAddLiquidityPopupOpen}
            dexTokensPricesMap={dexTokensPricesMap}
            selectedPool={selectedPool}
            allTokensData={allTokensData}
            setPoolWaitingForUpdateAfterOperation={
              setPoolWaitingForUpdateAfterOperation
            }
            close={() => setIsAddLiquidityPopupOpen(false)}
            refreshAllTokensData={refreshAllTokensData}
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
            refreshAllTokensData={refreshAllTokensData}
            setPoolWaitingForUpdateAfterOperation={
              setPoolWaitingForUpdateAfterOperation
            }
          />
        )}

        {selectedPool && isStakePopupOpen && (
          <StakePopup
            theme={theme}
            open={isStakePopupOpen}
            selectedPool={selectedPool}
            dexTokensPricesMap={dexTokensPricesMap}
            farmingTicketsMap={farmingTicketsMap}
            close={() => setIsStakePopupOpen(false)}
            allTokensData={allTokensData}
            refreshTokensWithFarmingTickets={refreshTokensWithFarmingTickets}
            setPoolWaitingForUpdateAfterOperation={
              setPoolWaitingForUpdateAfterOperation
            }
          />
        )}

        {selectedPool && isUnstakePopupOpen && (
          <UnstakePopup
            theme={theme}
            open={isUnstakePopupOpen}
            selectedPool={selectedPool}
            close={() => setIsUnstakePopupOpen(false)}
            allTokensData={allTokensData}
            refreshTokensWithFarmingTickets={refreshTokensWithFarmingTickets}
            setPoolWaitingForUpdateAfterOperation={
              setPoolWaitingForUpdateAfterOperation
            }
          />
        )}
      </BlockTemplate>
    </RowContainer>
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
