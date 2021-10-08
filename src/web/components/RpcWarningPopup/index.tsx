import React, { useState } from 'react'
import { Theme } from '@material-ui/core'

import { useLocalStorageState } from '@sb/dexUtils/utils'
import useMobileSize from '@webhooks/useMobileSize'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import DarkLogo from '@icons/DarkLogo.svg'
import {
  Container,
  Text,
  DemiText,
  BlackButton,
} from '../TransactionsConfirmationWarningPopup/TransactionsConfirmationWarningPopup.styles'
import SvgIcon from '../SvgIcon'

export const RpcCapacityWarningPopup = ({ theme }: { theme: Theme }) => {
  const [isPopupTemporaryHidden, setIsPopupTemporaryHidden] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useLocalStorageState(
    'isRpcProblemWarningPopupOpen',
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
            fontSize: '4.5rem',
            textAlign: 'left',
            fontFamily: 'Avenir Next Bold',
          }}
        >
          Solana Cluster Unstable{' '}
        </DemiText>
      </RowContainer>
      <RowContainer height="40%" align="flex-start" justify="space-between">
        <Row
          width="60%"
          direction="column"
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
            The mainnet-beta cluster is experiencing some instability at the
            moment.
          </Text>
          <Text
            style={{
              lineHeight: '3rem',
              marginBottom: '1rem',
              fontSize: '1.8rem',
            }}
            theme={theme}
          >
            This can be the reason for the failure of trading, settling and
            transaction processing.
          </Text>
          <Text
            style={{
              lineHeight: '3rem',
              marginBottom: '1rem',
              fontSize: '1.8rem',
            }}
            theme={theme}
          >
            Team are aware of the problem and currently looking into it.{' '}
          </Text>
          <Text
            style={{
              lineHeight: '3rem',
              fontSize: '1.8rem',
            }}
            theme={theme}
          >
            Learn More:{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://status.solana.com/"
              style={{
                fontFamily: 'Avenir Next Bold',
                textDecoration: 'none',
                color: '#000',
              }}
            >
              https://status.solana.com/
            </a>
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
          theme={theme}
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
          theme={theme}
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
