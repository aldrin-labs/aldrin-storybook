import React, { useState } from 'react'

import { labels } from '../../config'
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

export const LabelComponent = ({
  checkbox,
  variant,
  name,
}: {
  checkbox: boolean
  variant: LabelType
  name: string
}) => {
  const [checked, setChecked] = useState(false)

  return (
    <LabelContainer
      onClick={() => {
        setChecked(!checked)
      }}
      background={variant.backgroundColor}
    >
      {checkbox && (
        <CheckboxContainer>
          <HiddenCheckbox id="checkboxtest" type="checkbox" checked={checked} />
          <StyledCheckbox color={variant.color}>
            <Icon color={variant.color} checked={checked} viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </Icon>
          </StyledCheckbox>
        </CheckboxContainer>
      )}
      <Label color={variant.color}>{name}</Label>
      <TooltipIcon color={variant.color} />
    </LabelContainer>
  )
}

export const FilterLabels = () => {
  return (
    <>
      {labels.map((el: LabelType) => {
        return (
          !el.name.includes('Default') && (
            <LabelComponent name={el.name} checkbox variant={el} />
          )
        )
      })}
    </>
  )
}
