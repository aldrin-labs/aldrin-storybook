import useMobileSize from '@webhooks/useMobileSize'
import React from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { WALLET_PROVIDERS } from '@sb/dexUtils/wallet'

import { StyledPaper, WalletRowContainer } from './styles'

export const MobileWalletDropdown = ({
  onClose,
  open,
  setAutoConnect,
  setProvider,
}: {
  onClose: () => void
  open: boolean
  setAutoConnect: (arg: boolean) => void
  setProvider: any
}) => {
  const isMobile = useMobileSize()
  if (!isMobile) return null

  return (
    <DialogWrapper
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={onClose}
      maxWidth="md"
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer direction="column">
        {WALLET_PROVIDERS.filter((el) => el.showOnMobile).map((provider) => {
          return (
            <WalletRowContainer
              onClick={async () => {
                await setProvider(provider.url)
                await setAutoConnect(true)
                await onClose()
              }}
            >
              <SvgIcon src={provider.icon} width="6rem" height="100%" />
              {provider.name}
            </WalletRowContainer>
          )
        })}
      </RowContainer>
    </DialogWrapper>
  )
}
