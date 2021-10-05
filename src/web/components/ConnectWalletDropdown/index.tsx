import { Theme } from '@material-ui/core'
import Dropdown from '@sb/components/Dropdown'
import { useWallet } from '@sb/dexUtils/wallet'
import { withTheme } from '@sb/types/materialUI'
import React, { CSSProperties } from 'react'
import { compose } from 'recompose'

interface ConnectWalletDropdownProps {
  isNavBar?: boolean
  height: string
  theme: Theme
  id: string
  showOnTop?: boolean
  containerStyles?: CSSProperties
  buttonStyles?: CSSProperties
}

const ConnectWalletDropdown: React.FC<ConnectWalletDropdownProps> = (props) => {
  const {
    isNavBar = false,
    height,
    theme,
    id,
    showOnTop,
    containerStyles = {},
    buttonStyles = {},
  } = props

  const {
    connected,
    wallet,
    providerUrl,
    setProviderUrl,
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
      setProviderUrl={setProviderUrl}
      providerUrl={providerUrl}
      setAutoConnect={setAutoConnect}
      containerStyle={containerStyles}
      buttonStyles={buttonStyles}
    />
  )
}

export default compose(withTheme())(ConnectWalletDropdown)
