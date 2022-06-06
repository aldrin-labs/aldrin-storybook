import React from 'react'
import { useTheme } from 'styled-components'

import { Text } from '@sb/compositions/Addressbook'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
  StyledInput,
  TokenContainer,
  InvisibleInput,
} from '@sb/compositions/Pools/components/Popups/index.styles'

export const InputWithType = ({
  value,
  disabled,
  placeholder,
  onChange,
  metric,
  label,
  type,
}: {
  type?: string
  value: string | number
  disabled?: boolean
  placeholder?: string
  metric: string
  label: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  const theme = useTheme()
  return (
    <Row style={{ position: 'relative' }} width="100%">
      <StyledInput />
      <TokenContainer left="2rem" top="1rem">
        <Text color={theme.colors.gray1}>{label}</Text>
      </TokenContainer>
      <TokenContainer style={{ width: '80%' }} left="2rem" bottom="1rem">
        <InvisibleInput
          type={type || 'text'}
          value={value}
          disabled={disabled}
          onChange={(e) => {
            onChange(e)
          }}
          placeholder={placeholder}
        />
      </TokenContainer>
      <TokenContainer right="2rem" bottom="2.6rem">
        <Row style={{ flexWrap: 'nowrap' }}>
          <Text
            style={{ margin: '0 0.5rem' }}
            fontSize="2rem"
            fontFamily="Avenir Next Demi"
          >
            {metric}
          </Text>
        </Row>
      </TokenContainer>
    </Row>
  )
}
