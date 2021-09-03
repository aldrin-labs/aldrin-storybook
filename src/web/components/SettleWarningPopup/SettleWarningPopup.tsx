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
import Arrow from '@icons/bigArrow.svg'
import SvgIcon from '../SvgIcon'

export const SettleWarningPopup = ({ theme }: { theme: Theme }) => {
  const [isPopupTemporaryHidden, setIsPopupTemporaryHidden] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useLocalStorageState(
    'isSettleWarningPopupOpen',
    true
  )
  const isMobile = useMobileSize()

  if (isMobile || !isPopupOpen || isPopupTemporaryHidden) return null

  const onClose = () => setIsPopupOpen(false)

  return (
    <Container
      showOnTheTop={true}
      style={{ height: '64%' }}
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
            marginBottom: '2rem',
            fontSize: '4.5rem',
            textAlign: 'left',
            fontFamily: 'Avenir Next Bold',
          }}
        >
          Important note!
        </DemiText>
        <Row style={{ position: 'absolute', right: '0' }}>
          <DemiText style={{ fontSize: '14rem', lineHeight: '11rem' }}>
            !
          </DemiText>
        </Row>{' '}
        <div
          style={{
            position: 'absolute',
            top: '7rem',
            width: '46%',
            right: '1.1%',
          }}
        >
          <SvgIcon src={Arrow} width={'100%'} height={'auto'} />
        </div>
      </RowContainer>
      <RowContainer align="flex-start" justify="space-between">
        <Row
          width="80%"
          direction={'column'}
          justify="flex-start"
          align="flex-start"
        >
          <DemiText
            theme={theme}
            style={{
              lineHeight: '4rem',
              marginBottom: '1rem',
              fontSize: '1.8rem',
              textAlign: 'left',
            }}
          >
            Do not forget to settle your funds after trade.
          </DemiText>
          <Text
            style={{
              lineHeight: '4rem',
              marginBottom: '1rem',
              fontSize: '1.8rem',
            }}
            theme={theme}
          >
            • Enable auto-confirmation of transactions when connecting the
            wallet or switch between tabs manually for manual confirmation.
          </Text>
          <Text
            style={{
              lineHeight: '4rem',
              marginBottom: '1rem',
              fontSize: '1.8rem',
            }}
            theme={theme}
          >
            • When trading with a market order, a settle transaction should
            occur automatically. However, do not close the page until you are
            sure that the settling has been successful and your balances have
            been updated.
          </Text>
          <Text
            style={{
              lineHeight: '4rem',
              marginBottom: '1rem',
              fontSize: '1.8rem',
            }}
            theme={theme}
          >
            • If you have enabled auto-confirmation of transactions when
            connecting the wallet, the settle transaction should also be
            automatic. Do not leave the page before updating balances and moving
            funds from 'Unsettled Balance' to 'Wallet Balance'
          </Text>
        </Row>
      </RowContainer>
      <Row
        // width={'25%'}
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
