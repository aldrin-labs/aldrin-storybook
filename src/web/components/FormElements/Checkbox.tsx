import { COLORS } from '@variables/variables'
import { useField } from 'formik'
import React from 'react'

import { CheckboxContainer, CheckMark, Label } from './styles'

interface CheckboxBase {
  label: React.ReactNode
  color?: keyof typeof COLORS
}

interface CheckboxProps extends CheckboxBase {
  value: boolean
  onChange: (checked: boolean) => void
}

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

interface CheckboxFieldProps extends CheckboxBase {
  name: string
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
