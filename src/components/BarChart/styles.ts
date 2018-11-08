import styled from 'styled-components'
import { DiscreteColorLegend } from 'react-vis'
import { Card } from '@material-ui/core'

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

export const ChartTooltip = styled(Card)`
  text-align: left;
  padding: 5px;
`
// it's a hotfix but we don't know why these items are height 0 and width 0 now.
// They should be not zero without this code
export const StyledDiscreteColorLegend = styled(DiscreteColorLegend)`
  font-family: ${(props: { fontFamily: string }) => props.fontFamily};
  & .rv-discrete-color-legend-item__color {
    height: 3px;
    width: 30px;
  }
`

export const axisStyle = ({stroke, textColor, fontSize}) => ({
  ticks: {
    padding: '1rem',
    stroke: stroke,
    opacity: 0.75,
    fontSize: fontSize,
    fontWeight: 100,
  },
  text: { stroke: 'none', fill: textColor, fontWeight: 600, opacity: 1 },
})
