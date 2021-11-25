import React from 'react'
import { COLORS } from "@variables/variables"
import { CheckboxContainer, CheckMark, Label } from "./styles"
import { useField } from 'formik'


interface CheckboxBase {
  label: React.ReactNode
  color?: keyof typeof COLORS
}

interface CheckboxProops extends CheckboxBase {
  value: boolean
  onChange: (checked: boolean) => void

}


export const Checkbox: React.FC<CheckboxProops> = (props) => {
  const { value, onChange, label, color } = props
  return (
    <CheckboxContainer onClick={() => onChange(!value)}>
      <CheckMark checked={value} />
      <Label size="sm" color={color}>{label}</Label>
    </CheckboxContainer>
  )
}

interface CheckboxFieldProps extends CheckboxBase {
  name: string
}


export const CheckboxField: React.FC<CheckboxFieldProps> = (props) => {
  const [field, meta, helpers] = useField(props)

  return (
    <Checkbox
      {...props}
      value={field.value}
      onChange={(value) => {
        helpers.setTouched(true, true);
        helpers.setValue(value, true);
      }}
    />
  )
}