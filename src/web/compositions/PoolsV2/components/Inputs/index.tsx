import React from 'react'

import { StretchedBlock } from '@sb/components/Layout'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { formatNumbersForState } from '@sb/dexUtils/utils'

import { stripByAmount } from '@core/utils/chartPageUtils'

import { Container } from '../../index.styles'
import { WalletIcon } from '../Icons'
import {
  AmountInputContainer,
  CenteredRow,
  CustomTextInputContainer,
  Input,
  InvisibleInput,
  StyledInlineText,
  FirstInputContainer,
  InputsContainer,
  PositionatedIconContainer,
  SecondInputContainer,
} from './index.styles'
import {
  AmountInputProps,
  CustomInputProps,
  ValuesContainerType,
} from './types'

export const AmountInput: React.FC<AmountInputProps> = (props) => {
  const {
    needPadding,
    title,
    onMaxAmountClick,
    maxAmount,
    amount,
    appendComponent,
    disabled,
    onChange,
    placeholder,
  } = props

  return (
    <Input needPadding={needPadding}>
      <StretchedBlock width="xl">
        <InlineText weight={400} size="sm" color="white2">
          {title}
        </InlineText>
        <CenteredRow onClick={onMaxAmountClick}>
          <WalletIcon />
          <StyledInlineText weight={600} size="sm" color="white2">
            {maxAmount ? stripByAmount(maxAmount) : '0.00'}
          </StyledInlineText>
        </CenteredRow>
      </StretchedBlock>
      <StretchedBlock width="xl" align="flex-end" margin="0.6em 0 0 0">
        <AmountInputContainer>
          <InvisibleInput
            data-testid={`swap-${title.replaceAll(' ', '-')}-field`}
            type="text"
            value={amount || ''}
            disabled={disabled}
            onChange={(e) => {
              onChange(formatNumbersForState(e.target.value))
            }}
            placeholder={placeholder}
          />
        </AmountInputContainer>
        {appendComponent}
      </StretchedBlock>
    </Input>
  )
}

export const CustomTextInput: React.FC<CustomInputProps> = (props) => {
  const {
    width,
    needPadding,
    title,
    amount,
    disabled,
    onChange,
    placeholder,
    appendComponent,
  } = props

  return (
    <CustomTextInputContainer width={width}>
      <Input needPadding={needPadding} background="transparent">
        <StretchedBlock width="xl">
          <InlineText weight={400} size="sm" color="white2">
            {title}
          </InlineText>
        </StretchedBlock>
        <StretchedBlock width="xl" align="flex-end" margin="0.6em 0 0 0">
          <AmountInputContainer>
            <InvisibleInput
              data-testid={`swap-${title.replaceAll(' ', '-')}-field`}
              type="text"
              value={amount || ''}
              disabled={disabled}
              onChange={(e) => {
                onChange(formatNumbersForState(e.target.value))
              }}
              placeholder={placeholder}
            />
          </AmountInputContainer>
          {appendComponent}
        </StretchedBlock>
      </Input>
    </CustomTextInputContainer>
  )
}

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
