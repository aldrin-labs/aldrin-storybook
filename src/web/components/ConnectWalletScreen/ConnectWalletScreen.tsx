import React, { useState } from 'react'

import { SvgIcon } from '@sb/components'
import {
  RowContainer,
  Title,
} from '@sb/compositions/AnalyticsRoute/index.styles'

import { Theme, withTheme } from '@material-ui/core'

import LightLogo from '@icons/lightLogo.svg'
import { ConnectWalletPopup } from '@sb/compositions/Chart/components/ConnectWalletPopup/ConnectWalletPopup'
import { BtnCustom } from '../BtnCustom/BtnCustom.styles'

interface WithTheme {
  theme: Theme
}

const ConnectWalletContent: React.FC<WithTheme> = (props) => {
  const { theme } = props
  const [isConnectWalletPopupOpen, setIsConnectWalletPopupOpen] =
    useState(false)
  return (
    <RowContainer style={{ fontSize: '16px' }} margin="auto 0">
      <RowContainer margin="2rem 0 4rem 0">
        <SvgIcon src={LightLogo} width="8em" height="8em" />
      </RowContainer>
      <RowContainer margin="0 0 2.4rem 0">
        <Title
          fontFamily="Avenir Next Demi"
          fontSize="1.5em"
          color={theme.palette.white.main}
          style={{ textAlign: 'center' }}
        >
          Connect your wallet to begin.
        </Title>
      </RowContainer>
      <RowContainer margin="0 0 2rem 0">
        <BtnCustom
          onClick={() => {
            setIsConnectWalletPopupOpen(true)
          }}
          btnColor="#F8FAFF"
          backgroundColor={theme.palette.blue.serum}
          btnWidth="12em"
          borderColor={theme.palette.blue.serum}
          textTransform="capitalize"
          height="3em"
          borderRadius="0.5em"
          fontSize="1em"
          style={{
            display: 'flex',
            textTransform: 'none',
            padding: '0.5em',
            whiteSpace: 'nowrap',
          }}
        >
          Connect wallet
        </BtnCustom>
      </RowContainer>
      <ConnectWalletPopup
        theme={theme}
        open={isConnectWalletPopupOpen}
        onClose={() => setIsConnectWalletPopupOpen(false)}
      />
    </RowContainer>
  )
}

export const ConnectWalletInner = withTheme()(ConnectWalletContent)

export const ConnectWalletScreen = ({ theme }: { theme: Theme }) => {
  return (
    <RowContainer
      direction="column"
      height="100%"
      style={{ background: theme.palette.grey.additional }}
    >
      <ConnectWalletInner />
    </RowContainer>
  )
}
