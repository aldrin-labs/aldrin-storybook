import React from 'react'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
  LinkToCoinGecko,
  LinkToCoinMarketcap,
  LinkToDiscord,
  LinkToMedium,
  LinkToTelegram,
  LinkToTwitter,
} from '@sb/compositions/Homepage/SocialsLinksComponents'

export const Footer = () => {
  return (
    <RowContainer height="8rem" justify="space-between">
      <Row width="25%" justify="space-between" wrap="nowrap">
        <LinkToTwitter />
        <LinkToCoinGecko />
        <LinkToCoinMarketcap />
        <LinkToMedium />
        <LinkToTelegram />
        <LinkToDiscord />
      </Row>
    </RowContainer>
  )
}
