import { Theme } from '@material-ui/core'
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

export const SerumIssuesWarningPopup = ({ theme }: { theme: Theme }) => {
  const [isPopupTemporaryHidden, setIsPopupTemporaryHidden] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useLocalStorageState(
    'isSerumIssueWarningPopupOpen',
    true
  )
  const isMobile = useMobileSize()

  if (isMobile || !isPopupOpen || isPopupTemporaryHidden) return null

  const onClose = () => setIsPopupOpen(false)

  return (
    <Container
      showOnTheTop
      style={{ height: '64%', flexWrap: 'nowrap' }}
      direction="column"
      align="flex-start"
      justify="space-between"
      padding="6rem 4rem"
    >
      <RowContainer justify="space-between" style={{ position: 'relative' }}>
        <DemiText
          theme={theme}
          style={{
            lineHeight: '4rem',
            fontSize: '3rem',
            textAlign: 'left',
            fontFamily: 'Avenir Next Bold',
          }}
        >
          Serum ecosystem is experiencing problems with settling the balance
          after limit orders.{' '}
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
          <Text
            style={{
              lineHeight: '3rem',
              marginBottom: '1rem',
              fontSize: '1.8rem',
            }}
            theme={theme}
          >
            We recommend refraining from trading until you are notified that
            everything is back to normal.
          </Text>
          <Text
            style={{
              lineHeight: '3rem',
              marginBottom: '1rem',
              fontSize: '1.8rem',
            }}
            theme={theme}
          >
            In addition, you will be able to settle your funds after the
            announcement.
          </Text>
        </Row>
        <Row width="40%" height="100%">
          <SvgIcon width="13rem" height="auto" src={DarkLogo} />
        </Row>
      </RowContainer>
      <Row
        // width={'25%'}
        justify="space-between"
        style={{ flexWrap: 'nowrap' }}
      >
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
