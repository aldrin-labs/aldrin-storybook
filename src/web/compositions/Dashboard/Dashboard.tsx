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

import ConnectWallet from './components/ConnectWallet/ConnectWallet'
import UnsettledBalancesTable from './components/UnsettledBalancesTable/UnsettledBalancesTable'

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

  useEffect(() => {
    const getOpenOrdersAccounts = async () => {
      // 1. load all OOA by using users publicKey
      const openOrdersAccounts = await OpenOrders.findForOwner(
        connection,
        wallet.publicKey,
        DEX_PID
      )
      console.log(
        'openOrdersAccounts',
        openOrdersAccounts.map((el) => el.market.toString())
      )
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
