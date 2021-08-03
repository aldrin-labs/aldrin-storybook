import React from 'react'
import styled from 'styled-components'
import { Row, RowContainer } from '../AnalyticsRoute/index.styles'

import RedPlanetImg from '@sb/images/red_planet.png'
import { withTheme, Theme } from '@material-ui/core'
import {
  DiscordLink,
  TelegramLink,
  TwitterLink,
} from '../Homepage/SocialsLinksComponents'

const MainTitle = styled.h2`
  font-size: 2.4rem;
  font-family: Avenir Next Demi;
  color: ${(props) => props.theme.palette.white.text};
`

const Text = styled.span`
  font-size: 1.4rem;
  font-family: Avenir Next;
  color: ${(props) => props.theme.palette.white.text};
`

const Link = styled.a`
  font-size: 1.4rem;
  font-family: Avenir Next;
  color: ${(props) => props.theme.palette.blue.serum};
`

const RestrictedRegion = ({ theme }: { theme: Theme }) => {
  return (
    <RowContainer direction="column" height="100%">
      <RowContainer margin="0 0 6rem 0">
        <img src={RedPlanetImg} alt="Red Planet" />
      </RowContainer>
      <RowContainer margin="0 0 2rem 0">
        <MainTitle theme={theme}>
          Sorry, Cryptocurrencies.Ai is not available in your country.
        </MainTitle>
      </RowContainer>
      <RowContainer direction="column" margin="0 0 4rem 0">
        <Text theme={theme}>
          Cryptocurrencies.Ai doesn't offer its services in your region.
        </Text>
      </RowContainer>
      <RowContainer margin="0 0 2rem 0">
        <Text theme={theme}>
          If you think your access is restricted by mistake or have another
          question, please contact us via:
        </Text>
      </RowContainer>
      <Row justify="space-between" width="30%">
        <Link
          theme={theme}
          href="mailto:contact@cryptocurrencies.ai"
          style={{ marginRight: '16px' }}
        >
          contact@cryptocurrencies.ai
        </Link>
        <Text theme={theme}>or</Text>
        <Row>
          <TwitterLink />
          <TelegramLink />
          <DiscordLink />
        </Row>
      </Row>
    </RowContainer>
  )
}

export default withTheme()(RestrictedRegion)
