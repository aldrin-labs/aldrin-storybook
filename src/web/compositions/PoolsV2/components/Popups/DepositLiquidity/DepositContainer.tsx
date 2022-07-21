import React from 'react'

import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'

import { RIN_MINT } from '@core/solana'

import { AmountInput } from '../../Inputs'
import { Container } from '../index.styles'
import {
  FirstInputContainer,
  InputsContainer,
  PositionatedIconContainer,
  SecondInputContainer,
} from './index.styles'

export const DepositContainer = () => {
  return (
    <InputsContainer>
      <FirstInputContainer>
        <AmountInput
          title="Quote"
          maxAmount="0.00"
          amount={0}
          onMaxAmountClick={() => {}}
          disabled={false}
          onChange={() => {}}
          appendComponent={
            <Container>
              <TokenIcon margin="0 5px 0 0" mint={RIN_MINT} />
              <InlineText color="gray0" size="md" weight={600}>
                RIN
              </InlineText>
            </Container>
          }
        />
      </FirstInputContainer>
      <PositionatedIconContainer>+</PositionatedIconContainer>
      <SecondInputContainer>
        <AmountInput
          title="Base"
          maxAmount="0.00"
          amount={0}
          onMaxAmountClick={() => {}}
          onChange={() => {}}
          appendComponent={
            <Container>
              <TokenIcon
                margin="0 5px 0 0"
                mint="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
              />
              <InlineText color="gray0" size="md" weight={600}>
                USDC
              </InlineText>
            </Container>
          }
        />
      </SecondInputContainer>
    </InputsContainer>
  )
}
