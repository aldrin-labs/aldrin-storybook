import React from 'react'

import {
  Container,
  AttributeContainer,
  Label,
  Input,
  Checkmark,
} from './RadioButton.styles'

export const Radio = ({
  change,
  label = '',
  checked,
}: {
  label?: string
  checked: boolean
  change: () => void
}) => (
  <div>
    <Container>
      <AttributeContainer>
        <Label htmlFor="inside">
          {label}
          <Input
            type="radio"
            name="radio"
            id="inside"
            value="inside"
            checked={checked}
            onChange={() => change()}
          />
          <Checkmark />
        </Label>
      </AttributeContainer>
    </Container>
  </div>
)
