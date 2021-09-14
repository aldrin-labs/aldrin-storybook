import React from 'react'

import ConnectWalletDropdown from '@sb/components/ConnectWalletDropdown'
import { SvgIcon } from '@sb/components'
import {
  RowContainer,
  Title,
} from '@sb/compositions/AnalyticsRoute/index.styles'

import { Theme } from '@material-ui/core'

import DarkLogo from '@icons/DarkLogo.svg'

const ConnectWallet = ({ theme }: { theme: Theme }) => {
  return (
    <RowContainer direction="column" height={'100%'}>
      <RowContainer>
        <SvgIcon src={DarkLogo} />
      </RowContainer>
      <RowContainer>
        <Title color={theme.palette.white.main}>Connect wallet to begin.</Title>
      </RowContainer>
      <RowContainer>
        <ConnectWalletDropdown
          height={'6rem'}
          theme={theme}
          id={'Dashboard-Wallet-Connect'}
          showOnTop={true}
          containerStyles={{
            width: '30rem',
            fontSize: '3rem'
          }}
          buttonStyles={{
            borderRadius: '1.2rem',
            fontSize: '1.6rem',
            textTransform: 'capitalize'
          }}
        />
      </RowContainer>
    </RowContainer>
  )
}

export default ConnectWallet
