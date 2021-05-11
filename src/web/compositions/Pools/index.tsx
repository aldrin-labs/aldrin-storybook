import React from 'react'
import { compose } from 'recompose'
import { withTheme, Theme } from '@material-ui/core'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import { BlockTemplate } from './index.styles'
import { TotalVolumeLockedChart } from './components/Charts'

const Pools = ({ theme }: {theme: Theme }) => {
  return (
    <RowContainer direction={'column'} padding={'5rem 15rem'}>
      <RowContainer justify={'space-between'}>
        <BlockTemplate theme={theme} width={'calc(50% - 1rem)'} height={'30rem'}>
          <TotalVolumeLockedChart
            theme={theme}
          />
        </BlockTemplate>
        <BlockTemplate theme={theme} width={'calc(50% - 1rem)'} height={'30rem'}>
          f
        </BlockTemplate>
      </RowContainer>
      <RowContainer>
        <BlockTemplate
          theme={theme}
          width={'100%'}
          height={'45rem'}
          style={{ marginTop: '2rem' }}
        >
          f
        </BlockTemplate>
      </RowContainer>
    </RowContainer>
  )
}

const Wrapper = compose(withTheme())(Pools)

export { Wrapper as PoolsComponent }
