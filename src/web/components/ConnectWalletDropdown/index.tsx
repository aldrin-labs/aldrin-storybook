import React, { CSSProperties } from 'react'

import Dropdown from '@sb/components/Dropdown'
import { useWallet } from '@sb/dexUtils/wallet'

const ConnectWalletDropdown = ({
  isNavBar = false,
  height,
  id,
  showOnTop,
  containerStyles = {},
  buttonStyles = {},
}: {
  isNavBar?: boolean
  height: string
  id: string
  showOnTop?: boolean
  containerStyles?: CSSProperties
  buttonStyles?: CSSProperties
}) => {
  const { connected, wallet, providerUrl, setProvider, setAutoConnect } =
    useWallet()

  return (
    <Dropdown
      isNavBar={isNavBar}
      height={height}
      wallet={wallet}
      connected={connected}
      id={id}
      showOnTop={showOnTop}
      setProvider={setProvider}
      providerUrl={providerUrl}
      setAutoConnect={setAutoConnect}
      containerStyle={containerStyles}
      buttonStyles={buttonStyles}
    />
  )
}

export default ConnectWalletDropdown
