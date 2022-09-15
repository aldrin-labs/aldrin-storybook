import React from 'react'

import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { RootRow } from '@sb/compositions/PoolsV2/index.styles'
import { getTokenMintAddressByName } from '@sb/dexUtils/markets'

import { CopyIcon } from '../../../Icons'
import { IconsContainer } from '../../../TokenIconsContainer/index.styles'
import {
  Card,
  ContainerWithBack,
  HeaderRow,
  InnerBlock,
} from '../../../YourPositions/PositionCard/index.styles'

export const PoolsCard = () => {
  return (
    <ContainerWithBack $width="14%">
      <Card $margin="0" $height="10.5em">
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
            <CopyIcon />
            <InlineText size="es" as="a">
              Copy Pool Link
            </InlineText>
          </RootRow>
        </InnerBlock>
      </Card>
    </ContainerWithBack>
  )
}
