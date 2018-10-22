import styled from 'styled-components'

export const ChartContainer = styled.div`
  width: ${(props: {width: number}) =>
      props.width + 'px'
    };
`

export const ValueContainer = styled.div`
  margin: 0px;
  position: relative;
  top: -50%;
  transform: translate(0,-50%);
  text-align: center;
  z-index: -1;
`

export const LabelContainer = styled.div`
  margin: 0px;
  position: relative;
  text-align: center;
  height: 90px;
`
