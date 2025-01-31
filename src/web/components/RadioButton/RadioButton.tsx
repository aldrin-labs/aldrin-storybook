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
    <Container onClick={change}>
      <AttributeContainer>
        <Label htmlFor="inside">
          {label}
          <Input checked={checked} />
          <Checkmark />
        </Label>
      </AttributeContainer>
    </Container>
  </div>
)
