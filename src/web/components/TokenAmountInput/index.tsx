import React from 'react'

import { InputField, INPUT_FORMATTERS } from '@sb/components/Input'
import { InlineText } from '@sb/components/Typography'

import { InputAppendContainer, TokensAvailableText } from './styles'
import { TokenAmountInputFieldProps } from './types'

export const validateNumber = (v?: number, max?: number) => {
  const value = v || 0
  if (typeof max !== 'undefined' && value > max) {
    return 'Entered value greater than available balance.'
  }
  if (value <= 0) {
    return 'Enter valid amount'
  }
}

export const TokenAmountInputField: React.FC<TokenAmountInputFieldProps> = (
  props
) => {
  const {
    name,
    available,
    setFieldValue,
    disabled = false,
    onChange,
    children,
  } = props
  return (
    <InputField
      borderRadius="lg"
      variant="outline"
      name={name}
      disabled={disabled}
      onChange={onChange}
      placeholder="0"
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
          {children}
        </InputAppendContainer>
      }
      formatter={INPUT_FORMATTERS.DECIMAL}
      validate={(v) => validateNumber(v, available)}
    />
  )
}
