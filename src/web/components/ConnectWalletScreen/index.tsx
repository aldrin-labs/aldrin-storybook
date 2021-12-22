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
import { COLORS } from '../../../variables/variables'

interface ConnectWalletContentProps {
  theme: Theme
  size?: 'md' | 'sm'
}

// TODO: styled-components
const SIZES = {
  md: {
    icon: '8em',
    logoRowMargin: '2rem 0 4rem 0',
    btnContainerMargin: '0 0 2rem 0',
    fontSize: '1.5em',
    titleMargin: '0 0 2.4rem 0',
    btnHeight: '3em',
  },
  sm: {
    icon: '4em',
    logoRowMargin: '0rem 0 1rem 0',
    btnContainerMargin: '0',
    fontSize: '1em',
    titleMargin: '0 0 1em 0',
    btnHeight: '2.3em',
  },
}

const ConnectWalletContent: React.FC<ConnectWalletContentProps> = (props) => {
  const { theme, size = 'md' } = props
  const sizes = SIZES[size]
  const [isConnectWalletPopupOpen, setIsConnectWalletPopupOpen] =
    useState(false)
  return (
    <RowContainer style={{ fontSize: '16px' }} margin="auto 0">
      <RowContainer margin={sizes.logoRowMargin}>
        <SvgIcon src={LightLogo} width={sizes.icon} height={sizes.icon} />
      </RowContainer>
      <RowContainer margin={sizes.titleMargin}>
        <Title
          fontFamily="Avenir Next Demi"
          fontSize={sizes.fontSize}
          color={COLORS.primaryWhite}
          style={{ textAlign: 'center' }}
        >
          Connect your wallet to begin.
        </Title>
      </RowContainer>
      <RowContainer margin={sizes.btnContainerMargin}>
        <BtnCustom
          onClick={() => {
            setIsConnectWalletPopupOpen(true)
          }}
          btnColor="#F8FAFF"
          backgroundColor={COLORS.primary}
          btnWidth="12em"
          borderColor={COLORS.primary}
          textTransform="capitalize"
          height={sizes.btnHeight}
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
