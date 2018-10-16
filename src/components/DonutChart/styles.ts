import styled from 'styled-components'

export const ChartContainer = styled.div`
  min-height: 25rem;
  z-index: 2;
  width: 100%;
  height: 100%;
`

export const ChartWrapper = styled.div`
  width: 100%;
  height: calc(100% - 90px);
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

export const LabelContainer = styled.div`
  margin: 0px;
  position: relative;
  display: flex;
  place-content: center;
  place-items: center;
  height: 90px;
`
