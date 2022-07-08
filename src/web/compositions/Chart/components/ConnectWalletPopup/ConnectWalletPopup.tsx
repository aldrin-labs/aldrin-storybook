import { WalletReadyState } from '@solana/wallet-adapter-base'
import { getWalletAdapters } from '@utils/wallets'
import { orderBy } from 'lodash-es'
import React from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
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
  StyledPaper,
  Title,
} from './ConnectWalletPopup.styles'

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

  return (
    <DialogWrapper
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={onClose}
      maxWidth="md"
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer
        style={{ padding: '3rem', borderBottom: '1px solid #000' }}
        justify="space-between"
      >
        <Title>Connect Wallet</Title>
        <CloseIcon onClick={onClose}>Esc</CloseIcon>
      </RowContainer>

      <WalletsList>
        {orderBy(
          WALLET_PROVIDERS,
          (item) => installedWallets.includes(item.sysName),
          ['desc']
        ).map((provider) => {
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

      <RowContainer
        style={{ padding: '2.4rem 3rem', borderTop: '1px solid #000' }}
        justify="space-between"
      >
        <BottomText>First time using Solana?</BottomText>
        <LearnMoreLink target="_blank" href="https://solana.com">Learn More</LearnMoreLink>
      </RowContainer>
    </DialogWrapper>
  )
}

export { ConnectWalletPopup }
