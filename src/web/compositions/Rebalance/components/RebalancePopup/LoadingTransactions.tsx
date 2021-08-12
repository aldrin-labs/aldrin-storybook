import React from 'react'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { Text } from '@sb/compositions/Addressbook/index'
import { Loading } from '@sb/components'
import LoadingLogo from '@icons/logo_loader.webp'

export const LoadingTransactions = () => (
  <RowContainer padding={'9rem 0'} direction={'column'}>
    <img src={LoadingLogo} style={{ width: '9rem', height: '9rem' }} />
    <Text padding={'2rem 0 0 0'}>
      Your transactions are being processed. It may take up to 30 seconds.
    </Text>
  </RowContainer>
)
