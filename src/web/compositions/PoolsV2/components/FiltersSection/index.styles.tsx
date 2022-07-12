import { BORDER_RADIUS, FONT_SIZES } from '@variables/variables'
import styled from 'styled-components'

import { PADDINGS } from '@sb/components/Button'

import { RootRow } from '../../index.styles'

type LabelContainerProps = {
  background: string
}

type SCheckboxProps = {
  color: string
}

type LabelProps = {
  color: string
}

type IconProps = {
  checked: boolean
  color: string
}

export const LabelContainer = styled.div<LabelContainerProps>`
  background: ${(props) => props.theme.colors[props.background || '']};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${PADDINGS.md};
  border-radius: ${BORDER_RADIUS.md};
  position: relative;
  cursor: pointer;
  margin-right: 1em;
`
export const HiddenCheckbox = styled.input`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 16px;
  width: 16px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  opacity: 0;
  position: absolute;
  white-space: nowrap;
`
export const StyledCheckbox = styled.div<SCheckboxProps>`
  display: inline-block;
  width: 11px;
  height: 11px;
  background: transparent;
  border: 1px solid ${(props) => props.theme.colors[props.color || '']};
  border-radius: 2px;
  transition: all 150ms;
`
export const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin-right: 5px;
  position: relative;
`
export const Icon = styled.svg<IconProps>`
  fill: none;
  stroke: ${(props) => props.theme.colors[props.color || '']};
  stroke-width: 2px;
  display: ${(props) => (props.checked ? 'block' : 'none')};
`
export const Label = styled.label<LabelProps>`
  color: ${(props) => props.theme.colors[props.color || '']};
  cursor: pointer;
  font-size: ${FONT_SIZES.sm};
  font-weight: 700;
`
export const SRootRow = styled(RootRow)`
  justify-content: flex-start;
`
