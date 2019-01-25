import { DiscreteColorLegend } from 'react-vis'
import styled from 'styled-components'

export const ContainerForCrossHairValues = styled.div`
  min-width: 250px;
  background-color: rgba(57, 62, 68, 0.8);
  color: #fff;
  padding: 5px;
  margin: 5px;
  border-radius: 5px;
  font-size: 1rem;
  box-shadow: 0 2px 6px 0 #0006;
`

// it's a hotfix but we don't know why these items are height 0 and width 0 now.
// They should be not zero without this code
export const StyledDiscreteColorLegend = styled(DiscreteColorLegend)`
  & .rv-discrete-color-legend-item__color {
    height: 3px;
    width: 30px;
  }
`
