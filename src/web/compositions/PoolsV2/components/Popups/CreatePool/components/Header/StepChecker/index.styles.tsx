import styled from 'styled-components'

export const Circle = styled.div`
  position: relative;
  width: 3em;
  height: 3em;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.white5};
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 1px;
`
export const StepContainer = styled.div`
  position: absolute;
`
