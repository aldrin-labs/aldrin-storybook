import React from 'react'
import styled from 'styled-components'

import { Paper, Theme } from '@material-ui/core'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'

import { MainTitle } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import Close from '@icons/closeIcon.svg'

import { useWallet, WALLET_PROVIDERS } from '@sb/dexUtils/wallet'
import { WalletSelectorRow } from './ConnectWalletPopup.styles'

export const StyledPaper = styled(Paper)`
  height: auto;
  padding: 2rem;
  width: 45rem;
  box-shadow: 0px 0px 0.8rem 0px rgba(0, 0, 0, 0.45);
  background: #222429;
  border-radius: 1.6rem;
`

export const Title = styled(({ ...props }) => <MainTitle {...props} />)`
  text-transform: none;
  font-size: 2.5rem;
  margin-bottom: 0;
`

export const ConnectWalletPopup = ({
  theme,
  onClose,
  open,
}: {
  theme: Theme
  onClose: () => void
  open: boolean
}) => {
  const { setAutoConnect, setProvider } = useWallet()
  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={onClose}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer style={{ marginBottom: '2rem' }} justify={'space-between'}>
        <Title>Select Wallet</Title>
        <SvgIcon
          src={Close}
          width={'2rem'}
          height={'auto'}
          style={{ cursor: 'pointer' }}
          onClick={() => onClose()}
        />
      </RowContainer>
      <RowContainer direction={'column'}>
        {WALLET_PROVIDERS.map((provider) => {
          return (
            <WalletSelectorRow
              onClick={async () => {
                await setProvider(provider.url)
                await setAutoConnect(true)
                await onClose()
              }}
            >
              <SvgIcon src={provider.icon} width={'3rem'} height={'100%'} />
              {provider.name}
            </WalletSelectorRow>
          )
        })}
      </RowContainer>
    </DialogWrapper>
  )
}
