import React from 'react'
import { Theme, withTheme } from '@material-ui/core'
import { useWallet } from '@sb/dexUtils/wallet'
import ConnectWallet from './components/ConnectWallet/ConnectWallet'
import { RowContainer } from '../AnalyticsRoute/index.styles'

const Dashboard = ({ theme }: { theme: Theme }) => {
  const { connected } = useWallet()

  if (!connected) {
    return <ConnectWallet theme={theme} />
  }

  return <RowContainer></RowContainer>
}

export default withTheme()(Dashboard)
