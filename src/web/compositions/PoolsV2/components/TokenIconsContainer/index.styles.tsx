import styled from 'styled-components'

type WaveElementType = {
  elementSize?: 'sm' | 'lg'
}

export const IconsContainer = styled.div`
  display: flex;
  flex-direction: row;

  div {
    margin-left: -10px;

    &:first-child {
      margin-left: 0px;
    }
  }
`
export const WaveElement = styled.div<WaveElementType>`
  position: absolute;
  display: block;
  top: ${(props) => (props.elementSize === 'sm' ? '10px' : '15px')};
  left: ${(props) => (props.elementSize === 'sm' ? '-5px' : '0')};
  width: 100%;

  .wave-icon {
    display: ${(props) => (props.elementSize === 'sm' ? 'none' : 'block')};
  }
  .small-wave-icon {
    display: ${(props) => (props.elementSize === 'sm' ? 'block' : 'none')};
  }
`
export const Container = styled.div`
  position: relative;
  max-width: 10%;
  margin-right: 0.7em;
`
