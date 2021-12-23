import { BORDER_RADIUS, COLORS, TRANSITION } from '@variables/variables'
import styled from 'styled-components'
import { FlexBlock } from '../Layout'
import { Text } from '../Typography'


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

  ${(props: RadioButtonProps) => props.selected ? `
  &:after {
    display: block;
    content: "";
    width: 6px;
    height: 6px;
    background: ${COLORS.primary};
    border-radius: 50%;
    margin: 3px;
  }
  ` : ''}
`

export const RadioLabel = styled.label`
  font-size: 0.68em;
  color: ${COLORS.primaryWhite};
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
  background: ${COLORS.black};
  border: 2px solid ${COLORS.primary};
  border-radius: ${BORDER_RADIUS.sm};
  position: relative;
  cursor: pointer;
  transition: ${TRANSITION};

  ${(props: CheckMarkProps) => props.checked ? `
    & {
      background: ${COLORS.primary};
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
  ` : ''}
`


export const LabelWrap = styled(FlexBlock)`
  margin: 0 0 20px 0;
  align-items: center;

  &::after {
    display: block;
    content: "";
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
