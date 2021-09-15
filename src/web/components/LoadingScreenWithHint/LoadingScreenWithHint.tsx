import React from 'react'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { LoadingWithHint } from '@sb/compositions/Rebalance/components/RebalancePopup/LoadingWithHint'

export const LoadingScreenWithHint = () => {
  return (
    <RowContainer height="100%">
      <Row width="50%" justify="center">
        <LoadingWithHint
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
