import React from 'react'

import { EscapeButton } from '@sb/components/EscapeButton'
import { InlineText } from '@sb/components/Typography'

import {
  LinkToTwitter,
  LinkToDiscord,
  LinkToCoinMarketcap,
} from '../../Socials'
import { TokenIconsContainer } from '../../TokenIconsContainer'
import { Header, Row } from '../index.styles'

export const HeaderComponent = ({
  token,
  close,
  arrow,
}: {
  token: string
  close: () => void
  arrow: boolean
}) => {
  return (
    <Header>
      <Row>
        <TokenIconsContainer />
        <InlineText size="xmd" weight={600} color="gray0">
          {token} Staking
        </InlineText>
      </Row>
      <Row width="36%">
        <LinkToTwitter height="40px" />
        <LinkToDiscord height="40px" />
        <LinkToCoinMarketcap height="40px" />
        <EscapeButton arrow={arrow} size="2.5" close={() => close()} />
        {/* TODO: last button should be replaced with Esc when swaps merged */}
      </Row>
    </Header>
  )
}
