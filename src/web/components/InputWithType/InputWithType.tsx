import React from 'react'
import { Text } from '@sb/compositions/Addressbook'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
  StyledInput,
  TokenContainer,
  InvisibleInput,
} from '@sb/compositions/Pools/components/Popups/index.styles'
import { Theme } from '@material-ui/core'

export const InputWithType = ({
  theme,
  value,
  disabled,
  placeholder,
  onChange,
  metric,
}: {
  theme: Theme
  value: string | number
  disabled?: boolean
  placeholder?: string
  metric: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  return (
    <Row style={{ position: 'relative' }} width={'100%'}>
      <StyledInput />
      <TokenContainer left={'2rem'} top={'1rem'}>
        <Text color={theme.palette.grey.title}>
          Order length / each ticket will be placed every 15 sec
        </Text>
      </TokenContainer>
      <TokenContainer style={{ width: '80%' }} left={'2rem'} bottom={'1rem'}>
        <InvisibleInput
          type={'text'}
          value={value}
          disabled={disabled}
          onChange={(e) => {
            onChange(e)
          }}
          placeholder={placeholder}
        />
      </TokenContainer>
      <TokenContainer
        right={'2rem'}
        bottom={'2.6rem'}
      >
        <Row
          style={{ flexWrap: 'nowrap' }}
        >
          <Text
            style={{ margin: '0 0.5rem' }}
            fontSize={'2rem'}
            fontFamily={'Avenir Next Demi'}
          >
            {metric}
          </Text>
        </Row>
      </TokenContainer>
    </Row>
  )
}
