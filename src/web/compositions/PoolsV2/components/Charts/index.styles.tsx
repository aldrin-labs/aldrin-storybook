import { BORDER_RADIUS, BREAKPOINTS, FONT_SIZES } from '@variables/variables'
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
  width: 90%;
  background: ${(props) => props.theme.colors.gray7};
  border-radius: ${BORDER_RADIUS.lg};
  display: flex;
  flex-direction: row;
  margin-bottom: 1em;
  height: 8em;

  @media (min-width: ${BREAKPOINTS.sm}) {
    width: 49%;
    min-height: 7em;
    height: auto;
    margin: 0;
  }
`

export const TooltipContainer = styled.div`
  width: ${(props) => `calc(35% + ${props.padding})`};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 1.2em;
`
export const ValueTitle = styled(InlineText)`
  white-space: nowrap;
  line-height: 100%;
  margin-top: 0.3em;
  font-size: ${FONT_SIZES.lg};

  @media (min-width: ${BREAKPOINTS.sm}) {
    font-size: ${FONT_SIZES.xl};
  }
`
export const CanvasContainer = styled.div<CanvasContainerProps>`
  width: ${(props) => `calc(65% - ${props.padding})`};
`
export const Canvas = styled.canvas<CanvasProps>`
  width: 100%;
  margin: auto;
  margin-bottom: ${(props) => props.bottom || '-7px'};
  margin-left: ${(props) => props.left || '0px'};
  border-left: 1px solid ${(props) => props.theme.colors.gray8};
`
