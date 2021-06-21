import React from 'react'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { Text } from '@sb/compositions/Addressbook/index'
import { BlockTemplate } from '@sb/compositions/Pools/index.styles'
import {
  TokenAllocationProgressBar,
  TokenAllocationProgressBarContainer,
} from '@sb/components/AllocationBlock/Legend/index.styles'
import { Theme } from '@material-ui/core'

const BalanceDistributedComponent = ({
  theme,
  leftToDistributeValue = 0,
  totalTokensValue,
}: {
  theme: Theme,
  leftToDistributeValue: number,
  totalTokensValue: number,
}) => {
  // This condition handling case when loading the data from backend
  const distributedPercentage = totalTokensValue === 0 ? 100 : (
    100 -
    (leftToDistributeValue * 100) / totalTokensValue
  ).toFixed(2)

  return (
    <BlockTemplate
      direction={'column'}
      width={'100%'}
      height={'100%'}
      theme={theme}
      justify={'space-around'}
    >
      <RowContainer align={'flex-end'} style={{ flexWrap: 'nowrap' }}>
        <Text color={'#93A0B2'}>Balance Distributed:</Text>&nbsp; &nbsp;
        <Text fontSize={'1.7rem'} fontFamily={'Avenir Next Bold'}>
          {distributedPercentage}%
        </Text>
      </RowContainer>{' '}
      <TokenAllocationProgressBarContainer width={'80%'} justify={'flex-start'}>
        {' '}
        <TokenAllocationProgressBar
          color={'#A5E898'}
          height={'2.2rem'}
          width={`${distributedPercentage}%`}
          variant="determinate"
          value={0}
        />
      </TokenAllocationProgressBarContainer>
    </BlockTemplate>
  )
}

export default BalanceDistributedComponent
