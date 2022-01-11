import React from 'react'

import { Input } from '@sb/components/Input'
import { TokenIconWithName } from '@sb/components/TokenIcon'

import { InputAppendContainer } from './styles'

interface TokenAmountInputProps {
  name: string
  mint: string
  value: string
}

// Not changeable field, using just for calculation display
export const TokenAmount: React.FC<TokenAmountInputProps> = (props) => {
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
    />
  )
}
