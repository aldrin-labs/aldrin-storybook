import useMobileSize from '@webhooks/useMobileSize'
import React from 'react'
import styled from 'styled-components'

import RedPlanetImg from '@sb/images/red_planet.png'

import { Row, RowContainer } from '../AnalyticsRoute/index.styles'
import {
  LinkToDiscord,
  LinkToTelegram,
  LinkToTwitter,
} from '../Homepage/SocialsLinksComponents'

const MainTitle = styled.h2`
  font-size: 2.4rem;
  font-family: Avenir Next Demi;
  color: ${(props) => props.theme.colors.gray0};
`

const Text = styled.span`
  font-size: 1.4rem;
  font-family: Avenir Next;
  color: ${(props) => props.theme.colors.gray0};
`

const Link = styled.a`
  font-size: 1.4rem;
  font-family: Avenir Next;
  color: ${(props) => props.theme.colors.blue5};
`

const RestrictedRegion = () => {
  const isMobile = useMobileSize()
  return (
    <RowContainer direction="column" height="100%">
      <RowContainer margin="0 0 6rem 0">
        <img src={RedPlanetImg} alt="Red Planet" />
      </RowContainer>
      <RowContainer margin="0 0 2rem 0">
        <MainTitle>
          Sorry, Aldrin.com is not available in your country.
        </MainTitle>
      </RowContainer>
      <RowContainer direction="column" margin="0 0 4rem 0">
        <Text>Aldrin.com doesn't offer its services in your region.</Text>
      </RowContainer>
      <RowContainer margin="0 0 2rem 0">
        <Text>
          If you think your access is restricted by mistake or have another
          question, please contact us via:
        </Text>
      </RowContainer>
      <Row justify="space-between" width={isMobile ? '75%' : '30%'}>
        <Link href="mailto:contact@aldrin.com" style={{ marginRight: '16px' }}>
          contact@aldrin.com
        </Link>
        <Text>or</Text>
        <Row width="30%" justify="space-between">
          <LinkToTwitter />
          <LinkToTelegram />
          <LinkToDiscord />
        </Row>
      </Row>
    </RowContainer>
  )
}

export default RestrictedRegion
