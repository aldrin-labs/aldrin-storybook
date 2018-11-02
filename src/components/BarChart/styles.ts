import styled from 'styled-components'
import { DiscreteColorLegend } from 'react-vis'
import { customAquaScrollBar } from '../cssUtils'


export const ScrollContainer = styled.div`
  height: ${(props: { height: number }) =>
  props.height ? `${ props.height + 9 }px` : `calc(100% + 6px)`};
  overflow: auto;
  ${customAquaScrollBar};
`

export const Container = styled.div`
  height: ${(props: { height: number, minWidth: number }) =>
    props.height ? `${props.height}px` : `100%`};
  min-width: ${(props: { height: number, minWidth: number }) => `${props.minWidth}px`};
`

export const ChartTooltip = styled.span`
  font-family: Roboto, sans-serif;
  font-size: 18px;
  font-weight: 500;
  text-align: left;
  color: #fff;
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 #0006;
  padding: 8px;
`
// it's a hotfix but we don't know why these items are height 0 and width 0 now.
// They should be not zero without this code
export const StyledDiscreteColorLegend = styled(DiscreteColorLegend)`

  & .rv-discrete-color-legend-item__color {
    height: 3px;
    width: 30px;

  }
  
`
