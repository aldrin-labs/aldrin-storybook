import React, { ReactChild } from 'react'
import { useTheme } from 'styled-components'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { LoadingWithHint } from '@sb/compositions/Rebalance/components/RebalancePopup/LoadingWithHint'

import { LoadingScreenWithHintContainer } from './LoadingScreenWithHint.styles'

export const LoadingScreenWithHint = ({
  loadingText,
}: {
  loadingText?: string | ReactChild
}) => {
  const theme = useTheme()
  return (
    <RowContainer height="100%" style={{ background: theme.colors.gray9 }}>
      <LoadingScreenWithHintContainer justify="center">
        <LoadingWithHint
          loadingText={loadingText}
          loaderSize="16rem"
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
