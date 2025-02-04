import { Theme } from '@material-ui/core'
import useMobileSize from '@webhooks/useMobileSize'
import React, { useState } from 'react'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { useLocalStorageState } from '@sb/dexUtils/utils'

import {
  Container,
  Text,
  DemiText,
  BlackButton,
} from '../TransactionsConfirmationWarningPopup/TransactionsConfirmationWarningPopup.styles'

export const MobileSerumIssueWarningPopup = ({ theme }: { theme: Theme }) => {
  const [isPopupTemporaryHidden, setIsPopupTemporaryHidden] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useLocalStorageState(
    'isSerumIssueWarningPopupOpen',
    true
  )
  const isMobile = useMobileSize()

  if (!isMobile || !isPopupOpen || isPopupTemporaryHidden) return null

  const onClose = () => setIsPopupOpen(false)

  return (
    <Container showOnTheBottom direction="column" padding="6rem 4rem">
      <RowContainer justify="space-between" margin="0 0 4rem 0">
        <Row width="80%" direction="column">
          <DemiText theme={theme} style={{ margin: '0 0 4rem 0' }}>
            Serum ecosystem is experiencing problems with settling the balance
            after limit orders.
          </DemiText>
          <Text theme={theme}>
            We recommend refraining from trading until you are notified that
            everything is back to normal. In addition, you will be able to
            settle your funds after the announcement.
          </Text>
        </Row>
        <Row>
          <DemiText style={{ fontSize: '14rem' }}>!</DemiText>
        </Row>
      </RowContainer>
      <RowContainer justify="space-between" style={{ marginBottom: '2rem' }}>
        <BlackButton
          disabled={false}
          hoverBackground="#20292d"
          onClick={onClose}
        >
          Never show again.
        </BlackButton>
        <BlackButton
          disabled={false}
          hoverBackground="#20292d"
          onClick={() => setIsPopupTemporaryHidden(true)}
        >
          Ok.
        </BlackButton>
      </RowContainer>
    </Container>
  )
}
