import React from 'react'
import { compose } from 'recompose'
import { withTheme, Theme } from '@material-ui/core'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BlockTemplate } from './index.styles'
import { TotalVolumeLockedChart } from './components/Charts'
import { UserLiquitidyTable } from './components/Tables/UserLiquidity'

const Pools = ({ theme }: { theme: Theme }) => {
  return (
    <RowContainer direction={'column'} padding={'2rem 15rem'}>
      <RowContainer justify={'space-between'}>
        <BlockTemplate
          theme={theme}
          width={'calc(50% - 1rem)'}
          height={'30rem'}
        >
          <TotalVolumeLockedChart theme={theme} />
        </BlockTemplate>
        <BlockTemplate
          theme={theme}
          width={'calc(50% - 1rem)'}
          height={'30rem'}
        >
          f
        </BlockTemplate>
      </RowContainer>
      <UserLiquitidyTable theme={theme} />
    </RowContainer>
  )
}
const Wrapper = compose(withTheme())(Pools)
export { Wrapper as PoolsComponent }
