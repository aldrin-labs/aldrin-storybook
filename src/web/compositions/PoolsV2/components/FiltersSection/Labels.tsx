import React, { useState } from 'react'

import { FILTER_LABELS, labels } from '../../config'
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
  variant: any
  name: string
}) => {
  const [checked, setChecked] = useState(false)

  return (
    <LabelContainer
      onClick={() => {
        setChecked(!checked)
      }}
      hoverColor={variant.hoverStyle.color}
      hoverBackground={variant.hoverStyle.backgroundColor}
      background={variant.labelStyle.backgroundColor}
    >
      {checkbox && (
        <CheckboxContainer>
          <HiddenCheckbox type="checkbox" checked={checked} />
          <StyledCheckbox
            hoverColor={variant.hoverStyle.color}
            color={variant.labelStyle.color}
          >
            <Icon
              hoverColor={variant.hoverStyle.color}
              color={variant.labelStyle.color}
              checked={checked}
              viewBox="0 0 24 24"
            >
              <polyline points="20 6 9 17 4 12" />
            </Icon>
          </StyledCheckbox>
        </CheckboxContainer>
      )}
      <Label
        hoverColor={variant.hoverStyle.color}
        color={variant.labelStyle.color}
      >
        {name}
      </Label>
      <TooltipIcon
        color={variant.labelStyle.color}
      />
    </LabelContainer>
  )
}

export const FilterLabels = () => {
  return (
    <>
      {FILTER_LABELS.map((el) => {
        return <LabelComponent name={el.text} checkbox variant={el} />
      })}
    </>
  )
}
