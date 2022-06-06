import { MenuList } from '@material-ui/core'
import * as React from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { WALLET_PROVIDERS } from '@sb/dexUtils/wallet'

import { Button } from '../Button'
import {
  StyledDropdown,
  StyledPaper,
  StyledMenuItem,
  StyledButton,
} from './Dropdown.styles'
import { IProps } from './types'

const WalletStatusButton = ({ wallet, connected, id }) => (
  <Button
    onClick={connected ? wallet?.disconnect : wallet?.connect}
    $variant="primary"
    $padding="lg"
    $fontSize="md"
    id={id}
  >
    {!connected ? 'Connect wallet' : 'Disconnect'}
  </Button>
)

const ConnectWalletButton = ({ wallet, id }) => (
  <Button
    onClick={wallet?.connect}
    $variant="primary"
    $padding="lg"
    $fontSize="md"
    id={id}
  >
    Connect wallet
  </Button>
)

const StyledButton = styled(BtnCustom)`
  & span {
    height: 100%;
  }
`

@withRouter
export default class Dropdown extends React.Component<IProps> {
  render() {
    const {
      id,
      wallet,
      connected,
      setProvider: updateProviderUrl,
      providerUrl,
      isSelected,
      setAutoConnect,
      isNavBar,
      height,
      showOnTop,
      containerStyle,
      buttonStyles,
    } = this.props

    return (
      <>
        <StyledDropdown
          isNavBar={isNavBar}
          showOnTop={showOnTop}
          style={{ ...containerStyle }}
        >
          {isNavBar ? (
            <WalletStatusButton wallet={wallet} connected={connected} id={id} />
          ) : (
            <ConnectWalletButton wallet={wallet} id={id} />
          )}
          <StyledPaper
            style={{
              display: isSelected ? 'none' : '',
              top: 0,
              left: 0,
              bottom: showOnTop ? '0' : 'auto',
              transform: !showOnTop ? 'translateY(-100%)' : 'translateY(100%)',
              width: '100%',
            }}
            showOnTop={showOnTop}
            isWalletConnected={connected}
            customActiveRem="9rem"
            customNotActiveRem="3rem"
          >
            <MenuList style={{ padding: 0 }}>
              {WALLET_PROVIDERS.map((provider) => {
                const isProviderActive = provider.url === providerUrl

                return (
                  <StyledMenuItem
                    disableRipple
                    disableGutters
                    key={provider.name}
                    isActive={isProviderActive}
                  >
                    <StyledButton
                      btnWidth="100%"
                      height="4rem"
                      border="none"
                      borderWidth="0"
                      borderRadius="0"
                      btnColor={isProviderActive ? '#AAF2C9' : '#ECF0F3'}
                      fontSize="1.2rem"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        textTransform: 'none',
                        padding: '1rem',
                        whiteSpace: 'normal',
                        textAlign: 'right',
                        background: isProviderActive
                          ? 'rgba(55, 56, 62, 0.75)'
                          : '',
                      }}
                      onClick={() => {
                        updateProviderUrl(provider.url)
                        setAutoConnect(true)
                      }}
                    >
                      <SvgIcon
                        src={provider.icon}
                        width="2.5rem"
                        height="100%"
                      />
                      {provider.name}
                    </StyledButton>
                  </StyledMenuItem>
                )
              })}
            </MenuList>
          </StyledPaper>
        </StyledDropdown>
      </>
    )
  }
}
