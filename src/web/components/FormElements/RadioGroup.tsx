import React, { ReactNode } from 'react'
import { useField } from 'formik'
import { Container, Option, RadioButton, RadioLabel } from './styles'
import { GroupLabel } from './GroupLabel'

interface Option<T = any> {
  value: T
  label?: ReactNode
}

interface RadioGroupBase<T> {
  options: Option<T>[]
  name: string
  label?: ReactNode
}

interface RadioGroupProps<T> extends RadioGroupBase<T> {
  onChange: (value: T) => void
  value?: T
}

export function RadioGroup<T>(props: RadioGroupProps<T>) {
  const { options, name, onChange, value, label } = props

  return (
    <div>
      {label && <GroupLabel label={label} />}
      <Container>
        {options.map((o, idx) => (
          <Option
            alignItems="center"
            onClick={() => onChange(o.value)}
            key={`radio_${name}_${idx}`}
          >
            <RadioButton selected={o.value === value} />
            <RadioLabel>{o.label || o.value}</RadioLabel>
          </Option>
        ))}
      </Container>
    </div>
  )
}

export function RadioGroupField<T>(props: RadioGroupBase<T>) {
  const [field, meta, helpers] = useField<T>(props)

  return (
    <RadioGroup
      {...props}
      value={field.value}
      name={field.name}
      onChange={(value) => {
        helpers.setTouched(true, true)
        helpers.setValue(value, true)
      }}
    />
  )
}
