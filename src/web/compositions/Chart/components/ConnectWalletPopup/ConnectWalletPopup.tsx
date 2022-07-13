import { WalletReadyState } from '@solana/wallet-adapter-base'
import { getWalletAdapters } from '@utils/wallets'
import { orderBy } from 'lodash-es'
import React from 'react'

import { Modal } from '@sb/components/Modal'
import SvgIcon from '@sb/components/SvgIcon'
import { useWallet, WALLET_PROVIDERS } from '@sb/dexUtils/wallet'

import {
  WalletSelectorRow,
  CloseIcon,
  WalletIcon,
  WalletRight,
  WalletTitle,
  WalletSubtitle,
  WalletsList,
  BottomText,
  LearnMoreLink,
  Title,
  Header,
  Footer,
} from './ConnectWalletPopup.styles'

const modalContentStyle = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}

const ConnectWalletPopup = ({
  onClose,
  open,
}: {
  onClose: () => void
  open: boolean
}) => {
  const { setAutoConnect, setProvider } = useWallet()
  const walletAdapters = getWalletAdapters()

  const installedWallets = Object.keys(walletAdapters).filter(
    (item) => walletAdapters[item].readyState === WalletReadyState.Installed
  )

  const walletProviders = orderBy(
    WALLET_PROVIDERS,
    (item) => installedWallets.includes(item.sysName),
    ['desc']
  )

  return (
    <Modal
      onClose={onClose}
      open={open}
      width="24em"
      modalContentStyle={modalContentStyle}
    >
      <Header>
        <Title>Connect Wallet</Title>
        <CloseIcon onClick={onClose}>Esc</CloseIcon>
      </Header>

      <WalletsList>
        {walletProviders.map((provider) => {
          return (
            <WalletSelectorRow
              key={`wallet_${provider.name}`}
              onClick={async () => {
                await setProvider(provider.url)
                await setAutoConnect(true)
                await onClose()
              }}
            >
              <WalletIcon>
                <SvgIcon src={provider.icon} width="4em" height="100%" />
              </WalletIcon>

              <WalletRight>
                <WalletTitle>{provider.name}</WalletTitle>
                <WalletSubtitle>
                  {provider.fullName}&nbsp;
                  {walletAdapters[provider.sysName] &&
                    `(${
                      walletAdapters[provider.sysName].readyState ===
                      WalletReadyState.Installed
                        ? 'Connected'
                        : 'Not connected'
                    })`}
                </WalletSubtitle>
              </WalletRight>
            </WalletSelectorRow>
          )
        })}
      </WalletsList>

      <Footer>
        <BottomText>First time using Solana?</BottomText>
        <LearnMoreLink target="_blank" href="https://solana.com">
          Learn More
        </LearnMoreLink>
      </Footer>
    </Modal>
  )
}

export { ConnectWalletPopup }
