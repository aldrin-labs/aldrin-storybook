import React from 'react'

import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'

import { AmountInput } from '../../Inputs'
import { Container } from '../index.styles'
import {
  FirstInputContainer,
  InputsContainer,
  PositionatedIconContainer,
  SecondInputContainer,
} from './index.styles'
import { ValuesContainerType } from './types'

export const ValuesContainer: React.FC<ValuesContainerType> = (props) => {
  const {
    baseMax,
    baseAmount,
    setBaseAmount,
    baseMint,
    quoteMax,
    quoteAmount,
    setQuoteAmount,
    quoteMint,
  } = props

  return (
    <InputsContainer>
      <FirstInputContainer>
        <AmountInput
          title="Base"
          maxAmount={baseMax}
          amount={baseAmount}
          onMaxAmountClick={() => {
            setBaseAmount(baseMax)
          }}
          disabled={false}
          onChange={setBaseAmount}
          appendComponent={
            <Container>
              <TokenIcon margin="0 5px 0 0" mint={baseMint} />
              <InlineText color="gray0" size="md" weight={600}>
                {getTokenNameByMintAddress(baseMint)}
              </InlineText>
            </Container>
          }
        />
      </FirstInputContainer>
      <PositionatedIconContainer>+</PositionatedIconContainer>
      <SecondInputContainer>
        <AmountInput
          title="Quote"
          maxAmount={quoteMax}
          amount={quoteAmount}
          onMaxAmountClick={() => {
            setQuoteAmount(quoteMax)
          }}
          onChange={setQuoteAmount}
          appendComponent={
            <Container>
              <TokenIcon margin="0 5px 0 0" mint={quoteMint} />
              <InlineText color="gray0" size="md" weight={600}>
                {getTokenNameByMintAddress(quoteMint)}
              </InlineText>
            </Container>
          }
        />
      </SecondInputContainer>
    </InputsContainer>
  )
}
