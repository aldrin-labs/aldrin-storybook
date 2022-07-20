import React from 'react'

import { InlineText } from '@sb/components/Typography'

import {
  LinkToTwitter,
  LinkToDiscord,
  LinkToCoinMarketcap,
} from '../../Socials'
import { TokenIconsContainer } from '../../TokenIconsContainer'
import { Header, Row } from '../index.styles'

export const HeaderComponent = () => {
  return (
    <Header>
      <Row>
        <TokenIconsContainer />
        <InlineText size="xmd" weight={600} color="gray0">
          RIN/USDC
        </InlineText>
      </Row>
      <Row width="36%">
        <LinkToTwitter height="40px" />
        <LinkToDiscord height="40px" />
        <LinkToCoinMarketcap height="40px" />
        <LinkToTwitter height="40px" />
        {/* TODO: last button should be replaced with Esc when swaps merged */}
      </Row>
    </Header>
  )
}
