import React, { ReactChild } from 'react'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { LoadingWithHint } from '@sb/compositions/Rebalance/components/RebalancePopup/LoadingWithHint'
import { LoadingScreenWithHintContainer } from './LoadingScreenWithHint.styles'

export const LoadingScreenWithHint = ({
  loadingText,
}: {
  loadingText?: string | ReactChild
}) => {
  return (
    <RowContainer
      height="100%"
      style={{ background: theme.palette.grey.additional }}
    >
      <LoadingScreenWithHintContainer justify="center">
        <LoadingWithHint
          loadingText={loadingText}
          loaderSize={'16rem'}
          loaderTextStyles={{
            fontFamily: 'Avenir Next Demi',
            fontSize: '2rem',
          }}
          hintTextStyles={{ justifyContent: 'flex-start' }}
        />
      </LoadingScreenWithHintContainer>
    </RowContainer>
  )
}
