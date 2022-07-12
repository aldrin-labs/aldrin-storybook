import React, { useState } from 'react'

import { TooltipIcon } from '../Icons'
import {
  CheckboxContainer,
  HiddenCheckbox,
  Icon,
  Label,
  LabelContainer,
  StyledCheckbox,
} from './index.styles'

type LabelType = {
  name: string
  backgroundColor: string
  color: string
}

const mock = [
  { name: 'Moderated', backgroundColor: 'green9', color: 'green7' },
  { name: 'Permissionless', backgroundColor: 'blue0', color: 'blue1' },
  { name: 'Stable', backgroundColor: 'yellow0', color: 'yellow1' },
]

export const LabelComponent = ({ label }: { label: LabelType }) => {
  const [checked, setChecked] = useState(false)

  return (
    <LabelContainer
      onClick={() => {
        setChecked(!checked)
      }}
      background={label.backgroundColor}
    >
      <CheckboxContainer>
        <HiddenCheckbox id="checkboxtest" type="checkbox" checked={checked} />
        <StyledCheckbox color={label.color}>
          <Icon color={label.color} checked={checked} viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </Icon>
        </StyledCheckbox>
      </CheckboxContainer>
      <Label color={label.color}>{label.name}</Label>
      <TooltipIcon color={label.color} />
    </LabelContainer>
  )
}

export const FilterLabels = () => {
  return (
    <>
      {mock.map((el: LabelType) => {
        console.log({ el })
        return <LabelComponent label={el} />
      })}
    </>
  )
}
