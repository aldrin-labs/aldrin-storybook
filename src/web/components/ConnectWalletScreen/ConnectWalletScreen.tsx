import React, { useState } from 'react'

import { SvgIcon } from '@sb/components'
import {
  RowContainer,
  Title,
} from '@sb/compositions/AnalyticsRoute/index.styles'

import { Theme } from '@material-ui/core'

import LightLogo from '@icons/lightLogo.svg'
import { BtnCustom } from '../BtnCustom/BtnCustom.styles'
import { ConnectWalletPopup } from '@sb/compositions/Chart/components/ConnectWalletPopup/ConnectWalletPopup'

export const ConnectWalletScreen = ({ theme }: { theme: Theme }) => {
  const [isConnectWalletPopupOpen, setIsConnectWalletPopupOpen] = useState(
    false
  )
  return (
    <RowContainer
      direction="column"
      height={'100%'}
      style={{ background: theme.palette.grey.additional }}
    >
      <RowContainer margin={'0 0 4rem 0'}>
        <SvgIcon src={LightLogo} width={'16rem'} height={'16rem'} />
      </RowContainer>
      <RowContainer margin={'0 0 2.4rem 0'}>
        <Title
          fontFamily={'Avenir Next Demi'}
          fontSize={'2.5rem'}
          color={theme.palette.white.main}
        >
          Connect your wallet to begin.
        </Title>
      </RowContainer>
      <RowContainer>
        <BtnCustom
          onClick={() => {
            setIsConnectWalletPopupOpen(true)
          }}
          btnColor={'#F8FAFF'}
          backgroundColor={theme.palette.blue.serum}
          btnWidth={'35rem'}
          borderColor={theme.palette.blue.serum}
          textTransform={'capitalize'}
          height={'6rem'}
          borderRadius="1rem"
          fontSize={'1.5rem'}
          style={{
            display: 'flex',
            textTransform: 'none',
            padding: '1rem',
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
