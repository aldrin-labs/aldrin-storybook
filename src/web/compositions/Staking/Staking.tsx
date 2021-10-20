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

const Staking = ({ theme }: { theme: Theme }) => {
  const isMobile = useMobileSize()
  const isPriceIncreasing = true
  const [isBalancesShowing, setIsBalancesShowing] = useState(true)
  return (
    <Container isMobile={isMobile}>
      <RowContainer
        direction={isMobile ? 'column' : 'row'}
        height={isMobile ? 'auto' : '65%'}
        justify={'space-between'}
      >
        <StakingComponent
          theme={theme}
          isMobile={isMobile}
          isBalancesShowing={isBalancesShowing}
        />
        <StatsComponent
          isPriceIncreasing={isPriceIncreasing}
          theme={theme}
          isMobile={isMobile}
        />
      </RowContainer>
      <BlockWithHints theme={theme} isMobile={isMobile} />
    </Container>
  )
}

const Wrapper = compose(withTheme())(Staking)

export { Wrapper as Staking }
