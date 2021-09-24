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

export const AldrinIsOverCapacityPopup = ({ theme }: { theme: Theme }) => {
  const [isPopupTemporaryHidden, setIsPopupTemporaryHidden] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useLocalStorageState(
    'isRpcWarningPopupOpen',
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
      <RowContainer align="flex-start" justify="space-between">
        <Row
          width="60%"
          direction={'column'}
          justify="flex-start"
          align="flex-start"
        >
          <DemiText
            theme={theme}
            style={{
              lineHeight: '4rem',
              marginBottom: '3rem',
              fontSize: '1.8rem',
              textAlign: 'left',
            }}
          >
            Aldrin is at over capacity.{' '}
          </DemiText>
          <Text
            style={{
              lineHeight: '3rem',
              marginBottom: '1rem',
              fontSize: '1.8rem',
            }}
            theme={theme}
          >
            We’re having some issues and team is working on it right now. We’re
            having a spike in users and getting our RPC capacity increased as
            well.
          </Text>
          <Text
            style={{
              lineHeight: '3rem',
              marginBottom: '1rem',
              fontSize: '1.8rem',
            }}
            theme={theme}
          >
            In the next 2-3 days all should smooth out for a lot more users.
          </Text>
          <Text
            style={{
              lineHeight: '3rem',
              marginBottom: '1rem',
              fontSize: '1.8rem',
            }}
            theme={theme}
          >
            We know this is frustrating for everyone and the last thing we want
            our users to be experiencing but these issues will get fixed really
            soon.
          </Text>
          <Text
            style={{
              lineHeight: '3rem',
              marginTop: '2rem',
              fontSize: '1.8rem',
            }}
            theme={theme}
          >
            The biggest positive from all of this is that Aldrin is growing and
            once we’re stable it is going to be exciting times ahead.
          </Text>
        </Row>
        <Row width={'40%'} height={'100%'}>
          <SvgIcon width={'13rem'} height={'auto'} src={DarkLogo} />
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
