import React, { useState } from 'react'

import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { InlineText } from '@sb/components/Typography'

import { FILTER_LABELS } from '../../config'
import { TooltipIcon } from '../Icons'
import {
  CheckboxContainer,
  HiddenCheckbox,
  Icon,
  Label,
  LabelContainer,
  StyledCheckbox,
} from './index.styles'

type VariantType = {
  labelStyle: { backgroundColor: string; color: string }
  text: string
  hoverStyle: { backgroundColor: string; color: string }
  tooltipText?: any
  icon?: any
}

export const LabelComponent = ({
  checkbox = false,
  variant,
  tooltipText,
}: {
  checkbox?: boolean
  variant: VariantType
  tooltipText?: any
}) => {
  const [checked, setChecked] = useState(true)

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
        {variant.icon || variant.text}
      </Label>
      {variant.tooltipText && (
        <DarkTooltip
          title={<InlineText color="white1">{tooltipText}</InlineText>}
        >
          <span>
            <TooltipIcon color={variant.labelStyle.color} />
          </span>
        </DarkTooltip>
      )}
    </LabelContainer>
  )
}

export const FilterLabels = () => {
  return (
    <>
      {FILTER_LABELS.map((el) => {
        return (
          <LabelComponent tooltipText={el.tooltipText} checkbox variant={el} />
        )
      })}
    </>
  )
}
