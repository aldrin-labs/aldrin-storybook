import React from 'react'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { Text } from '@sb/compositions/Addressbook/index'
import { Loading } from '@sb/components'

export const LoadingTransactions = () => (
  <RowContainer padding={'9rem 0'} direction={'column'}>
    <Loading size={'6rem'} />
    <Text padding={'2rem 0 0 0'}>
      Your transactions are being processing. It may take up to 30 seconds.
    </Text>
  </RowContainer>
)
