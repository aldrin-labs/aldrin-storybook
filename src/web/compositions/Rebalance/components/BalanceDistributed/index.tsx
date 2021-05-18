import React from 'react'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { Text } from '@sb/compositions/Addressbook/index'
import { BlockTemplate } from '@sb/compositions/Pools/index.styles'
import { TokenAllocationProgressBar } from '@sb/components/AllocationBlock/Legend/index.styles'

const BalanceDistributedComponent = ({ theme }) => {
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
          100%
        </Text>
      </RowContainer>
      <TokenAllocationProgressBar
        color={'#A5E898'}
        height={'2.2rem'}
        width={'80%'}
        variant="determinate"
        value={0}
      />
    </BlockTemplate>
  )
}

export default BalanceDistributedComponent
