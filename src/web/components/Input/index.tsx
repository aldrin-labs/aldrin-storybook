import React from 'react'
import styled from 'styled-components'

import { COLORS, BORDER_RADIUS } from '@variables/variables'
import { validateDecimal } from './utils'

interface InputProps {
  value?: string
  onChange: (e: string) => void
  formatter?: (e: string, prevValue: string) => string
  placeholder?: string
  append?: string
  size?: number // Input size
  name: string
}

const InputWrap = styled.div`
  background: ${COLORS.borderAlt};
  border: 1px solid ${COLORS.border};
  border-radius: ${BORDER_RADIUS.xxl};
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
`

const InputEl = styled.input`
  background: none;
  border: 0;
  outline: none;
  flex: 1;
  height: 3em;
  font-size: 1em;
  line-height: 1.7;
  font-weight: 600;
  padding: 0.6em 1.5em;
  color: ${COLORS.white};
`
const Append = styled.span`
  padding: 0 1.5em;
  color: ${COLORS.hint};
  font-size: 1em;
`



export const INPUT_FORMATTERS = {
  NOP: (e: string, prevValue: string) => e,
  DECIMAL: (v: string, prevValue: string) => {
    const value = v ? v.replace(',', '.') : v;
    if (validateDecimal(value) || v === '') {
        return value
    }
    return prevValue
  }
}

export const Input: React.FC<InputProps> = (props) => {
  const { placeholder, onChange, append, value = '', size = 8, name, formatter = INPUT_FORMATTERS.NOP } = props
  return (
    <InputWrap>
      <InputEl
        size={size}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(formatter(e.target.value, value))}
        name={name}
      />
      {append &&
        <Append>{append}</Append>
      }
    </InputWrap>
  )
}

// export const RoundInputWithTokenName = ({
//   text,
//   width = '70%',
//   placeholder,
// }: {
//   text: string
//   width?: string
//   placeholder?: string
// }) => {
//   return (
//     <Row style={{ position: 'relative' }} width={width}>
//       <RoundInput placeholder={placeholder} />
//       <Text
//         color={'#96999C'}
//         fontSize="1.8rem"
//         fontFamily="Avenir Next Light"
//         style={{
//           position: 'absolute',
//           top: '2.5rem',
//           right: '3rem',
//           transform: 'translateY(-50%)',
//         }}
//       >
//         {text}
//       </Text>
//     </Row>
//   )
// }

export * from './utils'