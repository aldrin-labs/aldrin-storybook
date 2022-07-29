import React from 'react'

import { SolExplorerLink } from '@sb/components/TokenExternalLinks'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
  CoinMarketcapIcon,
  TwitterIcon,
} from '@sb/compositions/Homepage/SocialsLinksComponents'
import { tokensMap } from '@sb/dexUtils/markets'

import { IconContainer, MintAddressText, TokenInfoContainer } from './styles'

interface TokenInfoParams {
  mint: string
}

const TokenInfo = (params: TokenInfoParams) => {
  const { mint } = params

  const { symbol, marketCapLink, twitterLink } = tokensMap?.get(mint) || {
    symbol: 'Unknown',
    marketCapLink: null,
    twitterLink: null,
  }

  return (
    <TokenInfoContainer direction="column">
      <RowContainer justify="space-between">
        <Row>
          <TokenIcon mint={mint} size={16} margin="0 0.2em 0 0" />
          <InlineText size="md" weight={600} color="white">
            {symbol}
          </InlineText>
        </Row>
        <Row>
          {marketCapLink && (
            <a target="_blank" href={marketCapLink} rel="noreferrer">
              <IconContainer>
                <CoinMarketcapIcon />
              </IconContainer>
            </a>
          )}

          {twitterLink && (
            <a target="_blank" href={twitterLink} rel="noreferrer">
              <IconContainer>
                <TwitterIcon />
              </IconContainer>
            </a>
          )}
        </Row>
      </RowContainer>
      <RowContainer justify="space-between">
        <Row>
          <MintAddressText color="white1" size="xs">
            {mint}
          </MintAddressText>
        </Row>
        <Row width="2em" height="2em">
          <SolExplorerLink mint={mint} />
        </Row>
      </RowContainer>
    </TokenInfoContainer>
  )
}

export { TokenInfo }
