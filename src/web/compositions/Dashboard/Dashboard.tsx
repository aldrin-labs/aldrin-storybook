import React from 'react'
import { Theme, withTheme } from '@material-ui/core'
import { useWallet } from '@sb/dexUtils/wallet'
import ConnectWallet from './components/ConnectWallet/ConnectWallet'

const Dashboard = ({ theme }: { theme: Theme }) => {
  const { connected } = useWallet()

  if (!connected) return <ConnectWallet theme={theme} />
}

export default withTheme()(Dashboard)
