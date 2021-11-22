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
import { Button } from '@sb/components/Button'
import { Checkbox } from '@sb/components/Checkbox'
import SvgIcon from '@sb/components/SvgIcon'
import { Text } from '@sb/components/Typography'
import {
  DexTokensPrices,
  FeesEarned,
  PoolInfo,
  TradingVolumeStats
} from '@sb/compositions/Pools/index.types'
import { getUserPoolsFromAll } from '@sb/compositions/Pools/utils/getUserPoolsFromAll'
import { useConnection } from '@sb/dexUtils/connection'
import { createPoolTransactions } from '@sb/dexUtils/pools/actions/createPool'
import { useFarmingTicketsMap } from '@sb/dexUtils/pools/hooks/useFarmingTicketsMap'
import { useSnapshotQueues } from '@sb/dexUtils/pools/hooks/useSnapshotQueues'
import { waitForTransactionConfirmation } from '@sb/dexUtils/send'
import { useUserTokenAccounts } from '@sb/dexUtils/useUserTokenAccounts'
import { useWallet } from '@sb/dexUtils/wallet'
import { PublicKey, Transaction } from '@solana/web3.js'
import BN from 'bn.js'
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
  AddPoolButton, InputWrap,
  SearchInput,
  TabContainer,
  TableContainer,
  TableModeButton
} from './TablesSwitcher.styles'


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

  const onPoolCreateClick = async () => {
    const generatedTransactions = await createPoolTransactions({
      wallet,
      connection,
      baseTokenMint: 'Hn6FuAT9w7iHRc4M74c3xrtzPWBq4gGositr92NxaAs',
      quoteTokenMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      firstDeposit: {
        baseTokenAmount: new BN(1_000_000),
        userBaseTokenAccount: new PublicKey('C6kK8bCXFUdFmSdu1W9bvh8cc6kcFXWdWRfwjnkFnt6y'),
        quoteTokenAmount: new BN(5_000_000),
        userQuoteTokenAccount: new PublicKey('HL27Cs4HboiZB3xuYeaaKqqEc5h84AbHpWnAMxhFRaE1')
      }
    })

    // Object.keys(generatedTransactions).forEach((k) => {
    //   const transaction: Transaction = generatedTransactions[k]

    //   console.log(`Transaction ${k}:` , transaction.serialize())
    // })


    console.log('Create accounts...', connection, generatedTransactions.createAccounts)
    const createAccountsTxId = await connection.sendRawTransaction(generatedTransactions.createAccounts.serialize(), {
      skipPreflight: true,
    })

    console.log('createAccountsTxId: ', createAccountsTxId)
    await waitForTransactionConfirmation({
      txid: createAccountsTxId,
      timeout: 60_000,
      connection: connection.getConnection(),
      showErrorForTimeout: true,
    })
    console.log('createAccountsTxId: ', createAccountsTxId)

    console.log('Set authorities...')
    const setAuthoritiesTxId = await connection.sendRawTransaction(generatedTransactions.setAuthorities.serialize(), {
      skipPreflight: true,
    })
    await waitForTransactionConfirmation({
      txid: setAuthoritiesTxId,
      timeout: 60_000,
      connection: connection.getConnection(),
      showErrorForTimeout: true,
    })

    console.log('setAuthoritiesTxId: ', setAuthoritiesTxId)

    console.log('Initialize pool...')
    const initPoolTxId = await connection.sendRawTransaction(generatedTransactions.createPool.serialize(), {
      skipPreflight: true,
    })

    await waitForTransactionConfirmation({
      txid: initPoolTxId,
      timeout: 60_000,
      connection: connection.getConnection(),
      showErrorForTimeout: true,
    })

    console.log('initPoolTxId: ', initPoolTxId)

    if (generatedTransactions.firstDeposit) {
      console.log('First deposit...')
      const firstDepositTxId = await connection.sendRawTransaction(generatedTransactions.firstDeposit.serialize(), {
        skipPreflight: true,
      })
      await waitForTransactionConfirmation({
        txid: firstDepositTxId,
        timeout: 60_000,
        connection: connection.getConnection(),
        showErrorForTimeout: true,
      })

      console.log('firstDepositTxId: ', firstDepositTxId)
    }

    // console.log('generatedTransactions: ', generatedTransactions)
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
    allTokensData: userTokensData,
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
            <Button onClick={onPoolCreateClick}>ADD POOL</Button>
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
                dexTokensPricesMap={dexTokensPricesMap}
                allTokensData={userTokensData}
                farmingTicketsMap={farmingTicketsMap}
                earnedFeesInPoolForUserMap={earnedFeesInPoolForUserMap}
              />
            )}

        </TableContainer>
      </BlockContent>
      <Route path={`${path}/:symbol`}>
        <PoolPage
          pools={pools}
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
