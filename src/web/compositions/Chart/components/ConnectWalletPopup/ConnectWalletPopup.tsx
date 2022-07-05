import { Paper } from '@material-ui/core'
import React from 'react'
import styled from 'styled-components'

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
} from './ConnectWalletPopup.styles'

export const StyledPaper = styled(Paper)`
  height: auto;
  width: 45rem;
  box-shadow: 0 0 0.8rem 0 rgba(0, 0, 0, 0.45);
  background: ${(props) => props.theme.colors.gray6};
  border-radius: 1.6rem;
`

export const Title = styled.span`
  font-family: Avenir Next Bold;
  font-size: 3rem;
  line-height: 4rem;
  text-align: center;
  letter-spacing: 0.01rem;
  text-transform: none;
  margin-bottom: 0;
  color: ${({ theme }) => theme.colors.gray0};
`

const ConnectWalletPopup = ({
  onClose,
  open,
}: {
  onClose: () => void
  open: boolean
}) => {
  const { setAutoConnect, setProvider } = useWallet()
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
        {WALLET_PROVIDERS.map((provider) => {
          return (
            <WalletSelectorRow
              key={`wallet_${provider.providerName}`}
              onClick={async () => {
                await setProvider(provider.url)
                await setAutoConnect(true)
                await onClose()
              }}
            >
              <WalletIcon>
                <SvgIcon src={provider.icon} width="3rem" height="100%" />
              </WalletIcon>

              <WalletRight>
                <WalletTitle>{provider.name}</WalletTitle>
                <WalletSubtitle>{provider.fullName}</WalletSubtitle>
              </WalletRight>
            </WalletSelectorRow>
          )
        })}
      </WalletsList>
    </DialogWrapper>
  )
}

export { ConnectWalletPopup }
