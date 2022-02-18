import { Theme, withTheme } from '@material-ui/core'
import React, { ReactNode, useState } from 'react'

import { SvgIcon } from '@sb/components'
import {
  RowContainer,
  Title,
} from '@sb/compositions/AnalyticsRoute/index.styles'
import { ConnectWalletPopup } from '@sb/compositions/Chart/components/ConnectWalletPopup/ConnectWalletPopup'

import LightLogo from '@icons/lightLogo.svg'

import { COLORS } from '../../../variables/variables'
import { BtnCustom } from '../BtnCustom/BtnCustom.styles'

interface ConnectWalletContentProps {
  theme: Theme
  size?: 'button-only' | 'md' | 'sm'
  text?: ReactNode
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
    btnWidth: '12em',
  },
  sm: {
    icon: '4em',
    logoRowMargin: '0rem 0 1rem 0',
    btnContainerMargin: '0',
    fontSize: '1em',
    titleMargin: '0 0 1em 0',
    btnHeight: '2.3em',
    btnWidth: '12em',
  },
  'button-only': {
    icon: '4em',
    logoRowMargin: '0rem 0 1rem 0',
    btnContainerMargin: '0',
    fontSize: '1em',
    titleMargin: '0 0 1em 0',
    btnHeight: '3em',
    btnWidth: '100%',
  },
}

const ConnectWalletContent: React.FC<ConnectWalletContentProps> = (props) => {
  const { theme, size = 'md', text = 'Connect your wallet to begin.' } = props
  const sizes = SIZES[size]
  const isButtonOnly = size === 'button-only'
  const [isConnectWalletPopupOpen, setIsConnectWalletPopupOpen] =
    useState(false)

  const buttonWithModal = (
    <>
      <BtnCustom
        onClick={() => {
          setIsConnectWalletPopupOpen(true)
        }}
        btnColor="#F8FAFF"
        backgroundColor={COLORS.primary}
        btnWidth={sizes.btnWidth}
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
      <ConnectWalletPopup
        theme={theme}
        open={isConnectWalletPopupOpen}
        onClose={() => setIsConnectWalletPopupOpen(false)}
      />
    </>
  )

  if (isButtonOnly) {
    return <>{buttonWithModal}</>
  }

  return (
    <RowContainer style={{ fontSize: '16px' }} margin="auto 0">
      <RowContainer margin={sizes.logoRowMargin}>
        <SvgIcon src={LightLogo} width={sizes.icon} height={sizes.icon} />
      </RowContainer>
      <RowContainer margin={sizes.titleMargin}>
        {text && (
          <Title
            fontFamily="Avenir Next Demi"
            fontSize={sizes.fontSize}
            color={COLORS.primaryWhite}
            style={{ textAlign: 'center' }}
          >
            {text}
          </Title>
        )}
      </RowContainer>
      <RowContainer margin={sizes.btnContainerMargin}>
        {buttonWithModal}
      </RowContainer>
    </RowContainer>
  )
}

export const ConnectWalletInner = withTheme()(ConnectWalletContent)

export const ConnectWalletScreen = ({ theme }: { theme: Theme }) => {
  return (
    <RowContainer
      direction="column"
      height="100%"
      style={{ background: COLORS.mainBlack }}
    >
      <ConnectWalletInner />
    </RowContainer>
  )
}
