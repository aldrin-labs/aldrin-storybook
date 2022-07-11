import { BORDER_RADIUS, BREAKPOINTS } from '@variables/variables'
import styled from 'styled-components'

import { InlineText } from '@sb/components/Typography'

export const ChartContainer = styled.div`
  width: 100%;
  background: ${(props) => props.theme.colors.gray7};
  border-radius: ${BORDER_RADIUS.lg};
  display: flex;
  flex-direction: row;

  @media (min-width: ${BREAKPOINTS.sm}) {
    width: 49%;
    min-height: 7em;
  }
`

export const TooltipContainer = styled.div`
  width: 35%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 1.3em;
`
export const ValueTitle = styled(InlineText)`
  white-space: nowrap;
  line-height: 100%;
  margin-top: 0.3em;
`
export const CanvasContainer = styled.div`
  width: 65%;
  border-left: 0.1em solid ${(props) => props.theme.colors.gray8};
`
export const Canvas = styled.canvas`
  margin-bottom: -7px;
`
