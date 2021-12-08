import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { COLORS, BORDER_RADIUS } from '@variables/variables'
import { useField, FieldValidator } from 'formik'
import { noop } from 'lodash-es'
import { validateDecimal } from './utils'

const VARIANTS = {
  default: css`
    background: ${COLORS.background};
    border: 1px solid ${COLORS.border};
  `,
  'outline-white': css`
    border: 1px solid ${COLORS.white};
  `,
  outline: css`
    border: 1px solid ${COLORS.border};
  `,
}

interface WrapProps {
  $borderRadius: keyof typeof BORDER_RADIUS
  $variant: keyof typeof VARIANTS
  $disabled?: boolean
}

export const InputWrap = styled.div<WrapProps>`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  flex: 1;
  border-radius: ${(props: WrapProps) => BORDER_RADIUS[props.$borderRadius]};

  ${(props: WrapProps) => VARIANTS[props.$variant]}
  ${(props: WrapProps) => (props.$disabled ? 'opacity: 0.6;' : '')}
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

  &:disabled {
    color: ${COLORS.hint};
  }
`

const Append = styled.span`
  padding: 0 1.5em;
  color: ${COLORS.hint};
  font-size: 1em;
`

interface InputBase {
  formatter?: (e: string, prevValue: string) => string
  placeholder?: string
  append?: ReactNode
  size?: number // Input size
  name: string
  className?: string
  variant?: keyof typeof VARIANTS
  borderRadius?: keyof typeof BORDER_RADIUS
  disabled?: boolean
}

export interface InputProps extends InputBase {
  value?: string
  onChange: (e: string) => void
}

export const INPUT_FORMATTERS = {
  NOP: (e: string) => e,
  DECIMAL: (v: string, prevValue: string) => {
    const value = v ? v.replace(',', '.') : v
    if (validateDecimal(value) || v === '') {
      return value
    }
    return prevValue
  },
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
    variant = 'default',
    borderRadius = 'xxl',
    disabled,
  } = props

  return (
    <InputWrap
      $borderRadius={borderRadius}
      $variant={variant}
      className={className}
      $disabled={disabled}
    >
      <InputEl
        size={size}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(formatter(e.target.value, value))}
        name={name}
        disabled={disabled}
      />
      {append && <Append>{append}</Append>}
    </InputWrap>
  )
}

// Formik Wrapper

export interface InputFieldProps extends InputBase {
  validate?: FieldValidator
}

export type FieldProps = InputFieldProps & {
  onChange?: (v: string) => void
}

export const InputField: React.FC<FieldProps> = (props) => {
  const { onChange = noop, ...rest } = props
  const [field, _meta, helpers] = useField(rest)
  return (
    <Input
      {...rest}
      value={field.value}
      onChange={(value) => {
        helpers.setTouched(true, true)
        helpers.setValue(value, true)
        onChange(value)
      }}
    />
  )
}

export * from './utils'
