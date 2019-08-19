import styled from 'styled-components'
import { DiscreteColorLegend } from 'react-vis'
import { customAquaScrollBar } from '../cssUtils'

export const ChartWithLegend = styled.div`
  display: flex;
  flex-direction: ${props => props.vertical ? 'column-reverse' : 'row'};
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 90%;
`

export const ChartContainer = styled.div`
  text-align: center;
  z-index: 2;
  width: fit-content;
  height: 100%;
  marigin: 0px;
`

export const ColorLegendContainer = styled.div`
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  transform: scaleX(-1);
  min-width: ${(props: {width: number}) => props.width + 3}px;
  margin-top: 1.2rem;
  ${customAquaScrollBar}
`

export const ColorLegendPercentContainer = styled.div`
  font-weight: 500;
  font-size: 1.28rem;

  span {
    display: inline-block;

    &:first-child {
      color: #8B9AB1;
      width: 6.8rem;
    }
    &:last-child {
      color: #16253D;
    }
  }

  @media only screen and (max-width: 1280px) {
    span:first-child {
      width: 5.5rem;
    }
  }
`

export const SDiscreteColorLegend = styled(DiscreteColorLegend)`
  transform: scaleX(-1);
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  ${customAquaScrollBar} & .rv-discrete-color-legend-item {
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${(props: { textColor: string }) => props.textColor};
    padding: .64rem 0;
  }
  & .rv-discrete-color-legend-item__color {
    height: .64rem;
    width: .64rem;
    border-radius: 50%;
  }
  & .rv-discrete-color-legend-item__title {
    text-align: left;
    font-family: 'DM Sans', sans-serif;
    font-size: 1.6rem;
    letter-spacing: 1px;
    
    & > div {
      display: flex;
      align-items: center;

      width: 10.5rem;
      span:last-child {
        font-weight: 600;
      }
    }
  }
`

export const LabelContainer = styled.div`
margin: 0px;
position: relative;
display: flex;
place-content: center;
place-items: center;
height: 10%;
`
