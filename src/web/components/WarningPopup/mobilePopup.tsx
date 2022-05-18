import { Theme } from '@material-ui/core'
import useMobileSize from '@webhooks/useMobileSize'
import React, { useState } from 'react'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { useLocalStorageState } from '@sb/dexUtils/utils'

import {
  BlackButton,
  Container,
  DemiText,
  Text,
} from '../TransactionsConfirmationWarningPopup/TransactionsConfirmationWarningPopup.styles'

export const MobileBanner = ({
  theme,
  localStorageProperty = '',
  title = 'Important note!',
  notification = [''],
}: {
  theme: Theme
  localStorageProperty: string
  title: string
  notification: string[]
}) => {
  const [isPopupTemporaryHidden, setIsPopupTemporaryHidden] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useLocalStorageState(
    localStorageProperty,
    true
  )
  const isMobile = useMobileSize()

  if (!isMobile || !isPopupOpen || isPopupTemporaryHidden) return null

  const onClose = () => setIsPopupOpen(false)

  return (
    <Container showOnTheBottom direction="column" padding="6rem 4rem">
      <RowContainer justify="space-between" margin="0 0 4rem 0">
        <Row width="80%" direction="column" align="flex-start">
          <DemiText theme={theme} style={{ margin: '0 0 4rem 0' }}>
            {title}
          </DemiText>
          <Text theme={theme}>{notification.join()}</Text>
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
