import React from 'react'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import stakingMockImage from '@icons/stakingMock.png'

export const StakingMock = () => {
  return (
    <RowContainer height="100%">
      <img src={stakingMockImage} width="60%" height="auto" />
    </RowContainer>
  )
}
