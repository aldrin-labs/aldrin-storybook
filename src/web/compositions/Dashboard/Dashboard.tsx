import React, { useState, useEffect } from 'react'

import { Theme, withTheme } from '@material-ui/core'
import { useWallet } from '@sb/dexUtils/wallet'
import {
  useAllMarketsList,
  useAllMarketsMapById,
  useTokenAccounts,
} from '@sb/dexUtils/markets'
import { useConnection } from '@sb/dexUtils/connection'
import { DEX_PID } from '@core/config/dex'
import { Market, OpenOrders } from '@project-serum/serum'

import ConnectWallet from './components/ConnectWallet/ConnectWallet'
import { LoadingWithHint } from '@sb/compositions/Rebalance/components/RebalancePopup/LoadingWithHint'
import { Row, RowContainer } from '../AnalyticsRoute/index.styles'
import UnsettledBalancesTable from './components/UnsettledBalancesTable/UnsettledBalancesTable'
import { onlyUnique } from '@sb/dexUtils/utils'
import { loadMarketsByNames } from './loadMarketsByNames'
import { getOrderbookForMarkets } from '../Rebalance/utils/getOrderbookForMarkets'
import { LoadedMarket } from './loadMarketsByNames'

/* dashboard shows all open orders and all unsettled balances by using open orders accounts
it gives you ability to settle your funds and cancel orders */

const Dashboard = ({ theme }: { theme: Theme }) => {
  const [isDataLoading, setIsDataLoading] = useState(true)

  const { wallet, connected } = useWallet()
  const connection = useConnection()
  const [userTokenAccounts, userTokenAccountsLoaded] = useTokenAccounts()

  const allMarketsMap = useAllMarketsList()
  const allMarketsMapById = useAllMarketsMapById()

  useEffect(() => {
    const getOpenOrdersAccounts = async () => {
      // 1. load all OOA by using users publicKey
      const openOrdersAccounts = await OpenOrders.findForOwner(
        connection,
        wallet.publicKey,
        DEX_PID
      )

      // map of ooa by marketid
      const openOrdersAccountsMapByMarketId = openOrdersAccounts.reduce(
        (acc, current) => {
          const marketId = current.market.toString()
          if (acc.has(marketId)) {
            acc.set(marketId, [...acc.get(marketId), current])
          } else {
            acc.set(marketId, current)
          }
          return acc
        },
        new Map()
      )

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

      const orderbooks = await getOrderbookForMarkets({
        connection,
        loadedMarketsMap,
        allMarketsMap,
      })

      // filterForOpenOrders - after load asks + bids
      const openOrders = loadedMarketsMap
        .values()
        .map((marketData: LoadedMarket) => {
          const { market, marketName } = marketData
          market.filterForOpenOrders(
            orderbooks[marketName].bids,
            orderbooks[marketName].asks,
            openOrdersAccountsMapByMarketId.get(market.address.toString())
          )
        })
      // go through every loaded market => Market.filterForOpenOrders(ask, bid by name, openOrdersAccounts -> )
    }
    if (connected) getOpenOrdersAccounts()
  }, [connected])

  if (!connected) {
    return <ConnectWallet theme={theme} />
  }

  if (!connected) return <ConnectWallet theme={theme} />

  if (isDataLoading || !userTokenAccountsLoaded)
    return (
      <RowContainer height="100%">
        <Row width="50%" justify="center">
          <LoadingWithHint
            loaderSize={'16rem'}
            loaderTextStyles={{
              fontFamily: 'Avenir Next Demi',
              fontSize: '2rem',
            }}
            hintTextStyles={{ justifyContent: 'flex-start' }}
          />
        </Row>
      </RowContainer>
    )

  return (
    <RowContainer height="100%" direction="column">
      <UnsettledBalancesTable
        theme={theme}
        userTokenAccounts={userTokenAccounts}
      />
    </RowContainer>
  )
}

export default withTheme()(Dashboard)

// 2. from OOA we can take unsettled balances
// 3. by using OOA we can know unique markets that need to be loadad
// 4. load OB and markets and store it
// 5. now we can to show settle button and open orders
