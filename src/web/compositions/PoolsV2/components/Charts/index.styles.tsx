import { BORDER_RADIUS, BREAKPOINTS } from '@variables/variables'
import styled from 'styled-components'

import { InlineText } from '@sb/components/Typography'

type CanvasProps = {
  bottom?: string
  left?: string
}
type CanvasContainerProps = {
  padding?: string
}

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
  width: ${(props) => `calc(35% + ${props.padding})`};
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
  letter-spacing: -1.5px;
`
export const CanvasContainer = styled.div<CanvasContainerProps>`
  width: ${(props) => `calc(65% - ${props.padding})`};
`
export const Canvas = styled.canvas<CanvasProps>`
  width: 100%;
  margin: auto;
  margin-bottom: ${(props) => props.bottom || '-7px'};
  margin-left: ${(props) => props.left || '0px'};
  border-left: 2px solid ${(props) => props.theme.colors.gray8};
`
