import React from 'react'

import ConnectWalletDropdown from '@sb/components/ConnectWalletDropdown'
import { SvgIcon } from '@sb/components'
import {
  RowContainer,
  Title,
} from '@sb/compositions/AnalyticsRoute/index.styles'

import { Theme } from '@material-ui/core'

import LightLogo from '@icons/lightLogo.svg'

const ConnectWallet = ({ theme }: { theme: Theme }) => {
  return (
    <RowContainer direction="column" height={'100%'}>
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
        <ConnectWalletDropdown
          height={'6rem'}
          theme={theme}
          id={'Dashboard-Wallet-Connect'}
          showOnTop={false}
          containerStyles={{
            width: '30rem',
            fontSize: '3rem',
          }}
          buttonStyles={{
            borderRadius: '1.2rem',
            fontSize: '1.6rem',
            textTransform: 'capitalize',
          }}
        />
      </RowContainer>
    </RowContainer>
  )
}

export default ConnectWallet
