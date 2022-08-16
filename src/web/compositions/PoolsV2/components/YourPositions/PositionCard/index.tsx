import React from 'react'

import { Button } from '@sb/components/Button'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { RootRow } from '@sb/compositions/PoolsV2/index.styles'
import { getTokenMintAddressByName } from '@sb/dexUtils/markets'

import { TooltipIcon } from '../../Icons'
import {
  LinkToCoinMarketcap,
  LinkToDiscord,
  LinkToTwitter,
} from '../../Socials'
import { IconsContainer } from '../../TokenIconsContainer/index.styles'
import { Card, ContainerWithBack, HeaderRow, InnerBlock } from './index.styles'

export const PositionCard = ({
  isPositionViewDetailed,
}: {
  isPositionViewDetailed: boolean
}) => {
  return (
    <ContainerWithBack>
      <Card isPositionViewDetailed={isPositionViewDetailed}>
        <HeaderRow>
          <IconsContainer>
            <TokenIcon mint={getTokenMintAddressByName('RIN')} size={24} />{' '}
            <TokenIcon mint={getTokenMintAddressByName('USDC')} size={24} />{' '}
          </IconsContainer>{' '}
          <InlineText color="white1" weight={600}>
            RIN/USDC
          </InlineText>
        </HeaderRow>

        <InnerBlock>
          <RootRow margin="0">
            <InlineText color="white1" size="esm">
              APR
            </InlineText>
            <InlineText color="white1" weight={600}>
              125.42%
            </InlineText>
          </RootRow>
          <RootRow margin="0">
            <LinkToTwitter $variant="withoutBack" />
            <LinkToCoinMarketcap $variant="withoutBack" />
            <LinkToDiscord $variant="withoutBack" />
          </RootRow>
        </InnerBlock>
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
