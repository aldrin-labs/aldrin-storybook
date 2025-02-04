import { OpenOrders } from '@project-serum/serum'
import React, { useState, useEffect } from 'react'
import { compose } from 'recompose'
import { useTheme } from 'styled-components'

import { Loading } from '@sb/components'
import { ConnectWalletWrapper } from '@sb/components/ConnectWalletWrapper'
import { LoadingScreenWithHint } from '@sb/components/LoadingScreenWithHint/LoadingScreenWithHint'
import { queryRendererHoc } from '@sb/components/QueryRenderer'
import OpenOrdersTable from '@sb/components/TradingTable/OpenOrdersTable/OpenOrdersTable'
import { useConnection, useSerumConnection } from '@sb/dexUtils/connection'
import {
  useTokenAccountsMap,
  useAllMarketsList,
  useAllMarketsMapById,
} from '@sb/dexUtils/markets'
import { notifyWithLog } from '@sb/dexUtils/notifications'
import { useInterval } from '@sb/dexUtils/useInterval'
import { notEmpty, onlyUnique, sleep } from '@sb/dexUtils/utils'
import { useWallet } from '@sb/dexUtils/wallet'

import { DEX_PID, FORK_DEX_PID } from '@core/config/dex'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'

import { RowContainer, Title } from '../AnalyticsRoute/index.styles'
import { DexTokensPrices } from '../Pools/index.types'
import { getOrderbookForMarkets } from '../Rebalance/utils/getOrderbookForMarkets'
import {
  LoadedMarketsMap,
  loadMarketsByNames,
} from '../Rebalance/utils/loadMarketsByNames'
import LoadingText from './components/LoadingText/LoadingText'
import { UnsettledBalancesTable } from './components/UnsettledBalancesTable/UnsettledBalancesTable'
import { UnsettledBalance } from './components/UnsettledBalancesTable/UnsettledBalancesTable.utils'
import { TableContainer, TableWithTitleContainer } from './Dashboard.styles'
import { cancelOrdersForAllMarkets } from './utils/cancelOrdersForAllMarkets'
import { getOpenOrdersAccountsMapByMarketId } from './utils/getOpenOrdersAccountsMapByMarketId'
import {
  getOpenOrdersFromOrderbooks,
  OrderWithMarket,
} from './utils/getOpenOrdersFromOrderbooks'
import { getUnsettledBalances } from './utils/getUnsettledBalances'
import { loadOpenOrderAccountsFromPubkeys } from './utils/loadOpenOrderAccountsFromPubkeys'
import { settleUnsettledBalancesForAllMarkets } from './utils/settleUnsettledBalancesForAllMarkets'

/* dashboard shows all open orders and all unsettled balances by using open orders accounts
it gives you ability to settle your funds and cancel orders */

const Dashboard = ({
  getDexTokensPricesQuery,
}: {
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
}) => {
  const [isDataLoading, setIsDataLoading] = useState(false)
  const theme = useTheme()
  const [openOrdersAccounts, setOpenOrdersAccounts] = useState<OpenOrders[]>([])
  const [loadedMarketsMap, setLoadedMarketsMap] = useState<LoadedMarketsMap>(
    new Map()
  )

  // for unsettled balances table + refresh
  const [unsettledBalances, setUnsettledBalances] = useState<
    UnsettledBalance[]
  >([])
  const [refreshUnsettledBalancesCounter, setRefreshUnsettledBalancesCounter] =
    useState(0)
  const [isUnsettledBalancesUpdating, setIsUnsettledBalancesUpdating] =
    useState(false)
  const refreshUnsettledBalances = () =>
    setRefreshUnsettledBalancesCounter(refreshUnsettledBalancesCounter + 1)

  // for open orders table + refresh
  const [openOrders, setOpenOrders] = useState<OrderWithMarket[]>([])
  const [refreshOpenOrdersCounter, setRefreshOpenOrdersCounter] = useState(0)
  const [isOpenOrdersUpdating, setIsOpenOrdersUpdating] = useState(false)
  const refreshOpenOrders = () => {
    setRefreshOpenOrdersCounter(refreshOpenOrdersCounter + 1)
    // after canceling order(s) their amount moves to unsettled balance
    refreshUnsettledBalances()
  }

  // percentage of markets loaded, percentage of ob loaded, name of market/ob loading
  const [percentageOfLoadedMarkets, setPercentageOfLoadedMarkets] = useState(0)
  const [percentageOfLoadedOrderbooks, setPercentageOfLoadedOrderbooks] =
    useState(0)

  // flags for operations with settle/cancel all buttons
  const [isSettlingAllBalances, setIsSettlingAllBalances] = useState(false)
  const [isCancellingAllOrders, setsCancellingAllOrders] = useState(false)

  const { wallet } = useWallet()
  const connection = useConnection()
  const serumConnection = useSerumConnection()

  const [userTokenAccountsMap, userTokenAccountsMapLoaded] =
    useTokenAccountsMap()

  const allMarketsMap = useAllMarketsList()
  const allMarketsMapById = useAllMarketsMapById()

  useEffect(() => {
    const getOpenOrdersAccounts = async () => {
      setIsDataLoading(true)

      // load all open orders accounts by using users publicKey
      const [a, b] = await Promise.all([
        OpenOrders.findForOwner(serumConnection, wallet.publicKey, DEX_PID),
        OpenOrders.findForOwner(
          serumConnection,
          wallet.publicKey,
          FORK_DEX_PID
        ),
      ])

      const openOrdersAccounts = [...a, ...b]

      const openOrdersAccountsMapByMarketId =
        getOpenOrdersAccountsMapByMarketId(openOrdersAccounts)

      // by using open orders accounts we can know unique markets that need to be loadad
      const uniqueMarketsIds = openOrdersAccounts
        .map((el) => el.market.toString())
        .filter(onlyUnique)

      const uniqueMarketsNames = uniqueMarketsIds
        .map((marketId) => allMarketsMapById.get(marketId)?.name || null)
        .filter(notEmpty)

      const loadedMarketsMap = await loadMarketsByNames({
        connection,
        marketsNames: uniqueMarketsNames,
        allMarketsMap,
        allMarketsMapById,
      })

      setPercentageOfLoadedMarkets(100)

      // from open orders accounts we can take unsettled balances
      const unsettledBalances = getUnsettledBalances({
        openOrdersAccounts,
        allMarketsMapById,
        loadedMarketsMap,
      })

      const orderbooks = await getOrderbookForMarkets({
        connection,
        loadedMarketsMap,
      })

      const openOrders = getOpenOrdersFromOrderbooks({
        loadedMarketsMap,
        orderbooksMap: orderbooks,
        openOrdersAccountsMapByMarketId,
      })

      setIsDataLoading(false)
      setPercentageOfLoadedOrderbooks(100)
      setOpenOrdersAccounts(openOrdersAccounts)
      setLoadedMarketsMap(loadedMarketsMap)

      setOpenOrders(openOrders)
      setUnsettledBalances(unsettledBalances)
    }
    getOpenOrdersAccounts()
  }, [])

  // on every action we need to update all OOA and unsettled balances
  useEffect(() => {
    // load accountInfo for every openOrderAccount
    const updateUnsettledBalances = async () => {
      setIsUnsettledBalancesUpdating(true)

      const updatedOpenOrdersAccounts = await loadOpenOrderAccountsFromPubkeys({
        connection,
        openOrdersAccountsPubkeys: openOrdersAccounts.map(
          (account) => account.address
        ),
      })

      const unsettledBalances = getUnsettledBalances({
        openOrdersAccounts: updatedOpenOrdersAccounts,
        allMarketsMapById,
        loadedMarketsMap,
      })

      setOpenOrdersAccounts(updatedOpenOrdersAccounts)
      setUnsettledBalances(unsettledBalances)
      setIsUnsettledBalancesUpdating(false)
    }

    if (refreshUnsettledBalancesCounter > 0) updateUnsettledBalances()
  }, [refreshUnsettledBalancesCounter])

  // on cancelling orders we need to update orderbooks and open orders
  useEffect(() => {
    const updateOpenOrders = async () => {
      setIsOpenOrdersUpdating(true)

      const openOrdersAccountsMapByMarketId =
        getOpenOrdersAccountsMapByMarketId(openOrdersAccounts)

      const orderbooks = await getOrderbookForMarkets({
        connection,
        loadedMarketsMap,
      })

      const openOrders = getOpenOrdersFromOrderbooks({
        loadedMarketsMap,
        orderbooksMap: orderbooks,
        openOrdersAccountsMapByMarketId,
      })

      setOpenOrders(openOrders)
      setIsOpenOrdersUpdating(false)
    }

    if (refreshOpenOrdersCounter > 0) updateOpenOrders()
  }, [refreshOpenOrdersCounter])

  useInterval(() => !isDataLoading && refreshOpenOrders(), 15000)

  if (isDataLoading || !userTokenAccountsMapLoaded)
    return (
      <LoadingScreenWithHint
        loadingText={
          <LoadingText
            theme={theme}
            percentageOfLoadedMarkets={percentageOfLoadedMarkets}
            percentageOfLoadedOrderbooks={percentageOfLoadedOrderbooks}
          />
        }
      />
    )

  const dexTokensPrices = getDexTokensPricesQuery.getDexTokensPrices.reduce(
    (acc, el) => acc.set(el.symbol, el),
    new Map()
  )

  return (
    <RowContainer
      height="100%"
      direction="column"
      justify="flex-start"
      style={{
        background: theme.colors.white6,
        flexWrap: 'nowrap',
        overflow: 'auto',
        padding: '0 0 6rem 0',
      }}
    >
      <TableWithTitleContainer direction="column" margin="5rem 0 0 0">
        <RowContainer
          justify={isOpenOrdersUpdating ? 'space-between' : 'flex-start'}
          margin="0 0 3rem 0"
        >
          <Title
            color={theme.colors.white1}
            fontFamily="Avenir Next Demi"
            fontSize="3rem"
          >
            Open Orders
          </Title>
          {isOpenOrdersUpdating && <Loading margin="0" size="3rem" />}
        </RowContainer>
        <TableContainer>
          <OpenOrdersTable
            tab="openOrders"
            show
            needShowValue
            isCancellingAllOrders={isCancellingAllOrders}
            cancelOrderCallback={refreshOpenOrders}
            onCancelAll={async () => {
              setsCancellingAllOrders(true)
              try {
                await cancelOrdersForAllMarkets({
                  wallet,
                  connection,
                  orders: openOrders,
                })
              } catch (e) {
                notifyWithLog({
                  message: 'Error cancelling all orders',
                  e,
                })

                // removing loaders only in case of error
                setsCancellingAllOrders(false)
              }
              await sleep(5 * 1000)
              refreshOpenOrders()
            }}
            handlePairChange={() => {}}
            openOrders={openOrders}
            stylesForTable={{ borderRadius: '1.5rem' }}
            styles={{
              background: theme.colors.white5,
              height: '100%',
            }}
          />
        </TableContainer>
      </TableWithTitleContainer>{' '}
      <TableWithTitleContainer direction="column" margin="5rem 0 0 0">
        <RowContainer
          justify={isUnsettledBalancesUpdating ? 'space-between' : 'flex-start'}
          margin="0 0 3rem 0"
        >
          <Title
            color={theme.colors.white1}
            fontFamily="Avenir Next Demi"
            fontSize="3rem"
          >
            Unsettled Balances
          </Title>
          {isUnsettledBalancesUpdating && <Loading margin="0" size="3rem" />}
        </RowContainer>
        <TableContainer>
          <UnsettledBalancesTable
            theme={theme}
            dexTokensPrices={dexTokensPrices}
            isSettlingAllBalances={isSettlingAllBalances}
            onSettleAll={async () => {
              setIsSettlingAllBalances(true)
              try {
                await settleUnsettledBalancesForAllMarkets({
                  wallet,
                  connection,
                  unsettledBalances,
                  userTokenAccountsMap,
                })
              } catch (e) {
                notifyWithLog({
                  message: 'Insufficient SOL balance for settling.',
                  e,
                })

                // removing loaders only in case of error
                setIsSettlingAllBalances(false)
              }
              await sleep(5 * 1000)
              refreshUnsettledBalances()
            }}
            userTokenAccountsMap={userTokenAccountsMap}
            unsettledBalances={unsettledBalances}
            refreshUnsettledBalances={refreshUnsettledBalances}
          />
        </TableContainer>
      </TableWithTitleContainer>
    </RowContainer>
  )
}

const WithQueries = compose(
  queryRendererHoc({
    query: getDexTokensPrices,
    name: 'getDexTokensPricesQuery',
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000,
  })
)(Dashboard)

const DashboardWithWallet = () => {
  return (
    <ConnectWalletWrapper>
      <WithQueries />
    </ConnectWalletWrapper>
  )
}

export default DashboardWithWallet
