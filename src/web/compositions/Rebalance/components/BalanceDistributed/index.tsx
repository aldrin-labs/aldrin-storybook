import { Theme } from '@material-ui/core'
import React from 'react'

import {
  TokenAllocationProgressBar,
  TokenAllocationProgressBarContainer,
} from '@sb/components/AllocationBlock/Legend/index.styles'
import { InlineText } from '@sb/components/Typography'
import { Text } from '@sb/compositions/Addressbook/index'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BlockTemplate } from '@sb/compositions/Pools/index.styles'

const BalanceDistributedComponent = ({
  theme,
  leftToDistributeValue = 0,
  totalTokensValue,
}: {
  theme: Theme
  leftToDistributeValue: number
  totalTokensValue: number
}) => {
  // This condition handling case when loading the data from backend
  const distributedPercentage =
    totalTokensValue === 0
      ? 100
      : (100 - (leftToDistributeValue * 100) / totalTokensValue).toFixed(2)

  return (
    <BlockTemplate
      direction="column"
      width="100%"
      height="100%"
      justify="space-around"
    >
      <RowContainer align="flex-end" style={{ flexWrap: 'nowrap' }}>
        <InlineText size="sm">Balance Distributed:</InlineText>&nbsp; &nbsp;
        <Text fontSize="1.7rem" fontFamily="Avenir Next Bold">
          {distributedPercentage}%
        </Text>
      </RowContainer>{' '}
      <TokenAllocationProgressBarContainer width="80%" justify="flex-start">
        {' '}
        <TokenAllocationProgressBar
          color="#53DF11"
          height="2.2rem"
          width={`${distributedPercentage}%`}
          variant="determinate"
          value={0}
        />
      </TokenAllocationProgressBarContainer>
    </BlockTemplate>
  )
}

export default BalanceDistributedComponent
