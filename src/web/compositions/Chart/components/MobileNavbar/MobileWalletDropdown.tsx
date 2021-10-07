import React from 'react'

import { Theme } from '@material-ui/core'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { WALLET_PROVIDERS } from '@sb/dexUtils/wallet'
import { StyledPaper, WalletRowContainer, MobileWalletWarning } from './styles'
import useMobileSize from '@webhooks/useMobileSize'

export const MobileWalletDropdown = ({
  theme,
  onClose,
  open,
  providerUrl,
  setAutoConnect,
  setProvider,
}: {
  theme: Theme
  onClose: () => void
  open: boolean
  providerUrl: string
  setAutoConnect: (arg: boolean) => void
  setProvider: any
}) => {
  const isMobile = useMobileSize()
  if (!isMobile) return null

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
      <RowContainer style={{ flex: 1 }} direction={'column'}>
        {WALLET_PROVIDERS.filter((el) => el.showOnMobile).map((provider) => {
          return (
            <WalletRowContainer
              onClick={async () => {
                await setProvider(provider.url)
                await setAutoConnect(true)
                await onClose()
              }}
            >
              <SvgIcon src={provider.icon} width={'6rem'} height={'100%'} />
              {provider.name}
            </WalletRowContainer>
          )
        })}
        <MobileWalletWarning style={{ marginTop: 'auto' }}>
          <p>
            Due to technical limitations of most wallets, only three are available for trading from the phone at the moment. To use another wallet, use the full version of DEX.
          </p>
          <p>
            You can also import your seed phrase from any wallet into one of the wallets presented above.
          </p>
        </MobileWalletWarning>
      </RowContainer>
    </DialogWrapper>
  )
}
