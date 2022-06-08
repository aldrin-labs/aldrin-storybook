import useMobileSize from '@webhooks/useMobileSize'
import React, { useState } from 'react'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { useLocalStorageState } from '@sb/dexUtils/utils'

import DarkLogo from '@icons/DarkLogo.svg'

import SvgIcon from '../SvgIcon'
import {
  Container,
  Text,
  DemiText,
  BlackButton,
} from '../TransactionsConfirmationWarningPopup/TransactionsConfirmationWarningPopup.styles'

export const DesktopBanner = ({
  localStorageProperty = '',
  title = 'Important note!',
  notification = [''],
}: {
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

  if (isMobile || !isPopupOpen || isPopupTemporaryHidden) return null

  const onClose = () => setIsPopupOpen(false)

  return (
    <Container
      showOnTheTop
      style={{ height: '64%', flexWrap: 'nowrap', zIndex: '100' }}
      direction="column"
      align="flex-start"
      justify="space-between"
      padding="6rem 4rem"
    >
      <RowContainer justify="space-between" style={{ position: 'relative' }}>
        <DemiText
          style={{
            lineHeight: '4rem',
            fontSize: '4.5rem',
            textAlign: 'left',
            fontFamily: 'Avenir Next Bold',
          }}
        >
          {title}
        </DemiText>
      </RowContainer>
      <RowContainer height="40%" align="flex-start" justify="space-between">
        <Row
          width="60%"
          direction="column"
          justify="flex-start"
          align="flex-start"
          height="100%"
        >
          {notification.map((el) => (
            <Text
              style={{
                lineHeight: '3rem',
                marginBottom: '3rem',
                fontSize: '1.8rem',
              }}
            >
              {el}
            </Text>
          ))}
        </Row>
        <Row width="40%" height="100%">
          <SvgIcon width="13rem" height="auto" src={DarkLogo} />
        </Row>
      </RowContainer>
      <Row justify="space-between" style={{ flexWrap: 'nowrap' }}>
        <BlackButton
          disabled={false}
          hoverBackground="#20292d"
          width="auto"
          fontSize="1.5rem"
          style={{ padding: '1rem 5rem', margin: '0 2rem 0 0' }}
          onClick={onClose}
        >
          Never show again.
        </BlackButton>
        <BlackButton
          disabled={false}
          hoverBackground="#20292d"
          width="auto"
          fontSize="1.5rem"
          style={{ padding: '1rem 5rem' }}
          onClick={() => setIsPopupTemporaryHidden(true)}
        >
          Ok.
        </BlackButton>
      </Row>
    </Container>
  )
}
