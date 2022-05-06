import React from 'react'

import { InputField, INPUT_FORMATTERS, Input } from '@sb/components/Input'
import { TokenIconWithName } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { InputAppendContainer, TokensAvailableText } from './styles'

type TokenAmountInputFieldProps = {
  name: string
  available?: number
  mint: string
  setFieldValue?: (field: string, value: any) => void
  disabled?: boolean
  onChange?: (value: string) => void
  placeholder?: string
  showPlaceholderOnDisabled?: boolean
}

export const validateNumber = (v?: number, max?: number) => {
  const value = v || 0
  if (typeof max !== 'undefined' && value > max) {
    return 'Entered value greater than available balance.'
  }
  if (value <= 0) {
    return 'Wrong value'
  }
}

export const TokenAmountInputField: React.FC<TokenAmountInputFieldProps> = (
  props
) => {
  const {
    name,
    available,
    setFieldValue,
    mint,
    disabled = false,
    onChange,
    placeholder = '0',
    showPlaceholderOnDisabled,
  } = props
  return (
    <InputField
      borderRadius="lg"
      variant="outline"
      name={name}
      disabled={disabled}
      onChange={onChange}
      placeholder={placeholder}
      showPlaceholderOnDisabled={showPlaceholderOnDisabled}
      append={
        <InputAppendContainer>
          <div>
            {typeof available !== 'undefined' && setFieldValue && (
              <TokensAvailableText
                onClick={() => setFieldValue(name, available)}
              >
                Available:&nbsp;{' '}
                <InlineText color="success">{available}</InlineText>
              </TokensAvailableText>
            )}
          </div>
          <TokenIconWithName mint={mint} />
        </InputAppendContainer>
      }
      formatter={INPUT_FORMATTERS.DECIMAL}
      validate={(v) => validateNumber(v, available)}
    />
  )
}

interface TokenAmountInputProps {
  name: string
  mint: string
  value: string
}

export const TokenAmountInput: React.FC<TokenAmountInputProps> = (props) => {
  const { name, mint, value } = props
  return (
    <Input
      onChange={() => {}}
      borderRadius="lg"
      variant="outline"
      placeholder="0"
      name={name}
      value={value}
      disabled
      append={
        <InputAppendContainer>
          <TokenIconWithName mint={mint} />
        </InputAppendContainer>
      }
      formatter={INPUT_FORMATTERS.DECIMAL}
    />
  )
}
