import styled from 'styled-components'

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
export const WaveElement = styled.div`
  position: absolute;
  display: block;
  top: 15px;
  left: 0;
  width: 100%;
`
export const Container = styled.div`
  position: relative;
  max-width: 10%;
  margin-right: 0.7em;
`
