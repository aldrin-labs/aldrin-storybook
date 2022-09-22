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

export const Container = styled.div`
  position: relative;
  max-width: 10%;
  margin-right: 0.7em;
`
