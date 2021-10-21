import { withTheme } from '@material-ui/core'
import { Theme } from '@sb/types/materialUI'
import useMobileSize from '@webhooks/useMobileSize'
import React, { useState } from 'react'
import { compose } from 'recompose'
import { Content, Page } from '../../components/Layout'
import { StakingComponent } from './components/StakingComponent'
import StatsComponent from './components/StatsComponent'
import { useWallet } from '@sb/dexUtils/wallet'
import { ConnectWalletScreen } from '@sb/components/ConnectWalletScreen/ConnectWalletScreen'
import { RowContainer } from '../AnalyticsRoute/index.styles'
import { BlockWithHints } from './components/BlockWithHints'

const Staking = ({ theme }: { theme: Theme }) => {
  const { wallet } = useWallet()
  const isMobile = useMobileSize()
  const isWalletConnected = wallet.connected

  return (
    <>
      {!isWalletConnected ? (
        <ConnectWalletScreen theme={theme} />
      ) : (
        <Page>
          <Content>
            <StakingComponent />
            {/* <RowContainer
              direction={isMobile ? 'column' : 'row'}
              height={isMobile ? 'auto' : '65%'}
              justify={'space-between'}
            >
              <StakingComponent theme={theme} isMobile={isMobile} />
              <StatsComponent theme={theme} isMobile={isMobile} />
            </RowContainer>
            <BlockWithHints theme={theme} isMobile={isMobile} /> */}
          </Content>
        </Page>
      )}
    </>
  )
}

const Wrapper = compose(withTheme())(Staking)

export { Wrapper as Staking }
