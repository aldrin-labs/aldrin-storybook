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
} from './ConnectWalletPopup.styles'

export const StyledPaper = styled(Paper)`
  height: auto;
  padding: 2rem;
  width: 45rem;
  box-shadow: 0px 0px 0.8rem 0px rgba(0, 0, 0, 0.45);
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
      <RowContainer style={{ marginBottom: '2rem' }} justify="space-between">
        <Title>Select Wallet</Title>
        <CloseIcon onClick={() => onClose()}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 19 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 18L9.5 9.5M18 1L9.5 9.5M9.5 9.5L18 18L1 1"
              stroke="#F5F5FB"
              strokeWidth="2"
            />
          </svg>
        </CloseIcon>
      </RowContainer>
      <RowContainer direction="column">
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
              {provider.name.includes('Wallet™') ||
              provider.name.includes('MathWallet') ||
              provider.name.includes('Ledger') ? (
                <WalletIcon
                  radius={provider.name.includes('Ledger') ? '10px' : '50%'}
                >
                  <SvgIcon src={provider.icon} width="3rem" height="100%" />
                </WalletIcon>
              ) : (
                <SvgIcon src={provider.icon} width="4rem" height="100%" />
              )}

              {provider.name}
            </WalletSelectorRow>
          )
        })}
      </RowContainer>
    </DialogWrapper>
  )
}

export { ConnectWalletPopup }
