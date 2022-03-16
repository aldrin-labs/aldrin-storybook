import { useField } from 'formik'
import React from 'react'

import { CheckboxContainer, CheckMark, Label } from './styles'
import { CheckboxProps, CheckboxFieldProps } from './types'

export const Checkbox: React.FC<CheckboxProps> = (props) => {
  const { value, onChange, label, color } = props

  return (
    <CheckboxContainer onClick={() => onChange(!value)}>
      <CheckMark checked={value} />
      <Label size="sm" color={color}>
        {label}
      </Label>
    </CheckboxContainer>
  )
}

export const CheckboxField: React.FC<CheckboxFieldProps> = (props) => {
  const [field, _meta, helpers] = useField(props)

  return (
    <Checkbox
      {...props}
      value={field.value}
      onChange={(value) => {
        helpers.setTouched(true, true)
        helpers.setValue(value, true)
      }}
    />
  )
}
