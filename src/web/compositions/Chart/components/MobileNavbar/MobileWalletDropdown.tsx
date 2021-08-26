import React, { useState } from 'react'
import styled from 'styled-components'

import { Paper, Theme } from '@material-ui/core'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'

import { MainTitle } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { WALLET_PROVIDERS } from '@sb/dexUtils/wallet'
import { StyledPaper } from './styles'
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
      <RowContainer direction={'column'}>
        {WALLET_PROVIDERS.filter((el) => el.showOnMobile).map((provider) => {
          return (
            <RowContainer
              style={{
                display: 'flex',
                height: '15rem',
                justifyContent: 'space-between',
                textTransform: 'none',
                whiteSpace: 'normal',
                textAlign: 'right',
                background: '#17181A',
                borderBottom: '0.2rem solid #383B45',
                fontSize: '2.5rem',
                color: '#fbf2f2',
                fontFamily: 'Avenir Next Medium',
              }}
              onClick={async () => {
                await setProvider(provider.url)
                await setAutoConnect(true)
                await onClose()
              }}
            >
              <SvgIcon src={provider.icon} width={'6rem'} height={'100%'} />
              {provider.name}
            </RowContainer>
          )
        })}
      </RowContainer>
    </DialogWrapper>
  )
}
