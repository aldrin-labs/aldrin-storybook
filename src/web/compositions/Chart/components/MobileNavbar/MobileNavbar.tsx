import React, { useState } from 'react'
import { withTheme } from '@material-ui/core/styles'
import { withPublicKey } from '@core/hoc/withPublicKey'
import { useWallet } from '@sb/dexUtils/wallet'

import { Theme } from '@sb/types/materialUI'
import { DisconnectButton, NavBarForSmallScreens } from './styles'
import { Link } from 'react-router-dom'

import SvgIcon from '@sb/components/SvgIcon'
import {
  LinkToDiscord,
  LinkToTelegram,
  LinkToTwitter,
} from '@sb/compositions/Homepage/styles'
import serumCCAILogo from '@icons/serumCCAILogo.svg'

import {
  Row,
  ReusableTitle as Title,
  RowContainer,
} from '@sb/compositions/AnalyticsRoute/index.styles'

import { compose } from 'recompose'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import WalletIcon from '@icons/walletIcon.svg'

import { CCAIProviderURL } from '@sb/dexUtils/utils'
import { formatSymbol } from '@sb/components/AllocationBlock/DonutChart/utils'
import { useBalances } from '@sb/dexUtils/markets'
import ConnectWalletDropdown from '@sb/components/ConnectWalletDropdown'
import { MobileWalletDropdown } from './MobileWalletDropdown'

export const MobileNavBar = ({
  theme,
  pathname,
  publicKey,
}: {
  theme: Theme
  pathname: string
  publicKey: string
}) => {
  const { wallet, providerUrl, setAutoConnect, setProvider } = useWallet()
  const [isWalletsDropdownOpen, setIsWalletsDropdownOpen] = useState(false)

  const isCCAIActive = providerUrl === CCAIProviderURL
  const isSolletActive = providerUrl === 'https://www.sollet.io'
  const isSolletExtensionActive =
    providerUrl === 'https://www.sollet.io/extension'
  const isMathWalletActive = providerUrl === 'https://www.mathwallet.org'
  const isSolongWallet = providerUrl === 'https://solongwallet.com'
  return (
    <NavBarForSmallScreens theme={theme}>
      <Link style={{ width: '30%' }} to="/">
        <SvgIcon src={serumCCAILogo} width={'100%'} height={'auto'} />
      </Link>
      {pathname === '/' ? (
        <Row justify={'space-between'} width={'35%'}>
          <LinkToTwitter />
          <LinkToTelegram />
          <LinkToDiscord />
        </Row>
      ) : (
        <Row
          justify={wallet.connected ? 'space-between' : 'flex-end'}
          width={wallet.connected ? '55%' : '40%'}
        >
          {wallet.connected ? (
            <RowContainer justify={'space-between'} direction={'row'}>
              <SvgIcon src={WalletIcon} />
              <Row>
                <Row align={'flex-start'} direction={'column'}>
                  <Title
                    fontSize="1.2rem"
                    fontFamily="Avenir Next Bold"
                    style={{ margin: '0 0 1rem 0' }}
                  >
                    {isCCAIActive ? (
                      <>
                        <span style={{ fontFamily: 'Avenir Next Demi' }}>
                          Wallet™
                        </span>
                        &nbsp; by CCAI Connected
                      </>
                    ) : isSolletActive ? (
                      'Sollet Wallet Connected'
                    ) : isSolletExtensionActive ? (
                      'Sollet Extension Wallet Connected'
                    ) : isMathWalletActive ? (
                      'Math Wallet Connected'
                    ) : isSolongWallet ? (
                      'Solong Wallet Connected'
                    ) : (
                      'Wallet Connected'
                    )}
                  </Title>
                  <Title
                    fontFamily="Avenir Next"
                    color={'rgb(147, 160, 178)'}
                    fontSize="1rem"
                  >
                    {`${wallet?.publicKey
                      ?.toBase58()
                      .slice(0, 7)}...${wallet?.publicKey
                      ?.toBase58()
                      .slice(wallet?.publicKey?.toBase58().length - 7)}`}
                  </Title>
                </Row>
              </Row>
              <DisconnectButton
                onClick={() => wallet?.disconnect && wallet.disconnect()}
              >
                Disconnect
              </DisconnectButton>
            </RowContainer>
          ) : (
            <BtnCustom
              theme={theme}
              onClick={() => setIsWalletsDropdownOpen(true)}
              needMinWidth={false}
              btnWidth="auto"
              height="auto"
              fontSize="1.4rem"
              padding="1.5rem 3.5rem"
              borderRadius="1.1rem"
              borderColor={'#366CE5'}
              btnColor={'#fff'}
              backgroundColor={'#366CE5'}
              textTransform={'none'}
              margin={'0'}
              transition={'all .4s ease-out'}
              style={{ whiteSpace: 'nowrap' }}
            >
              Connect Wallet
            </BtnCustom>
          )}
        </Row>
      )}
      <MobileWalletDropdown
        providerUrl={providerUrl}
        setAutoConnect={setAutoConnect}
        setProvider={setProvider}
        theme={theme}
        open={isWalletsDropdownOpen}
        onClose={() => setIsWalletsDropdownOpen(false)}
      />
    </NavBarForSmallScreens>
  )
}

export default compose(withTheme(), withPublicKey)(MobileNavBar)
