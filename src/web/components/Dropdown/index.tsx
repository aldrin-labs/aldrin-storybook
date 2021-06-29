import * as React from 'react'
import ReactDOM from 'react-dom'
import { withRouter } from 'react-router-dom'
import { MenuList, Grid, withWidth } from '@material-ui/core'
import {
  StyledDropdown,
  StyledPaper,
  StyledMenuItem,
  StyledMenuItemText,
  StyledLink,
  StyledButton,
} from './Dropdown.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import SvgIcon from '@sb/components/SvgIcon'

import { IProps } from './types'
import styled from 'styled-components'

import { WALLET_PROVIDERS } from '@sb/dexUtils/wallet'

const WalletStatusButton = ({ wallet, connected, theme, id }) => (
  <BtnCustom
    onClick={connected ? wallet?.disconnect : wallet?.connect}
    btnColor={theme.palette.blue.serum}
    btnWidth={'14rem'}
    textTransform={'capitalize'}
    height={'3.5rem'}
    borderRadius=".6rem"
    fontSize={'1.2rem'}
    // margin={'0 0 0 3rem'}
    id={id}
    style={{
      display: 'flex',
      textTransform: 'none',
      padding: '1rem',
    }}
  >
    {!connected ? 'Connect wallet' : 'Disconnect'}
  </BtnCustom>
)

const ConnectWalletButton = ({ wallet, theme, height, id }) => (
  <BtnCustom
    onClick={wallet?.connect}
    btnColor={'#F8FAFF'}
    backgroundColor={theme.palette.blue.serum}
    btnWidth={'100%'}
    borderColor={theme.palette.blue.serum}
    textTransform={'capitalize'}
    height={height}
    borderRadius=".6rem"
    fontSize={'1.2rem'}
    style={{
      display: 'flex',
      textTransform: 'none',
      padding: '1rem',
      whiteSpace: 'nowrap',
    }}
    id={id}
  >
    Connect wallet
  </BtnCustom>
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
      page,
      selectedMenu,
      id,
      theme,
      Component,
      onMouseOver,
      marketName,
      pathname,
      isActivePage,
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
    } = this.props

    return (
      <>
        <StyledDropdown
          isNavBar={isNavBar}
          theme={theme}
          showOnTop={showOnTop}
          style={{ ...containerStyle }}
        >
          {isNavBar ? (
            <WalletStatusButton
              wallet={wallet}
              connected={connected}
              theme={theme}
              id={id}
            />
          ) : (
            <ConnectWalletButton
              wallet={wallet}
              connected={connected}
              height={height}
              theme={theme}
              id={id}
            />
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
            theme={theme}
            isWalletConnected={connected}
            customActiveRem={'9rem'}
            customNotActiveRem={'3rem'}
          >
            <MenuList style={{ padding: 0 }}>
              {WALLET_PROVIDERS.map((provider) => {
                const isProviderActive = provider.url === providerUrl

                return (
                  <StyledMenuItem
                    theme={theme}
                    disableRipple
                    disableGutters={true}
                    key={provider.name}
                    isActive={isProviderActive}
                  >
                    <StyledButton
                      btnWidth={'100%'}
                      height={'4rem'}
                      border="none"
                      borderWidth="0"
                      borderRadius="0"
                      btnColor={isProviderActive ? '#AAF2C9' : '#ECF0F3'}
                      fontSize={'1.2rem'}
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
                        width={'2.5rem'}
                        height={'100%'}
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