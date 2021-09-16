import React, { ReactChild } from 'react'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { LoadingWithHint } from '@sb/compositions/Rebalance/components/RebalancePopup/LoadingWithHint'

export const LoadingScreenWithHint = ({
  loadingText,
}: {
  loadingText?: ReactChild
}) => {
  return (
    <RowContainer height="100%">
      <Row width="50%" justify="center">
        <LoadingWithHint
          loadingText={loadingText}
          loaderSize={'16rem'}
          loaderTextStyles={{
            fontFamily: 'Avenir Next Demi',
            fontSize: '2rem',
          }}
          hintTextStyles={{ justifyContent: 'flex-start' }}
        />
      </Row>
    </RowContainer>
  )
}
