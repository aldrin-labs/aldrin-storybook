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
import Sollet from '@icons/sollet.svg'
import Mathwallet from '@icons/mathwallet.svg'
import Solong from '@icons/solong.svg'
import CCAI from '@icons/ccai.svg'
import { CCAIProviderURL } from '@sb/dexUtils/utils'
import { IProps } from './types'
import styled from 'styled-components'

const WalletStatusButton = ({ wallet, connected, theme, id }) => (
  <BtnCustom
    onClick={connected ? wallet.disconnect : wallet.connect}
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

const ConnectWalletButton = ({ wallet, connected, theme, height, id }) => (
  <BtnCustom
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
      setAutoConnect,
      isNavBar,
      height,
      showOnTop,
    } = this.props

    const isCCAIActive = providerUrl === CCAIProviderURL
    const isSolletActive = providerUrl === 'https://www.sollet.io'
    const isMathWalletActive = providerUrl === 'https://www.mathwallet.org'
    const isSolongWallet = providerUrl === 'https://solongwallet.com'

    const isWalletConnected = connected
    return (
      <>
        <StyledDropdown isNavBar={isNavBar} theme={theme} showOnTop={showOnTop}>
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
            isWalletConnected={isWalletConnected}
            customActiveRem={'9rem'}
            customNotActiveRem={'3rem'}
          >
            <MenuList style={{ padding: 0 }}>
              <StyledMenuItem
                theme={theme}
                disableRipple
                disableGutters={true}
                key={'ccai'}
                isActive={isCCAIActive}
              >
                <StyledButton
                  btnWidth={'100%'}
                  height={'4rem'}
                  border="none"
                  borderWidth="0"
                  borderRadius="0"
                  btnColor={isCCAIActive ? '#AAF2C9' : '#ECF0F3'}
                  fontSize={'1.2rem'}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    textTransform: 'none',
                    padding: '1rem',
                    background: isCCAIActive ? 'rgba(55, 56, 62, 0.75)' : '',
                    '& span': {
                      height: '100%',
                    },
                  }}
                  onClick={() => {
                    console.log('CLICK ON CCAI')

                    // if (isCCAIActive && !isWalletConnected) {
                    //   wallet.connect()
                    //   return
                    // }

                    updateProviderUrl(CCAIProviderURL)

                    setAutoConnect(true)
                  }}
                >
                  {' '}
                  <SvgIcon src={CCAI} width={'auto'} height={'100%'} />
                  Wallet™
                </StyledButton>
              </StyledMenuItem>
              <StyledMenuItem
                theme={theme}
                disableRipple
                disableGutters={true}
                key={'sollet'}
                isActive={isSolletActive}
              >
                <StyledButton
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
                    background: isSolletActive ? 'rgba(55, 56, 62, 0.75)' : '',
                  }}
                  onClick={() => {
                    console.log('CLICK ON SOLLET')

                    // if (isSolletActive && !isWalletConnected) {
                    //   wallet.connect()
                    //   return
                    // }

                    updateProviderUrl('https://www.sollet.io')
                    setAutoConnect(true)
                  }}
                >
                  <SvgIcon src={Sollet} width={'auto'} height={'100%'} />
                  Sollet.io
                </StyledButton>
              </StyledMenuItem>
              {/* <StyledMenuItem
                theme={theme}
                disableRipple
                disableGutters={true}
                key={'mathwallet'}
                isActive={isMathWalletActive}
              >
                <StyledButton
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
                    background: isMathWalletActive
                      ? 'rgba(55, 56, 62, 0.75)'
                      : '',
                  }}
                  onClick={() => {
                    console.log('CLICK ON MATHWALLET') */}

              {/* // if (isMathWalletActive && !isWalletConnected) { */}
              {/* //   wallet.connect()
                    //   return
                    // }

                //     updateProviderUrl('https://www.mathwallet.org')
                //     setAutoConnect(true)
                //   }}
                // >
                //   <SvgIcon src={Mathwallet} width={'auto'} height={'80%'} />
                //   Math Wallet
                // </StyledButton>
              // </StyledMenuItem> */}
              <StyledMenuItem
                theme={theme}
                disableRipple
                disableGutters={true}
                key={'solong'}
                isActive={isSolongWallet}
              >
                <StyledButton
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
                    background: isSolongWallet ? 'rgba(55, 56, 62, 0.75)' : '',
                  }}
                  onClick={() => {
                    // if (isSolongWallet && !isWalletConnected) {
                    //   wallet.connect()
                    //   return
                    // }

                    updateProviderUrl('https://solongwallet.com')
                    setAutoConnect(true)
                  }}
                >
                  <SvgIcon src={Solong} width={'auto'} height={'100%'} />
                  Solong
                </StyledButton>
              </StyledMenuItem>
            </MenuList>
          </StyledPaper>
          ,{/* document.body
          )} */}
        </StyledDropdown>
      </>
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
