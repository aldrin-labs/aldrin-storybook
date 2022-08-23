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
  socials,
}: {
  token: string
  close: () => void
  socials: any // TODO
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
        <LinkToTwitter link={socials.twitter} height="40px" />
        <LinkToDiscord link={socials.discord} height="40px" />
        <LinkToCoinMarketcap link={socials.coinmarketcap} height="40px" />
        <EscapeButton size="2.5" onClose={() => close()} />
      </Row>
    </Header>
  )
}
