import { TRANSITION } from '@variables/variables'
import styled from 'styled-components'

type StyledLinkProps = {
  margin?: string
  height?: string
}

export const StyledLink = styled.a<StyledLinkProps>`
  width: 40px;
  height: ${(props) => props.height || '36px'};
  transition: ${TRANSITION};
  margin: ${(props) => props.margin || '0'};
  background: ${(props) => props.theme.colors.gray6};
  border-radius: 0.4em;
  padding: 0.4em;

  &:hover {
    svg path:not(.not-fill) {
      fill: ${(props) => props.theme.colors.gray0};
    }

    svg {
      defs {
        clipPath {
          rect {
            fill: ${(props) => props.theme.colors.gray0};
          }
        }
      }
    }
  }
`
