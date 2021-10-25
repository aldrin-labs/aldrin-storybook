import React, { useState } from 'react'
import { MASTER_BUILD } from '@core/utils/config'
import AldrinLogo from '@icons/Aldrin.svg'
import LightLogo from '@icons/lightLogo.svg'
import WalletIcon from '@icons/walletIcon.svg'
import { withTheme, MenuList } from '@material-ui/core'
import ConnectWalletDropdown from '@sb/components/ConnectWalletDropdown/index'
import NavLinkButton from '@sb/components/NavBar/NavLinkButton/NavLinkButton'
import SvgIcon from '@sb/components/SvgIcon'
import {
  ReusableTitle as Title,
  Row,
  Row,
  RowContainer,
} from '@sb/compositions/AnalyticsRoute/index.styles'
import {
  ChartGridContainer,
  RoundLink,
} from '@sb/compositions/Chart/Chart.styles'
import { RINProviderURL } from '@sb/dexUtils/utils'
import { useWallet } from '@sb/dexUtils/wallet'
import { Link, useLocation } from 'react-router-dom'
import { CustomCard, PanelWrapper } from '../Chart.styles'
import ListingRequestPopup from './ListingRequestPopup/ListingRequestPopup'
import {
  RedButton,
  DropdownContainer,
  DropwodnItem,
  MenuDropdownLink,
} from './styles'
import { FeedbackPopup } from './UsersFeedbackPopup'
import {
  StyledDropdown,
  StyledPaper,
  StyledMenuItem,
} from '../../../components/Dropdown/Dropdown.styles'
import color from '@material-ui/core/colors/amber'
import { ConnectWalletPopup } from './ConnectWalletPopup/ConnectWalletPopup'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

const CARD_STYLE: React.CSSProperties = {
  // position: 'relative',
  display: 'flex',
  maxWidth: '100%',
  flexGrow: 1,
  border: '0',
  overflow: 'visible',
}

const LOGO_LINK_STYLE: React.CSSProperties = {
  width: '13rem',
  height: '100%',
}

const NAV_LINK_STYLE: React.CSSProperties = { width: '13rem' }

const MENU_ITEM_STYLE: React.CSSProperties = { background: '#0E1016' }
const DROPDOWN_STYLE: React.CSSProperties = { height: '5rem' }
const PAPER_STYLE: React.CSSProperties = {
  marginTop: '-1rem',
  marginLeft: '-1rem',
}
const NAV_LINK_DROPDOWN_STYLE: React.CSSProperties = {
  width: '100%',
  margin: '0.5rem 1rem',
}

interface DropdownProps {
  theme: { [c: string]: any } // TODO
}

const Dropdown: React.FC<DropdownProps> = (props) => {
  const { theme } = props
  return (
    <DropdownContainer>
      <StyledDropdown style={DROPDOWN_STYLE} theme={theme}>
        <DropwodnItem theme={theme}>Trading</DropwodnItem>
        <StyledPaper style={PAPER_STYLE} theme={theme}>
          <MenuList style={{ padding: 0 }}>
            <StyledMenuItem
              style={MENU_ITEM_STYLE}
              theme={theme}
              disableRipple
              disableGutters={true}
            >
              <NavLinkButton
                style={NAV_LINK_DROPDOWN_STYLE}
                component={(props) => <Link to={`/chart`} {...props} />}
              >
                <MenuDropdownLink>Terminal</MenuDropdownLink>
              </NavLinkButton>
            </StyledMenuItem>
            <StyledMenuItem
              theme={theme}
              disableRipple
              style={MENU_ITEM_STYLE}
              disableGutters={true}
            >
              <NavLinkButton
                style={NAV_LINK_DROPDOWN_STYLE}
                component={(props) => <Link to={`/swap`} {...props} />}
              >
                <MenuDropdownLink>Swap</MenuDropdownLink>
              </NavLinkButton>
            </StyledMenuItem>
          </MenuList>
        </StyledPaper>
      </StyledDropdown>
    </DropdownContainer>
  )
}

export const CardsPanel = ({ theme }) => {
  const location = useLocation()
  const [isFeedBackPopupOpen, setIsFeedBackPopupOpen] = useState(false)
  const [isListingRequestPopupOpen, setIsListingRequestPopupOpen] = useState(
    false
  )

  const isDarkTheme = theme.palette.type === 'dark'

  return (
    <ChartGridContainer theme={theme}>
      <PanelWrapper>
        <CustomCard theme={theme} style={CARD_STYLE}>
          <Link to={'/'} style={LOGO_LINK_STYLE}>
            <img
              style={{
                width: '100%',
                height: '100%',
              }}
              src={isDarkTheme ? AldrinLogo : LightLogo}
            />
          </Link>
          <RoundLink
            pathname={location.pathname}
            to="/staking"
            page={'staking'}
          >
            Stake RIN
          </RoundLink>
          <Row
            style={{
              borderLeft: theme.palette.border.new,
              justifyContent: 'flex-end',
              padding: '1rem 2rem',
              flexWrap: 'nowrap',
            }}
          >
            <NavLinkButton
              theme={theme}
              style={NAV_LINK_STYLE}
              onClick={() => setIsFeedBackPopupOpen(true)}
            >
              Feedback &amp; Support
            </NavLinkButton>
            <NavLinkButton
              theme={theme}
              style={NAV_LINK_STYLE}
              onClick={() => setIsListingRequestPopupOpen(true)}
            >
              Request listing
            </NavLinkButton>
          </Row>
          <div
            style={{
              width: '100%',
              padding: '1rem 4rem 1rem 4rem',
              borderRight: theme.palette.border.new,
              borderLeft: theme.palette.border.new,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Dropdown theme={theme} />

            {/* <NavLinkButton
              theme={theme}
              data-tut="analytics"
              page={'analytics'}
              pathname={location.pathname}
              component={(props) => <Link to={`/analytics/all`} {...props} />}
            >
              Analytics
            </NavLinkButton> */}
            <NavLinkButton
              theme={theme}
              pathname={location.pathname}
              to="/rebalance"
              page={'rebalance'}
              style={NAV_LINK_STYLE}
              component={(props) => <Link to={`/rebalance`} {...props} />}
            >
              Rebalance
            </NavLinkButton>
            <NavLinkButton
              theme={theme}
              pathname={location.pathname}
              to="/dashboard"
              page={'dashboard'}
              style={{ width: '13rem' }}
              component={(props) => <Link to={`/dashboard`} {...props} />}
            >
              Dashboard
            </NavLinkButton>
            <NavLinkButton
              theme={theme}
              data-tut="farming"
              pathname={location.pathname}
              page={'wallet'}
              component={(props) => <a href={RINProviderURL} {...props} />}
            >
              Wallet
            </NavLinkButton>
            {!MASTER_BUILD && (
              <NavLinkButton
                theme={theme}
                page={'/pools'}
                pathname={location.pathname}
                component={(props) => <Link to={`/pools`} {...props} />}
              >
                Pools
              </NavLinkButton>
            )}
            {/* {!MASTER_BUILD && (
              <NavLinkButton
                style={{ color: '#386DE6' }}
                theme={theme}
                data-tut="farming"
                pathname={location.pathname}
                page={'wallet'}
                component={(props) => <a href={CCAIProviderURL} {...props} />}
              >
                SunWallet
              </NavLinkButton>
            )} */}
            <NavLinkButton
              theme={theme}
              data-tut="token"
              pathname={location.pathname}
              page={'token'}
              component={(props) => (
                <a
                  href="https://rin.aldrin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              )}
            >
              Token
            </NavLinkButton>
          </div>
        </CustomCard>

        <TopBar theme={theme} />
      </PanelWrapper>
      <FeedbackPopup
        open={isFeedBackPopupOpen}
        onClose={() => {
          setIsFeedBackPopupOpen(false)
        }}
      />
      <ListingRequestPopup
        theme={theme}
        open={isListingRequestPopupOpen}
        onClose={() => {
          setIsListingRequestPopupOpen(false)
        }}
      />
    </ChartGridContainer>
  )
}

const TopBar = ({ theme }) => {
  const [isConnectWalletPopupOpen, setIsConnectWalletPopupOpen] = useState(
    false
  )
  const { connected, wallet, providerUrl } = useWallet()

  const isCCAIActive = providerUrl === RINProviderURL
  const isSolletActive = providerUrl === 'https://www.sollet.io'
  const isSolletExtensionActive =
    providerUrl === 'https://www.sollet.io/extension'
  const isMathWalletActive = providerUrl === 'https://www.mathwallet.org'
  const isSolongWallet = providerUrl === 'https://solongwallet.com'

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      {!connected && (
        <Row style={{ paddingLeft: '4rem' }} data-tut="wallet" wrap={'nowrap'}>
          <BtnCustom
            onClick={() => {
              setIsConnectWalletPopupOpen(true)
            }}
            btnColor={'#F8FAFF'}
            backgroundColor={theme.palette.blue.serum}
            btnWidth={'14rem'}
            borderColor={theme.palette.blue.serum}
            textTransform={'capitalize'}
            height={'3.5rem'}
            borderRadius="0.8rem"
            fontSize={'1.5rem'}
            style={{
              display: 'flex',
              textTransform: 'none',
              padding: '1rem',
              whiteSpace: 'nowrap',
            }}
          >
            Connect wallet
          </BtnCustom>
        </Row>
      )}
      {connected && (
        <RowContainer wrap="nowrap">
          <SvgIcon
            src={WalletIcon}
            width="1.6rem"
            height="1.6rem"
            style={{ margin: '0 2rem' }}
          />
          <Row direction="column" align="flex-start" margin="0 0 1rem 0">
            <Title fontSize="1rem" fontFamily="Avenir Next">
              {isCCAIActive ? (
                <>
                  <span style={{ fontFamily: 'Avenir Next Demi' }}>
                    Wallet™
                  </span>{' '}
                  &nbsp; by Aldrin.com
                </>
              ) : isSolletActive ? (
                'Sollet Wallet'
              ) : isSolletExtensionActive ? (
                'Sollet Extension Wallet'
              ) : isMathWalletActive ? (
                'Math Wallet'
              ) : isSolongWallet ? (
                'Solong Wallet'
              ) : (
                'Wallet'
              )}
            </Title>
            <Title
              fontFamily="Avenir Next"
              color={'rgb(147, 160, 178)'}
              fontSize="1rem"
            >
              {wallet?.publicKey?.toBase58()}
            </Title>
          </Row>
          <RedButton
            width="10rem"
            height="2rem"
            theme={theme}
            fontSize="1.2rem"
            onClick={() => {
              wallet?.disconnect && wallet.disconnect()
            }}
            style={{
              position: 'absolute',
              right: '0',
              bottom: '.5rem',
              fontFamily: 'Avenir Next Demi',
            }}
          >
            Disconnect
          </RedButton>
        </RowContainer>
      )}
      <ConnectWalletPopup
        theme={theme}
        open={isConnectWalletPopupOpen}
        onClose={() => setIsConnectWalletPopupOpen(false)}
      />
    </div>
  )
}

const MemoizedCardsPanel = React.memo(CardsPanel)

export default withTheme()(MemoizedCardsPanel)
