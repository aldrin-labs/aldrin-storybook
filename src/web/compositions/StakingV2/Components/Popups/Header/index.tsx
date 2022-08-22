import React from 'react'

import { EscapeButton } from '@sb/components/EscapeButton'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { getTokenMintAddressByName } from '@sb/dexUtils/markets'

import {
  LinkToTwitter,
  LinkToDiscord,
  LinkToCoinMarketcap,
} from '../../Socials'
import { Header, Row } from '../index.styles'

export const HeaderComponent = ({
  token,
  close,
  arrow,
}: {
  token: string
  close: () => void
  arrow?: boolean
}) => {
  return (
    <Header>
      <Row>
        <TokenIcon
          mint={getTokenMintAddressByName(`${token}`)}
          size={36}
          className="token-icon"
        />
        <InlineText size="xmd" weight={600} color="white2">
          {token} Staking
        </InlineText>
      </Row>
      <Row width="36%" className="links-row">
        <LinkToTwitter height="40px" />
        <LinkToDiscord height="40px" />
        <LinkToCoinMarketcap height="40px" />
        <EscapeButton arrow={arrow} size="2.5" onClose={() => close()} />
        {/* TODO: last button should be replaced with Esc when swaps merged */}
      </Row>
    </Header>
  )
}
