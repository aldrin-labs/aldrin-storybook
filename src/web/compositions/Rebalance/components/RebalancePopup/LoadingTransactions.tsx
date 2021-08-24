import React from 'react'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { Text } from '@sb/compositions/Addressbook/index'
import { HintQuoteBlock } from '@sb/components/HintQuoteBlock/HintQuoteBlock'

import LoadingLogo from '@icons/logo_loader.webp'

export const LoadingTransactions = () => (
  <RowContainer
    padding={'0 0 1rem 0'}
    direction={'column'}
    style={{ borderBottom: '.1rem solid #383B45' }}
  >
    <RowContainer padding={'3rem 2rem'} direction={'column'}>
      <img src={LoadingLogo} style={{ width: '9rem', height: '9rem' }} />
      <Text padding={'2rem 0 0 0'}>
        Your transactions are being processed. It may take up to 30 seconds.
      </Text>
    </RowContainer>
    <RowContainer
      padding={'0 6.5rem 1rem 6.5rem'}
      style={{ borderTop: '.1rem solid #383B45' }}
    >
      <HintQuoteBlock />
    </RowContainer>
  </RowContainer>
)
