import styled from 'styled-components'

export const ChartWrapper = styled.div`
  width: 100%;
  height: initial;
  height: 100%;
`

export const ValueContainer = styled.div`
  margin: 0px;
  position: relative;
  top: -50%;
  transform: translate(0, -50%);
  text-align: center;
  z-index: -1;
  opacity: ${(props: { isOpacity: boolean }) => (props.isOpacity ? 1 : 0)};
  transition: opacity 0.25s ease-in-out;
`
