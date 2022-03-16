import { BORDER_RADIUS, COLORS, TRANSITION, THEME } from '@variables/variables'
import styled from 'styled-components'

import { FlexBlock } from '../Layout'
import { Text } from '../Typography'
import { SwitcherContainerProps } from './types'

export const Container = styled(FlexBlock)`
  margin: 5px 0;
`
export const Option = styled(FlexBlock)`
  align-items: center;
  margin-right: 10px;
`

interface RadioButtonProps {
  selected: boolean
}

export const RadioButton = styled.div<RadioButtonProps>`
  height: 16px;
  width: 16px;
  border: 2px solid ${COLORS.primary};
  background: ${COLORS.background};
  border-radius: 50%;
  margin-right: 5px;

  ${(props: RadioButtonProps) =>
    props.selected
      ? `
  &:after {
    display: block;
    content: "";
    width: 6px;
    height: 6px;
    background: ${COLORS.primary};
    border-radius: 50%;
    margin: 3px;
  }
  `
      : ''}
`

export const RadioLabel = styled.label`
  font-size: 0.68em;
  color: ${COLORS.main};
`

export const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 15px;
`

export const Label = styled(Text)`
  margin: 0;
  margin-left: 5px;
`

interface CheckMarkProps {
  checked: boolean
}

export const CheckMark = styled.div<CheckMarkProps>`
  width: 16px;
  height: 16px;
  background: ${THEME.checkbox.color};
  border: 2px solid ${THEME.checkbox.borderColor};
  border-radius: ${BORDER_RADIUS.sm};
  position: relative;
  cursor: pointer;
  transition: ${TRANSITION};

  ${(props: CheckMarkProps) =>
    props.checked
      ? `
    & {
      background: ${THEME.checkbox.borderColor};
    }
    &:after {
      content: "";
      position: absolute;
      left: 4px;
      top: 1px;
      width: 5px;
      height: 8px;
      border-right: 1px solid ${COLORS.black};
      border-bottom: 1px solid ${COLORS.black};
      transform: rotate(45deg);
    }
  `
      : ''}
`

export const LabelWrap = styled(FlexBlock)`
  margin: 0 0 20px 0;
  align-items: center;

  &::after {
    display: block;
    content: '';
    border-bottom: 1px solid ${COLORS.border};
    flex: 1;
    margin: -20px 0 0 10px;
    transform: translateY(10px);
  }
`

export const GroupLabelText = styled.label`
  font-size: 11px;
  color: ${COLORS.textAlt};
`

export const SwitcherButton = styled.div`
  height: 20px;
  width: 20px;
  border-radius: 20px;
  background: ${COLORS.success};
  margin: 1px;
  transition: ${TRANSITION};
`

/** Switcher */
export const SwitcherContainer = styled.div<SwitcherContainerProps>`
  height: 24px;
  width: 44px;
  border-radius: 24px;
  border: 1px solid ${COLORS.border};
  cursor: pointer;
  transition: ${TRANSITION};
  background: ${(props: SwitcherContainerProps) =>
    props.$checked ? COLORS.successAlt : COLORS.blockBackground};

  ${SwitcherButton} {
    margin-left: ${(props: SwitcherContainerProps) =>
      props.$checked ? '21px' : '1px'};
  }§
`
