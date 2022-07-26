import React from 'react'

import { Button } from '@sb/components/Button'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { RootRow } from '@sb/compositions/PoolsV2/index.styles'
import { MSOL_MINT, RIN_MINT } from '@sb/dexUtils/utils'

import { TooltipIcon } from '../../Icons'
import {
  LinkToCoinMarketcap,
  LinkToDiscord,
  LinkToTwitter,
} from '../../Socials'
import { Card, ContainerWithBack, InnerBlock } from './index.styles'

export const PositionCard = () => {
  return (
    <ContainerWithBack>
      <Card>
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
        <div style={{ opacity: '0.1' }}>
          <div
            style={{
              position: 'absolute',
              transform: 'rotate(-20deg)',
              top: '-1em',
              right: '-2em',
            }}
          >
            <TokenIcon size={160} mint={MSOL_MINT} />
          </div>
          <div
            style={{
              position: 'absolute',
              transform: 'rotate(20deg)',
              top: '2em',
              right: '4em',
            }}
          >
            <TokenIcon size={160} mint={RIN_MINT} />
          </div>
        </div>
      </Card>
      <Button
        $width="xl"
        $borderRadius="md"
        $padding="xxl"
        $variant="green"
        $fontSize="sm"
      >
        APR Multiplier <TooltipIcon color="green1" margin="0 0 0 0.5em" />
      </Button>
    </ContainerWithBack>
  )
}
