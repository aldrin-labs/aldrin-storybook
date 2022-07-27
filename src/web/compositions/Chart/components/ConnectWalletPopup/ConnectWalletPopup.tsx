import { WalletReadyState } from '@solana/wallet-adapter-base'
import useMobileSize from '@webhooks/useMobileSize'
import { orderBy } from 'lodash-es'
import React from 'react'

import { Modal } from '@sb/components/Modal'
import SvgIcon from '@sb/components/SvgIcon'
import { useConnectionConfig } from '@sb/dexUtils/connection'
import { useWallet, WALLET_PROVIDERS } from '@sb/dexUtils/wallet'

import { ALDRIN_WALLET_SYSNAME } from '@core/solana'

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

const modalRootStyle = {
  backdropFilter: 'none',
  justifyContent: 'flex-start',
}

const ConnectWalletPopup = ({
  onClose,
  open,
}: {
  onClose: () => void
  open: boolean
}) => {
  const { setAutoConnect, setProvider } = useWallet()
  const { endpoint } = useConnectionConfig()
  const isMobile = useMobileSize()

  const modalBodyStyle = isMobile
    ? {
        maxHeight: '65vh',
      }
    : {
        alignSelf: 'flex-end',
        marginTop: '75px',
        marginRight: '24px',
        maxHeight: '80vh',
      }

  const walletProviders = WALLET_PROVIDERS.map((item) => {
    const adapter = item.adapter(item.url, endpoint)
    return {
      ...item,
      status: adapter.readyState,
    }
  })

  const sortedWalletProviders = orderBy(
    walletProviders,
    (item) => item.status === WalletReadyState.Installed,
    ['desc']
  )

  return (
    <Modal
      onClose={onClose}
      open={open}
      width="24em"
      styles={{
        root: modalRootStyle,
        body: modalBodyStyle,
        content: modalContentStyle,
      }}
    >
      <Header>
        <Title>Connect Wallet</Title>
        <CloseIcon onClick={onClose}>Esc</CloseIcon>
      </Header>

      <WalletsList>
        {sortedWalletProviders.map((provider) => {
          let meta

          if (provider.status === WalletReadyState.Installed) {
            meta = 'Connected'
          } else {
            meta = 'Not Connected'
          }

          if (provider.sysName === ALDRIN_WALLET_SYSNAME) {
            meta = 'Deprecated'
          }

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
                  {provider.fullName}
                  {meta && ` (${meta})`}
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
