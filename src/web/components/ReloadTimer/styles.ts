import { COLORS, BORDER_RADIUS } from '@variables/variables'
import styled from 'styled-components'

import { TimerButtonProps } from './types'

export const TimerButton = styled.div<TimerButtonProps>`
  width: 1.5em;
  height: 1.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${COLORS.bodyBackground};
  border-radius: ${BORDER_RADIUS.sm};
  cursor: pointer;
  margin: ${(props: TimerButtonProps) => props.margin || '0 0.5em 0 0'};

  svg {
    display: block;
  }
`
