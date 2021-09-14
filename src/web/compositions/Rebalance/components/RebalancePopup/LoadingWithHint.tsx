import React, { CSSProperties } from 'react'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { Text } from '@sb/compositions/Addressbook/index'
import { HintQuoteBlock } from '@sb/components/HintQuoteBlock/HintQuoteBlock'

import LoadingLogo from '@icons/logo_loader.webp'

export const LoadingWithHint = ({
  loaderSize = '9rem',
  text = 'Loading...',
  loaderTextStyles = {},
  hintTextStyles = {},
}: {
  loaderSize?: string
  text?: string
  loaderTextStyles?: CSSProperties
  hintTextStyles?: CSSProperties
}) => (
  <RowContainer
    padding={'0 0 1rem 0'}
    direction={'column'}
    style={{ borderBottom: '.1rem solid #383B45' }}
  >
    <RowContainer padding={'3rem 2rem'} direction={'column'}>
      <img
        src={LoadingLogo}
        style={{ width: loaderSize, height: loaderSize }}
      />
      <Text padding={'2rem 0 0 0'} style={{ ...loaderTextStyles }}>
        {text}
      </Text>
    </RowContainer>
    <RowContainer
      padding={'0 6.5rem 1rem 6.5rem'}
      style={{ borderTop: '.1rem solid #383B45' }}
    >
      <HintQuoteBlock hintTextStyles={hintTextStyles} />
    </RowContainer>
  </RowContainer>
)
