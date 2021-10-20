import { withTheme } from '@material-ui/core'
import { Theme } from '@sb/types/materialUI'
import useMobileSize from '@webhooks/useMobileSize'
import React, { useState } from 'react'
import { compose } from 'recompose'
import { Content, Page } from '../../components/Layout'
import { StakingComponent } from './components/StakingComponent'


const Staking = ({ theme }: { theme: Theme }) => {
  const isMobile = useMobileSize()
  const isPriceIncreasing = true
  const [isBalancesShowing, setIsBalancesShowing] = useState(true)
  return (
    <Page>
      <Content>
        <StakingComponent
          theme={theme}
          isMobile={isMobile}
          isBalancesShowing={isBalancesShowing}
        />
        {/* <RowContainer
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
        <BlockWithHints theme={theme} isMobile={isMobile} /> */}
      </Content>
    </Page>
  )
}

const Wrapper = compose(withTheme())(Staking)

export { Wrapper as Staking }
