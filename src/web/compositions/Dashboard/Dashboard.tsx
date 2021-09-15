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
import {
  useAllMarketsList,
  useAllMarketsMapById,
  useTokenAccounts,
} from '@sb/dexUtils/markets'

import ConnectWallet from './components/ConnectWallet/ConnectWallet'
import UnsettledBalancesTable from './components/UnsettledBalancesTable/UnsettledBalancesTable'
import { onlyUnique } from '@sb/dexUtils/utils'
import { getOrderbookForMarkets } from '../Rebalance/utils/getOrderbookForMarkets'
import { loadMarketsByNames } from '../Rebalance/utils/loadMarketsByNames'

/* dashboard shows all open orders and all unsettled balances by using open orders accounts
it gives you ability to settle your funds and cancel orders */

const Dashboard = ({ theme }: { theme: Theme }) => {
  const [isDataLoading, setIsDataLoading] = useState(false)

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
      })

      // filterForOpenOrders - after load asks + bids
      const openOrders = [...loadedMarketsMap.values()]
        .map((marketData) => {
          const { market, marketName } = marketData
          const { asks, bids } = orderbooks.get(marketName) || { asks: null, bids: null }

          if (!asks || !bids) return
          
          return market.filterForOpenOrders(
            bids,
            asks,
            openOrdersAccountsMapByMarketId.get(market.address.toString())
          )
        })

        console.log('openOrders', openOrders)
      // go through every loaded market => Market.filterForOpenOrders(ask, bid by name, openOrdersAccounts -> )
    }
    if (connected) getOpenOrdersAccounts()
  }, [connected])

  if (!connected) {
    return <ConnectWallet theme={theme} />
  }

  if (!connected) return <ConnectWallet theme={theme} />

  // || !userTokenAccountsMapLoaded
  if (isDataLoading) return <LoadingScreenWithHint />

  return (
    <RowContainer height="100%" direction="column" justify="flex-start">
      <Row direction="column" width="70%" margin="5rem 0 0 0">
        <RowContainer justify="flex-start">
          <Title
            color={theme.palette.white.primary}
            fontFamily="Avenir Next Demi"
            fontSize="3rem"
          >
            Unsettled Balances
          </Title>
        </RowContainer>
        <RowContainer style={{ minHeight: '30rem' }}>
          <UnsettledBalancesTable
            theme={theme}
            userTokenAccountsMap={userTokenAccountsMap}
            unsettledBalances={[]}
          />
        </RowContainer>
      </Row>

      <Row direction="column" width="70%" margin="5rem 0 0 0">
        <RowContainer justify="flex-start">
          <Title
            color={theme.palette.white.primary}
            fontFamily="Avenir Next Demi"
            fontSize="3rem"
          >
            Open Orders
          </Title>
        </RowContainer>
        <RowContainer style={{ minHeight: '30rem' }}>
          <OpenOrdersTable
            tab={'openOrders'}
            theme={theme}
            show={true}
            marketType={0}
            canceledOrders={[]}
            handlePairChange={() => {}}
            openOrders={[]}
            stylesForTable={{ height: '100%', background: theme.palette.white.background }}
            tableBodyStyles={{ position: 'relative' }}
          />
        </RowContainer>
      </Row>
    </RowContainer>
  )
}

export default withTheme()(Dashboard)

// 2. from OOA we can take unsettled balances
// 3. by using OOA we can know unique markets that need to be loadad
// 4. load OB and markets and store it
// 5. now we can to show settle button and open orders
