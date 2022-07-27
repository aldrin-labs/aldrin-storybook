import React from 'react'

import { Button } from '@sb/components/Button'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { RootRow } from '@sb/compositions/PoolsV2/index.styles'
import { RIN_MINT } from '@sb/dexUtils/utils'

import { TooltipIcon } from '../../Icons'
import {
  LinkToCoinMarketcap,
  LinkToDiscord,
  LinkToTwitter,
} from '../../Socials'
import {
  TokenContainer,
  Card,
  ContainerWithBack,
  InnerBlock,
  TokensBackground,
} from './index.styles'

export const PositionCard = ({
  isPositionViewDetailed,
}: {
  isPositionViewDetailed: boolean
}) => {
  return (
    <ContainerWithBack>
      <Card isPositionViewDetailed={isPositionViewDetailed}>
        <InnerBlock>
          <InlineText color="gray0" weight={600}>
            • RIN/USDC •
          </InlineText>
          <RootRow margin="0">
            <InlineText size="xsm">APR</InlineText>{' '}
            <InlineText color="gray0" weight={600}>
              125.42%
            </InlineText>
          </RootRow>
          <RootRow margin="0">
            <LinkToTwitter $variant="withoutBack" />
            <LinkToCoinMarketcap $variant="withoutBack" />
            <LinkToDiscord $variant="withoutBack" />
          </RootRow>
        </InnerBlock>
        <TokensBackground>
          <TokenContainer isFirstIcon>
            <TokenIcon
              size={160}
              mint="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
            />
          </TokenContainer>
          <TokenContainer>
            <TokenIcon size={160} mint={RIN_MINT} />
          </TokenContainer>
        </TokensBackground>
      </Card>
      <Button
        $width="xl"
        $borderRadius="md"
        $padding="lg"
        $variant="green"
        $fontSize="sm"
      >
        APR Multiplier <TooltipIcon color="green1" margin="0 0 0 0.5em" />
      </Button>
    </ContainerWithBack>
  )
}
