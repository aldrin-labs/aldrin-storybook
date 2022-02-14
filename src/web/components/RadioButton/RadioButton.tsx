import React from 'react'

export const Radio = ({
  label = '',
  checked,
}: {
  label?: string
  checked: boolean
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
          />
          <Checkmark />
        </Label>
      </AttributeContainer>
    </Container>
  </div>
)
