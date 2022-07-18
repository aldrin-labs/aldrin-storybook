import React from 'react'
import { useTheme } from 'styled-components'

import { Button } from '@sb/components/Button'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import {
  LinkToTwitter,
  LinkToDiscord,
  LinkToCoinMarketcap,
} from '@sb/compositions/Homepage/SocialsLinksComponents'
import { getTokenMintAddressByName } from '@sb/dexUtils/markets'

import { labelsMap, POOL_CARD_LABELS } from '../../config'
import { RootRow, RootColumn, SpacedColumn } from '../../index.styles'
import { BalanceLine } from '../BalanceLine'
import { Container, StretchedRow } from '../FiltersSection/index.styles'
import { LabelComponent } from '../FiltersSection/Labels'
import { TooltipIcon, PlusIcon } from '../Icons'
import { TokenIconsContainer } from '../TokenIconsContainer'

export const TableRow = ({ isFiltersShown }: { isFiltersShown: boolean }) => {
  const theme = useTheme()
  
  return (
    <RootRow margin={isFiltersShown ? 'auto' : '30px 0 0 0'}>
      <Container width="100%">
        <StretchedRow>
          <RootColumn height="100%">
            <TokenIconsContainer mint="E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp" />
            <InlineText size="md" weight={600} color="gray0">
              RIN/USDC
            </InlineText>
            <RootRow margin="10px 0 0 0">
              <LabelComponent
                name="Moderated"
                variant={POOL_CARD_LABELS[0]}
              />
              <LabelComponent
                name="Permissionless"
                variant={POOL_CARD_LABELS[0]}
              />
            </RootRow>
          </RootColumn>
          <SpacedColumn height="100%">
            <InlineText size="sm" weight={400} color="gray3">
              Liquidity
            </InlineText>
            <InlineText size="md" weight={600} color="gray0">
              <InlineText color="gray1">$</InlineText>
              10.42m
            </InlineText>
          </SpacedColumn>
          <SpacedColumn height="100%">
            <InlineText size="sm" weight={400} color="gray3">
              Volume 7d
            </InlineText>
            <InlineText size="md" weight={600} color="gray0">
              <InlineText color="gray1">$</InlineText>
              102.24k
            </InlineText>
          </SpacedColumn>
          <SpacedColumn height="100%">
            <InlineText size="sm" weight={400} color="gray3">
              Rewards
            </InlineText>
            <RootRow margin="0">
              <TokenIcon mint={getTokenMintAddressByName('RIN')} />
              <TokenIcon mint={getTokenMintAddressByName('mSOL')} />
            </RootRow>
          </SpacedColumn>
          <SpacedColumn height="100%">
            <InlineText size="sm" weight={400} color="gray3">
              <TooltipIcon color="gray3" /> APR
            </InlineText>
            <SpacedColumn>
              <InlineText size="md" weight={600} color="green1">
                125.24%
              </InlineText>
              <BalanceLine value1="30%" value2="70%" />
            </SpacedColumn>
          </SpacedColumn>
          <SpacedColumn height="100%">
            <RootRow margin="0">
              <LinkToTwitter />
              <LinkToDiscord margin="0 0.5em" />
              <LinkToCoinMarketcap />
            </RootRow>
            <Button
              $width="xl"
              $borderRadius="md"
              $padding="xl"
              $variant="green"
              $fontSize="sm"
            >
              <PlusIcon color={theme.colors.green1} /> Deposit
            </Button>
          </SpacedColumn>
        </StretchedRow>
      </Container>
    </RootRow>
  )
}
