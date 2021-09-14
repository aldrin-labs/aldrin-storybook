import React, { useState, useEffect } from 'react'

import { Theme, withTheme } from '@material-ui/core'
import { useWallet } from '@sb/dexUtils/wallet'
import { useTokenAccounts } from '@sb/dexUtils/markets'
import { useConnection } from '@sb/dexUtils/connection'
import { DEX_PID } from '@core/config/dex'
import { OpenOrders } from '@project-serum/serum'

import ConnectWallet from './components/ConnectWallet/ConnectWallet'
import { LoadingWithHint } from '@sb/compositions/Rebalance/components/RebalancePopup/LoadingWithHint'
import { Row, RowContainer } from '../AnalyticsRoute/index.styles'
import UnsettledBalancesTable from './components/UnsettledBalancesTable/UnsettledBalancesTable'

/* dashboard shows all open orders and all unsettled balances by using open orders accounts
it gives you ability to settle your funds and cancel orders */

const Dashboard = ({ theme }: { theme: Theme }) => {
  const [isDataLoading, setIsDataLoading] = useState(true)

  const { wallet, connected } = useWallet()
  const connection = useConnection()
  const [userTokenAccounts, userTokenAccountsLoaded] = useTokenAccounts()

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
