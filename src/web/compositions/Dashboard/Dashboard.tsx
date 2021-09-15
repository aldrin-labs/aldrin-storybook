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
import { onlyUnique } from '@sb/dexUtils/utils'
import { getOrderbookForMarkets } from '../Rebalance/utils/getOrderbookForMarkets'
import { loadMarketsByNames } from '../Rebalance/utils/loadMarketsByNames'
import { TableContainer } from './Dashboard.styles'
import { ConnectWalletScreen } from '@sb/components/ConnectWalletScreen/ConnectWalletScreen'
import { Order } from '@project-serum/serum/lib/market'
import { UnsettledBalance } from './components/UnsettledBalancesTable/UnsettledBalancesTable.utils'
import { getOpenOrdersAccountsMapByMarketId } from './utils/getOpenOrdersAccountsMapByMarketId'
import { getUnsettledBalances } from './utils/getUnsettledBalances'
import { getOpenOrdersFromOrderbooks } from './utils/getOpenOrdersFromOrderbooks'

/* dashboard shows all open orders and all unsettled balances by using open orders accounts
it gives you ability to settle your funds and cancel orders */

const Dashboard = ({ theme }: { theme: Theme }) => {
  const [isDataLoading, setIsDataLoading] = useState(false)
  const [openOrdersData, setOpenOrdersData] = useState<Order[]>([])
  const [unsettledBalances, setUnsettledBalances] = useState<
    UnsettledBalance[]
  >([])

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

      // map of open orders accounts by marketId
      const openOrdersAccountsMapByMarketId = getOpenOrdersAccountsMapByMarketId(
        openOrdersAccounts
      )

      // by using open orders accounts we can know unique markets that need to be loadad
      const uniqueMarketsIds = openOrdersAccounts
        .map((el) => el.market.toString())
        .filter(onlyUnique)

      const uniqueMarketsNames = uniqueMarketsIds.map(
        (marketId) => allMarketsMapById.get(marketId)?.name || 'Unknown Market'
      )

      const loadedMarketsMap = await loadMarketsByNames({
        wallet,
        connection,
        marketsNames: uniqueMarketsNames,
        allMarketsMap,
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
      })

      // filterForOpenOrders - after load asks + bids
      const openOrders = getOpenOrdersFromOrderbooks({
        loadedMarketsMap,
        orderbooksMap: orderbooks,
        openOrdersAccountsMapByMarketId,
      })

      setIsDataLoading(false)
      setOpenOrdersData(openOrders)
      setUnsettledBalances(unsettledBalances)
    }
    if (connected) getOpenOrdersAccounts()
  }, [connected])

  // on every action we need to update all OOA and unsettled balances
  // on cancelling orders we need to update orderbooks and open orders

  if (!connected) return <ConnectWalletScreen theme={theme} />

  if (isDataLoading || !userTokenAccountsMapLoaded)
    return <LoadingScreenWithHint />

  return (
    <RowContainer
      height="100%"
      direction="column"
      justify="flex-start"
      style={{
        background: theme.palette.grey.additional,
      }}
    >
      <Row direction="column" width="70%" margin="5rem 0 0 0">
        <RowContainer justify="flex-start" margin="0 0 3rem 0">
          <Title
            color={theme.palette.white.primary}
            fontFamily="Avenir Next Demi"
            fontSize="3rem"
          >
            Unsettled Balances
          </Title>
        </RowContainer>
        <TableContainer>
          <UnsettledBalancesTable
            theme={theme}
            userTokenAccountsMap={userTokenAccountsMap}
            unsettledBalances={unsettledBalances}
          />
        </TableContainer>
      </Row>

      <Row direction="column" width="70%" margin="5rem 0 0 0">
        <RowContainer justify="flex-start" margin="0 0 3rem 0">
          <Title
            color={theme.palette.white.primary}
            fontFamily="Avenir Next Demi"
            fontSize="3rem"
          >
            Open Orders
          </Title>
        </RowContainer>
        <TableContainer>
          <OpenOrdersTable
            tab={'openOrders'}
            theme={theme}
            show={true}
            marketType={0}
            canceledOrders={[]}
            handlePairChange={() => {}}
            openOrders={openOrdersData}
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
