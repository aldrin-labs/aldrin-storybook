import React, { ReactNode } from 'react'
import styled from 'styled-components'

import {COLORS, BORDER_RADIUS, FONT_SIZES, WIDTH} from '@variables/variables'
import { validateDecimal } from './utils'
import {Button, ButtonProps} from "@sb/components/Button";

export interface InputProps {
  value?: string
  onChange: (e: string) => void
  formatter?: (e: string, prevValue: string) => string
  placeholder?: string
  append?: ReactNode
  size?: number // Input size
  name: string
  className?: string
  maxButton?: boolean
  maxButtonOnClick?: () => void
  halfButton?: boolean,
  halfButtonOnClick?: () => void
}

export interface AppendProps {
  padding?: string
}

const InputWrap = styled.div`
  background: ${COLORS.background};
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

const Append = styled.span<AppendProps>`
  padding: ${(props: AppendProps) => props.padding || '0 1.5em'};
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
  const {
    placeholder,
    onChange,
    append,
    value = '',
    size = 8,
    name,
    formatter = INPUT_FORMATTERS.NOP,
    className = '',
    maxButton = false,
    maxButtonOnClick,
    halfButton = false,
    halfButtonOnClick,
  } = props

  return (
    <InputWrap className={className}>
      <InputEl
        size={size}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(formatter(e.target.value, value))}
        name={name}
      />
      {halfButton && <div style={{marginRight: '1rem'}}>
        <Button
          minWidth="2rem"
          fontSize="xs"
          borderRadius="xxl"
          onClick={halfButtonOnClick}
          type="button"
          variant="utility"
        >
          HALF
        </Button>
      </div>}
      {maxButton && <Button
        minWidth="2rem"
        fontSize="xs"
        borderRadius="xxl"
        onClick={maxButtonOnClick}
        type="button"
        variant="utility"
      >
        MAX
      </Button>}
      {append &&
        <Append padding={maxButton ? '0 1.5em 0 0.5em' : ''} >{append}</Append>
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
