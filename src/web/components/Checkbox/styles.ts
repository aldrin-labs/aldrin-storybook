import styled from 'styled-components'
import { Text } from '../Typography'
import { COLORS, BORDER_RADIUS } from '@variables/variables'

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
  background: ${COLORS.primary};
  border-radius: ${BORDER_RADIUS.sm};
  position: relative;
  cursor: pointer;

  ${(props: CheckMarkProps) => props.checked ? `
    &:after {
      content: "";
      position: absolute;
      left: 6px;
      top: 3px;
      width: 5px;
      height: 8px;
      border-right: 1px solid ${COLORS.black};
      border-bottom: 1px solid ${COLORS.black};
      transform: rotate(45deg);
    }
  ` : ''}
`