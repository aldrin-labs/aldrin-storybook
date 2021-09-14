import React, { useState } from 'react'

import { Theme, withTheme } from '@material-ui/core'
import { useWallet } from '@sb/dexUtils/wallet'
import { useTokenAccounts } from '@sb/dexUtils/markets'

import ConnectWallet from './components/ConnectWallet/ConnectWallet'
import { LoadingWithHint } from '@sb/compositions/Rebalance/components/RebalancePopup/LoadingWithHint'
import { Row, RowContainer } from '../AnalyticsRoute/index.styles'
import UnsettledBalancesTable from './components/UnsettledBalancesTable/UnsettledBalancesTable'

const Dashboard = ({ theme }: { theme: Theme }) => {
  const [isDataLoading, setIsDataLoading] = useState(true)

  const { connected } = useWallet()
  const [userTokenAccounts, userTokenAccountsLoaded] = useTokenAccounts()

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
