import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import stakingMockImage from '@icons/stakingMock.png'
import React from 'react'

export const StakingMock = () => {
  return (
    <RowContainer height={'100%'}>
      <img src={stakingMockImage} width={'60%'} height={'auto'} />
    </RowContainer>
  )
}
