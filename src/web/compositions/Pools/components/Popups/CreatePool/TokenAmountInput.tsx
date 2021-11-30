import React, { ReactNode } from 'react'
import { InputField, INPUT_FORMATTERS, Input } from '@sb/components/Input'
import { InputAppendContainer, TokensAvailableText } from './styles'
import { InlineText } from '@sb/components/Typography'
import { TokenIconWithName } from '@sb/components/TokenIcon'

interface TokenAmountInputFieldProps {
  name: string
  available?: number
  mint: string
  setFieldValue?: (field: string, value: any) => void
  disabled?: boolean
}

export const validateNumber = (v?: number, max?: number) => {
  const value = v || 0
  if (typeof max !== 'undefined' && value > max) {
    return 'Entered value greater than available balance.'
  }
  if (value <= 0) {
    return 'Wrong value'
  }
  return
}

export const TokenAmountInputField: React.FC<TokenAmountInputFieldProps> = (props) => {
  const { name, available, setFieldValue, mint, disabled = false } = props
  return (
    <InputField
      borderRadius="lg"
      variant="outline"
      name={name}
      disabled={disabled}
      append={
        <InputAppendContainer>
          <div>
            {typeof available !== 'undefined' && setFieldValue &&
              <TokensAvailableText
                onClick={() => setFieldValue(name, available)}
              >
                Available:&nbsp; <InlineText color="success">{available}</InlineText>
              </TokensAvailableText>
            }

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
  value: ReactNode
}


export const TokenAmountInput: React.FC<TokenAmountInputProps> = (props) => {
  const { name, mint, value } = props
  return (
    <Input
      onChange={() => { }}
      borderRadius="lg"
      variant="outline"
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