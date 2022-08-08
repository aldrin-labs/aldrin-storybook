import styled from 'styled-components'

export const customAquaScrollBar = `
  &::-webkit-scrollbar {
    width: 3px;
    height: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: transparent;
  }`

export const Icon = styled.i`
  margin-right: -1px;
`

export const LegendContainer = styled.div`
  border-radius: 5px;
  position: absolute;
  background-color: #869eb180;
  top: 0px;
  left: 10%;
  transition: ${(props: { transition: number }) => props.transition};
`
