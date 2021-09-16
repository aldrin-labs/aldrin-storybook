import React, { useState, useEffect } from 'react'
import { OpenOrders } from '@project-serum/serum'
import { Theme, withTheme } from '@material-ui/core'

import { DEX_PID } from '@core/config/dex'

import { useWallet } from '@sb/dexUtils/wallet'
import { useTokenAccountsMap } from '@sb/dexUtils/markets'
import { useConnection } from '@sb/dexUtils/connection'

import { Row, RowContainer, Title } from '../AnalyticsRoute/index.styles'
import { LoadingScreenWithHint } from '@sb/components/LoadingScreenWithHint/LoadingScreenWithHint'
import OpenOrdersTable from '@sb/components/TradingTable/OpenOrdersTable/OpenOrdersTable'
import { useAllMarketsList, useAllMarketsMapById } from '@sb/dexUtils/markets'

import UnsettledBalancesTable from './components/UnsettledBalancesTable/UnsettledBalancesTable'
import { notEmpty, onlyUnique } from '@sb/dexUtils/utils'
import { getOrderbookForMarkets } from '../Rebalance/utils/getOrderbookForMarkets'
import {
  LoadedMarketsMap,
  loadMarketsByNames,
} from '../Rebalance/utils/loadMarketsByNames'
import { TableContainer } from './Dashboard.styles'
import { ConnectWalletScreen } from '@sb/components/ConnectWalletScreen/ConnectWalletScreen'
import { UnsettledBalance } from './components/UnsettledBalancesTable/UnsettledBalancesTable.utils'
import { getOpenOrdersAccountsMapByMarketId } from './utils/getOpenOrdersAccountsMapByMarketId'
import { getUnsettledBalances } from './utils/getUnsettledBalances'
import {
  getOpenOrdersFromOrderbooks,
  OrderWithMarket,
} from './utils/getOpenOrdersFromOrderbooks'
import { loadOpenOrderAccountsFromPubkeys } from './utils/loadOpenOrderAccountsFromPubkeys'
import { cancelOrdersForAllMarkets } from './utils/cancelOrdersForAllMarkets'
import { sleep } from '@core/utils/helpers'
import { useInterval } from '@sb/dexUtils/useInterval'
import { Loading } from '@sb/components'
import { settleUnsettledBalancesForAllMarkets } from './utils/settleUnsettledBalancesForAllMarkets'
import LoadingText from './components/LoadingText/LoadingText'

/* dashboard shows all open orders and all unsettled balances by using open orders accounts
it gives you ability to settle your funds and cancel orders */

const Dashboard = ({ theme }: { theme: Theme }) => {
  const [isDataLoading, setIsDataLoading] = useState(false)

  const [openOrdersAccounts, setOpenOrdersAccounts] = useState<OpenOrders[]>([])
  const [loadedMarketsMap, setLoadedMarketsMap] = useState<LoadedMarketsMap>(
    new Map()
  )

  // for unsettled balances table + refresh
  const [unsettledBalances, setUnsettledBalances] = useState<
    UnsettledBalance[]
  >([])
  const [
    refreshUnsettledBalancesCounter,
    setRefreshUnsettledBalancesCounter,
  ] = useState(0)
  const [
    isUnsettledBalancesUpdating,
    setIsUnsettledBalancesUpdating,
  ] = useState(false)
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
  const [
    percentageOfLoadedOrderbooks,
    setPercentageOfLoadedOrderbooks,
  ] = useState(0)
  const [nameOfLoadingMarket, setNameOfLoadingMarket] = useState('')

  const { wallet, connected } = useWallet()
  const connection = useConnection()

  const [
    userTokenAccountsMap,
    userTokenAccountsMapLoaded,
  ] = useTokenAccountsMap()

  const allMarketsMap = useAllMarketsList()
  const allMarketsMapById = useAllMarketsMapById()

  useEffect(() => {
    const getOpenOrdersAccounts = async () => {
      setIsDataLoading(true)

      //load all open orders accounts by using users publicKey
      const openOrdersAccounts = await OpenOrders.findForOwner(
        connection,
        wallet.publicKey,
        DEX_PID
      )

      const openOrdersAccountsMapByMarketId = getOpenOrdersAccountsMapByMarketId(
        openOrdersAccounts
      )

      // by using open orders accounts we can know unique markets that need to be loadad
      const uniqueMarketsIds = openOrdersAccounts
        .map((el) => el.market.toString())
        .filter(onlyUnique)

      const uniqueMarketsNames = uniqueMarketsIds
        .map((marketId) => allMarketsMapById.get(marketId)?.name || null)
        .filter(notEmpty)

      const loadedMarketsMap = await loadMarketsByNames({
        wallet,
        connection,
        marketsNames: uniqueMarketsNames,
        allMarketsMap,
        onLoadMarket: ({ index, nextMarketName }) => {
          setPercentageOfLoadedMarkets(
            ((index + 1) / uniqueMarketsNames.length) * 100
          )

          setNameOfLoadingMarket(nextMarketName)
        },
      })

      // from open orders accounts we can take unsettled balances
      const unsettledBalances = getUnsettledBalances({
        openOrdersAccounts,
        allMarketsMapById,
        loadedMarketsMap,
      })

      const orderbooks = await getOrderbookForMarkets({
        connection,
        loadedMarketsMap,
        onOrderbookLoad: ({ index, nextMarketName }) => {
          setPercentageOfLoadedOrderbooks(
            ((index + 1) / uniqueMarketsNames.length) * 100
          )

          setNameOfLoadingMarket(nextMarketName)
        },
      })

      const openOrders = getOpenOrdersFromOrderbooks({
        loadedMarketsMap,
        orderbooksMap: orderbooks,
        openOrdersAccountsMapByMarketId,
      })

      setIsDataLoading(false)
      setOpenOrdersAccounts(openOrdersAccounts)
      setLoadedMarketsMap(loadedMarketsMap)

      setOpenOrders(openOrders)
      setUnsettledBalances(unsettledBalances)
    }
    if (connected) getOpenOrdersAccounts()
  }, [connected])

  // on every action we need to update all OOA and unsettled balances
  useEffect(() => {
    // load accountInfo for every openOrderAccount
    const updateUnsettledBalances = async () => {
      await sleep(10 * 1000)
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
      await sleep(10 * 1000)
      setIsOpenOrdersUpdating(true)

      const openOrdersAccountsMapByMarketId = getOpenOrdersAccountsMapByMarketId(
        openOrdersAccounts
      )

      const orderbooks = await getOrderbookForMarkets({
        connection,
        loadedMarketsMap,
      })

      const openOrders = getOpenOrdersFromOrderbooks({
        loadedMarketsMap,
        orderbooksMap: orderbooks,
        openOrdersAccountsMapByMarketId,
      })

      console.log('refreshed openOrders', openOrders)
      setOpenOrders(openOrders)
      setIsOpenOrdersUpdating(false)
    }

    if (refreshOpenOrdersCounter > 0) updateOpenOrders()
  }, [refreshOpenOrdersCounter])

  useInterval(() => !isDataLoading && refreshOpenOrders(), 60000)

  if (!connected) return <ConnectWalletScreen theme={theme} />

  if (isDataLoading || !userTokenAccountsMapLoaded)
    return (
      <LoadingScreenWithHint
        loadingText={
          <LoadingText
            theme={theme}
            nameOfLoadingMarket={nameOfLoadingMarket}
            percentageOfLoadedMarkets={percentageOfLoadedMarkets}
            percentageOfLoadedOrderbooks={percentageOfLoadedOrderbooks}
          />
        }
      />
    )

  return (
    <RowContainer
      height="100%"
      direction="column"
      justify="flex-start"
      style={{
        background: theme.palette.grey.additional,
        flexWrap: 'nowrap',
        overflow: 'auto',
        padding: '0 0 6rem 0',
      }}
    >
      <Row direction="column" width="70%" margin="5rem 0 0 0">
        <RowContainer
          justify={isUnsettledBalancesUpdating ? 'space-between' : 'flex-start'}
          margin="0 0 3rem 0"
        >
          <Title
            color={theme.palette.white.primary}
            fontFamily="Avenir Next Demi"
            fontSize="3rem"
          >
            Unsettled Balances
          </Title>
          {isUnsettledBalancesUpdating && (
            <Loading margin={'0'} size={'3rem'} />
          )}
        </RowContainer>
        <TableContainer>
          <UnsettledBalancesTable
            theme={theme}
            onSettleAll={async () => {
              await settleUnsettledBalancesForAllMarkets({
                wallet,
                connection,
                unsettledBalances,
                userTokenAccountsMap,
              })

              await refreshUnsettledBalances()
            }}
            userTokenAccountsMap={userTokenAccountsMap}
            unsettledBalances={unsettledBalances}
            refreshUnsettledBalances={refreshUnsettledBalances}
          />
        </TableContainer>
      </Row>

      <Row direction="column" width="70%" margin="5rem 0 0 0">
        <RowContainer
          justify={isOpenOrdersUpdating ? 'space-between' : 'flex-start'}
          margin="0 0 3rem 0"
        >
          <Title
            color={theme.palette.white.primary}
            fontFamily="Avenir Next Demi"
            fontSize="3rem"
          >
            Open Orders
          </Title>
          {isOpenOrdersUpdating && <Loading margin={'0'} size={'3rem'} />}
        </RowContainer>
        <TableContainer>
          <OpenOrdersTable
            tab={'openOrders'}
            theme={theme}
            show={true}
            cancelOrderCallback={refreshOpenOrders}
            onCancelAll={async () => {
              await cancelOrdersForAllMarkets({
                wallet,
                connection,
                orders: openOrders,
              })

              await refreshOpenOrders()
            }}
            handlePairChange={() => {}}
            openOrders={openOrders}
            stylesForTable={{ borderRadius: '1.5rem' }}
            styles={{
              height: '100%',
            }}
          />
        </TableContainer>
      </Row>
    </RowContainer>
  )
}

export default withTheme()(Dashboard)
