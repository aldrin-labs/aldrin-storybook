import React, { useState } from 'react'
import { compose } from 'recompose'
import { withTheme } from '@material-ui/core'
import { Theme } from '@sb/types/materialUI'
import useMobileSize from '@webhooks/useMobileSize'

import { RowContainer } from '../AnalyticsRoute/index.styles'

import { Container } from './Staking.styles'

import { BlockWithHints } from './components/BlockWithHints'
import { StakingComponent } from './components/StakingComponent'
import { StatsComponent } from './components/StatsComponent'
import { useWallet } from '@sb/dexUtils/wallet'
import { ConnectWalletScreen } from '@sb/components/ConnectWalletScreen/ConnectWalletScreen'

const Staking = ({ theme }: { theme: Theme }) => {
  const { wallet } = useWallet()
  const isMobile = useMobileSize()
  const isPriceIncreasing = true
  const isWalletConnected = wallet.connected

  return (
    <>
      {!isWalletConnected ? (
        <ConnectWalletScreen theme={theme} />
      ) : (
        <Container isMobile={isMobile}>
          <RowContainer
            direction={isMobile ? 'column' : 'row'}
            height={isMobile ? 'auto' : '65%'}
            justify={'space-between'}
          >
            <StakingComponent theme={theme} isMobile={isMobile} />
            <StatsComponent
              isPriceIncreasing={isPriceIncreasing}
              theme={theme}
              isMobile={isMobile}
            />
          </RowContainer>
          <BlockWithHints theme={theme} isMobile={isMobile} />
        </Container>
      )}
    </>
  )
}

const Wrapper = compose(withTheme())(Staking)

export { Wrapper as Staking }
