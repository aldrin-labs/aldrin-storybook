import { useField } from 'formik'
import { noop } from 'lodash-es'
import React from 'react'

import { Append, InputEl, InputWrap } from './styles'
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
