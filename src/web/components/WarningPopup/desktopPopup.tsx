import React, { useState } from 'react'
import { Theme } from '@material-ui/core'

import { useLocalStorageState } from '@sb/dexUtils/utils'
import useMobileSize from '@webhooks/useMobileSize'

import {
  Container,
  Text,
  DemiText,
  BlackButton,
} from '../TransactionsConfirmationWarningPopup/TransactionsConfirmationWarningPopup.styles'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import DarkLogo from '@icons/DarkLogo.svg'
import SvgIcon from '../SvgIcon'

export const ChartsIssuePopup = ({ theme }: { theme: Theme }) => {
  const [isPopupTemporaryHidden, setIsPopupTemporaryHidden] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useLocalStorageState(
    'isChartsIssueBannerOpen',
    true
  )
  const isMobile = useMobileSize()

  if (isMobile || !isPopupOpen || isPopupTemporaryHidden) return null

  const onClose = () => setIsPopupOpen(false)

  return (
    <Container
      showOnTheTop={true}
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
            fontSize: '4.5rem',
            textAlign: 'left',
            fontFamily: 'Avenir Next Bold',
          }}
        >
          Important note!
        </DemiText>
      </RowContainer>
      <RowContainer height="40%" align="flex-start" justify="space-between">
        <Row
          width="60%"
          direction={'column'}
          justify="space-between"
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
            We’re doing an upgrade which will impact our charts temporarily.
            Trading is not impacted by this but we encourage to trade once
            charts are fully functional.
          </Text>
        </Row>
        <Row width={'40%'} height={'100%'}>
          <SvgIcon width={'13rem'} height={'auto'} src={DarkLogo} />
        </Row>
      </RowContainer>
      <Row
        justify="space-between"
        style={{ flexWrap: 'nowrap' }}
      >
        <BlackButton
          disabled={false}
          theme={theme}
          hoverBackground={'#20292d'}
          width={'auto'}
          fontSize={'1.5rem'}
          style={{ padding: '1rem 5rem', margin: '0 2rem 0 0' }}
          onClick={onClose}
        >
          Never show again.
        </BlackButton>
        <BlackButton
          disabled={false}
          theme={theme}
          hoverBackground={'#20292d'}
          width={'auto'}
          fontSize={'1.5rem'}
          style={{ padding: '1rem 5rem' }}
          onClick={() => setIsPopupTemporaryHidden(true)}
        >
          Ok.
        </BlackButton>
      </Row>
    </Container>
  )
}
