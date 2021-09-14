import React, { useState } from 'react'
import styled from 'styled-components'

import { Paper, Theme } from '@material-ui/core'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'

import { MainTitle } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { WALLET_PROVIDERS } from '@sb/dexUtils/wallet'
import { StyledPaper, WalletRowContainer } from './styles'
import useMobileSize from '@webhooks/useMobileSize'
import { isIos, isAndroid } from 'react-device-detect'

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
      <RowContainer direction={'column'}>
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
        <a
          style={{ width: '100%', textDecoration: 'none' }}
          href="http://coin98.app.link/CP5tTJgExjb"
        >
          <WalletRowContainer>
            <SvgIcon
              src={`https://gblobscdn.gitbook.com/spaces%2F-MLfdRENhXE4S22AEr9Q%2Favatar-1616412978424.png`}
              width={'6rem'}
              height={'100%'}
            />
            Coin98
          </WalletRowContainer>
        </a>
      </RowContainer>
    </DialogWrapper>
  )
}
