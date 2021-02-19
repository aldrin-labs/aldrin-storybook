import * as React from 'react'
import { withRouter } from 'react-router-dom'
import { MenuList, Grid } from '@material-ui/core'
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
import Sollet from '@icons/sollet.svg'
import Mathwallet from '@icons/mathwallet.svg'
import Solong from '@icons/solong.svg'

import { IProps } from './types'

import NavLinkButton from '@sb/components/NavBar/NavLinkButton/NavLinkButton'

const WalletStatusButton = ({ wallet, connected, theme }) => (
  <BtnCustom
    type="text"
    size="large"
    onClick={connected ? wallet.disconnect : wallet.connect}
    btnColor={theme.palette.blue.serum}
    btnWidth={'14rem'}
    height={'100%'}
  >
    {!connected ? 'Connect wallet' : 'Disconnect'}
  </BtnCustom>
)

@withRouter
export default class Dropdown extends React.Component<IProps> {
  state = {
    open: false,
  }

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
    } = this.props

    const isSolletActive = providerUrl === 'https://www.sollet.io'
    const isMathWalletActive = providerUrl === 'https://www.mathwallet.org'
    const isSolongWallet = providerUrl === 'https://solongwallet.com'

    const isWalletConnected = connected

    return (
      <StyledDropdown theme={theme}>
        <WalletStatusButton
          wallet={wallet}
          connected={connected}
          theme={theme}
        />

        <StyledPaper
          style={{ display: isSelected ? 'none' : '' }}
          theme={theme}
        >
          <MenuList style={{ padding: 0 }}>
            <StyledMenuItem
              theme={theme}
              disableRipple
              disableGutters={true}
              key={'sollet'}
            >
              <BtnCustom
                btnWidth={'100%'}
                height={'4rem'}
                border="none"
                borderWidth="0"
                borderRadius="0"
                btnColor={isSolletActive ? '#AAF2C9' : '#ECF0F3'}
                fontSize={'1.2rem'}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  textTransform: 'none',
                  padding: '1rem',
                }}
                onClick={() => {
                  console.log('CLICK ON SOLLET')

                  updateProviderUrl('https://www.sollet.io')

                  if (isSolletActive && !isWalletConnected) {
                    wallet.connect()
                    return
                  }
                }}
              >
                <SvgIcon src={Sollet} width={'20%'} height={'70%'} />
                Sollet.io
              </BtnCustom>
            </StyledMenuItem>
            <StyledMenuItem
              theme={theme}
              disableRipple
              disableGutters={true}
              key={'mathwallet'}
            >
              <BtnCustom
                btnWidth={'100%'}
                height={'4rem'}
                border="none"
                borderWidth="0"
                borderRadius="0"
                btnColor={isMathWalletActive ? '#AAF2C9' : '#ECF0F3'}
                fontSize={'1.2rem'}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  textTransform: 'none',
                  padding: '1rem',
                }}
                onClick={() => {
                  console.log('CLICK ON MATHWALLET')

                  updateProviderUrl('https://www.mathwallet.org')

                  if (isMathWalletActive && !isWalletConnected) {
                    wallet.connect()
                    return
                  }
                }}
              >
                <SvgIcon src={Mathwallet} width={'20%'} height={'70%'} />
                Math Wallet
              </BtnCustom>
            </StyledMenuItem>
            <StyledMenuItem
              theme={theme}
              disableRipple
              disableGutters={true}
              key={'solong'}
            >
              <BtnCustom
              btnWidth={'100%'}
              height={'4rem'}
              border="none"
              borderWidth="0"
              borderRadius="0"
              btnColor={isSolongWallet ? '#AAF2C9' : '#ECF0F3'}
              fontSize={'1.2rem'}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                textTransform: 'none',
                padding: '1rem',
              }}
                onClick={() => {
                  updateProviderUrl('https://solongwallet.com')
                }}
              >
                <SvgIcon src={Solong} width={'20%'} height={'70%'} />
                Solong
              </BtnCustom>
            </StyledMenuItem>
          </MenuList>
        </StyledPaper>
      </StyledDropdown>
    )
  }
}

// {this.props.items.map(({ icon, text, to, style, ...events }) => (
// <StyledMenuItem
//   theme={theme}
//   disableRipple
//   disableGutters={true}
//   key={text}
// >
//     <StyledLink
//       theme={theme}
//       to={to}
//       key={`${text}-link`}
//       onClick={this.handleClose}
//       {...events}
//     >
//       {/* {icon} */}
//       <StyledMenuItemText style={style} key={`${text}-text`}>
//         {text}
//       </StyledMenuItemText>
//     </StyledLink>
//   </StyledMenuItem>
// ))}
