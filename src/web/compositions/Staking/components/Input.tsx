import { Text } from '@sb/compositions/Addressbook'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import React from 'react'
import { RoundInput } from '../Staking.styles'

export const RoundInputWithTokenName = ({
  text,
  width = '70%',
  placeholder,
}: {
  text: string
  width?: string
  placeholder?: string
}) => {
  return (
    <Row style={{ position: 'relative' }} width={width}>
      <RoundInput placeholder={placeholder} />
      <Text
        color={'#96999C'}
        fontSize="1.8rem"
        fontFamily="Avenir Next Light"
        style={{
          position: 'absolute',
          top: '2.5rem',
          right: '3rem',
          transform: 'translateY(-50%)',
        }}
      >
        {text}
      </Text>
    </Row>
  )
}
