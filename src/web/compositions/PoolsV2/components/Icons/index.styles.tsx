import styled from 'styled-components'

type TooltipIconContainerType = {
  margin?: string
}

export const SearchIconContainer = styled.svg`
  position: absolute;
  right: 1.5em;
  transform: translateY(80%);
`
export const TooltipIconContainer = styled.svg<TooltipIconContainerType>`
  margin: ${(props) => props.margin || '0 0 0 5px'};
`
export const IconContainer = styled.svg`
  margin-right: 0.2em;
`
