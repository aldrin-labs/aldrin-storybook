import React, { useState } from 'react'
import { Theme } from '@material-ui/core'

import { useLocalStorageState } from '@sb/dexUtils/utils'
import useMobileSize from '@webhooks/useMobileSize'

import {
  Container,
  Text,
  DemiText,
  BlackButton,
} from './TransactionsConfirmationWarningPopup.styles'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

export const TransactionsConfirmationWarningPopup = ({
  theme,
}: {
  theme: Theme
}) => {
  const [isPopupTemporaryHidden, setIsPopupTemporaryHidden] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useLocalStorageState(
    'isTransactionsConfirmationWarningPopupOpen',
    true
  )
  const isMobile = useMobileSize()

  if (!isMobile || !isPopupOpen || isPopupTemporaryHidden) return null

  const onClose = () => setIsPopupOpen(false)

  return (
    <Container showOnTheBottom={true} direction="column" padding="6rem 4rem">
      <RowContainer justify="space-between" margin="0 0 4rem 0">
        <Row width="80%" direction={'column'}>
          <DemiText theme={theme} style={{ margin: '0 0 4rem 0' }}>
            Transaction confirmation pop-ups in the wallet may not work
            correctly.
          </DemiText>
          <Text theme={theme}>
            Enable auto-confirmation of transactions when connecting the wallet
            or switch between tabs manually for manual confirmation.{' '}
          </Text>
        </Row>
        <Row>
          <DemiText style={{ fontSize: '14rem' }}>!</DemiText>
        </Row>
      </RowContainer>
      <RowContainer justify="space-between" style={{ marginBottom: '2rem' }}>
        <BlackButton
          disabled={false}
          theme={theme}
          hoverBackground={'#20292d'}
          onClick={onClose}
        >
          Ok, never show again.
        </BlackButton>
        <BlackButton
          disabled={false}
          theme={theme}
          hoverBackground={'#20292d'}
          onClick={() => setIsPopupTemporaryHidden(true)}
        >
          Ok.
        </BlackButton>
      </RowContainer>
    </Container>
  )
}
