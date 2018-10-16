import styled from 'styled-components'
import { DiscreteColorLegend } from 'react-vis'
import { customAquaScrollBar } from '@styles/cssUtils'

export const ChartWithLegend = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`

export const ChartContainer = styled.div`
  text-align: center;
  min-height: 25rem;
  z-index: 2;
  width: 100%;
  height: 100%;
`

export const ChartWrapper = styled.div`
  width: 100%;
  height: initial;
  height: calc(100% - 178px);
`

export const ValueContainer = styled.div`
  margin: 0px;
  position: relative;
  top: -50%;
  transform: translate(0, -50%);
  text-align: center;
  z-index: 1;
  opacity: ${(props: { value: string }) => (props.value ? 1 : 0)};
  transition: opacity 0.25s ease-in-out;
`

export const SDiscreteColorLegend = styled(DiscreteColorLegend)`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  ${customAquaScrollBar} & .rv-discrete-color-legend-item {
    display: flex;
    align-items: center;
    color: ${(props: { textColor: string }) => props.textColor};
  }
  & .rv-discrete-color-legend-item__color {
    height: 14px;
    width: 14px;
    border-radius: 50%;
  }
  & .rv-discrete-color-legend-item__title {
    text-align: left;
    font-family: Roboto, sans-serif;
  }
`

export const LabelContainer = styled.div`
  margin: 0px;
  position: relative;
  display: flex;
  place-content: center;
  place-items: center;
  height: 90px;
`
