import { useField } from 'formik'
import { noop } from 'lodash-es'
import React, { useRef } from 'react'

import { InlineText } from '../Typography'
import { Append, InputContainer, InputEl, InputWrap, Label } from './styles'
import { FieldProps, InputProps } from './types'
import { validateDecimal, validateNatural, validateRegexp } from './utils'

export const INPUT_FORMATTERS = {
  NOP: (e: string) => e,

  DECIMAL: (v: string, prevValue: string) => {
    const value = v ? v.replace(',', '.') : v
    if (validateDecimal(value) || v === '') {
      return value
    }
    return prevValue
  },
  NATURAL: (v: string, prevValue: string) => {
    if (validateNatural(v) || v === '') {
      return v
    }
    return prevValue
  },
}

export const REGEXP_FORMATTER =
  (regexp: RegExp, allowEmpty: boolean = true) =>
  (v: string, prevValue: string) => {
    const isAllowedEmpty = allowEmpty && v === ''
    if (validateRegexp(regexp, v) || isAllowedEmpty) {
      return v
    }
    return prevValue
  }

export const Input: React.FC<InputProps> = (props) => {
  const input = useRef<HTMLInputElement | null>(null)
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
    label,
  } = props

  const setFocus = () => {
    if (input.current) {
      input.current.focus()
    }
  }
  return (
    <InputWrap
      $borderRadius={borderRadius}
      $variant={variant}
      className={className}
      $disabled={disabled}
      $withLabel={!!label}
      onClick={setFocus}
    >
      <InputContainer>
        <InlineText size="xs">{label && <Label>{label}</Label>}</InlineText>

        <InputEl
          size={size}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(formatter(e.target.value, value))}
          name={name}
          disabled={disabled}
          ref={input}
          autoComplete="off"
        />
      </InputContainer>

      {append && <Append>{append}</Append>}
    </InputWrap>
  )
}

export const InputField: React.FC<FieldProps> = (props) => {
  const {
    onChange = noop,

    placeholder,
    showPlaceholderOnDisabled,
    disabled,
    ...rest
  } = props
  const [field, _meta, helpers] = useField(rest)
  const value =
    disabled && showPlaceholderOnDisabled ? placeholder : field.value

  return (
    <Input
      {...rest}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(value) => {
        helpers.setTouched(true, true)
        helpers.setValue(value, true)
        onChange(value)
      }}
    />
  )
}

export * from './utils'
