import React from 'react'
import { InputField, INPUT_FORMATTERS } from '@sb/components/Input'
import { InputAppendContainer, TokensAvailableText } from './styles'
import { InlineText } from '@sb/components/Typography'
import { TokenIconWithName } from '@sb/components/TokenIcon'

interface TokenAmountInputProps {
  name: string
  available?: number
  mint: string
  setFieldValue?: (field: string, value: any) => Promise<any>;
}

export const validateNumber = (v?: number) => {
  if ((v || 0) <= 0) {
    return 'Wrong value'
  }
  return
}

export const TokenAmountInput: React.FC<TokenAmountInputProps> = (props) => {
  const { name, available, setFieldValue, mint } = props
  return (
    <InputField
      borderRadius="lg"
      variant="outline"
      name={name}
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
      validate={validateNumber}
    />
  )
}