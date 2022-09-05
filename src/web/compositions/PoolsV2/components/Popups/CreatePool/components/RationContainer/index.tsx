import React from 'react'

import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { RootRow } from '@sb/compositions/PoolsV2/index.styles'

import { RIN_MINT } from '@core/solana'

import { Container as TokenContainer, Column } from '../../../index.styles'
import {
  Container,
  LeftHalfContainer,
  RightHalfContainer,
  SignContainer,
} from './index.styles'

export const RationContainer = ({
  token = 'USDC',
  needPadding = true,
  needElement = true,
}: {
  token: string
  needPadding?: boolean
  needElement?: boolean
}) => {
  return (
    <Container>
      <LeftHalfContainer needPadding={needPadding}>
        <RootRow margin="0" width="100%">
          <Column margin="0" width="auto">
            <InlineText size="sm" color="white2">
              Rate per {token}
            </InlineText>
            <InlineText weight={600} color="white1">
              1.00
            </InlineText>
          </Column>
          <TokenContainer>
            <TokenIcon margin="0 5px 0 0" mint={RIN_MINT} />
            <InlineText color="gray0" size="md" weight={600}>
              RIN
            </InlineText>
          </TokenContainer>
        </RootRow>
      </LeftHalfContainer>
      <SignContainer needElement={needElement}>=</SignContainer>
      <RightHalfContainer needPadding={needPadding}>
        <RootRow margin="0" width="100%">
          <Column margin="0" width="auto">
            <InlineText size="sm" color="white2">
              Rate per {token}
            </InlineText>
            <InlineText weight={600} color="white1">
              10.00
            </InlineText>
          </Column>
          <TokenContainer>
            <TokenIcon margin="0 5px 0 0" mint={RIN_MINT} />
            <InlineText color="gray0" size="md" weight={600}>
              RIN
            </InlineText>
          </TokenContainer>
        </RootRow>
      </RightHalfContainer>
    </Container>
  )
}
