import React, { CSSProperties } from 'react'
import Dropdown from '@sb/components/Dropdown'
import { useWallet } from '@sb/dexUtils/wallet'
import { compose } from 'recompose'
import { withTheme } from '@sb/types/materialUI'
import { Theme } from '@material-ui/core'

const ConnectWalletDropdown = ({
  isNavBar = false,
  height,
  theme,
  id,
  showOnTop,
  containerStyles = {},
  buttonStyles = {},
}: {
  isNavBar?: boolean
  height: string
  theme: Theme
  id: string
  showOnTop?: boolean
  containerStyles?: CSSProperties
  buttonStyles?: CSSProperties
}) => {
  const {
    connected,
    wallet,
    providerUrl,
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
      containerStyle={containerStyles}
      buttonStyles={buttonStyles}
    />
  )
}

export default compose(withTheme())(ConnectWalletDropdown)
