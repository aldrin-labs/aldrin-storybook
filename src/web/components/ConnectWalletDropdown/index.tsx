import React from 'react'
import Dropdown from '@sb/components/Dropdown'
import { useWallet } from '@sb/dexUtils/wallet'
import { compose } from 'recompose'
import { withTheme } from '@sb/types/materialUI'
import { BtnCustom } from '../BtnCustom/BtnCustom.styles'

const ConnectWalletDropdown = ({ isNavBar, height, id, showOnTop }) => {
  const {
    connected,
    wallet,
    providerUrl,
    updateProviderUrl,
    setProvider,
    setAutoConnect,
  } = useWallet()
  return (
    <Dropdown
      isNavBar={isNavBar}
      height={height}
      wallet={wallet}
      connected={connected}
      theme={theme}
      id={id}
      showOnTop={showOnTop}
      setProvider={setProvider}
      providerUrl={providerUrl}
      setAutoConnect={setAutoConnect}
    />
  )
}

export default compose(withTheme())(ConnectWalletDropdown)
