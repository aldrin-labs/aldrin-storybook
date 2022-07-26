import { TRANSITION } from '@variables/variables'
import styled, { css } from 'styled-components'

type StyledLinkProps = {
  margin?: string
  height?: string
  $variant?: keyof typeof VARIANTS
}

export const VARIANTS = {
  withBack: css`
    width: 40px;
    height: 36px;
    transition: ${TRANSITION};
    margin: 0;
    background: ${(props) => props.theme.colors.gray6};
    border-radius: 0.5em;
    padding: 0.4em;
  `,
  withoutBack: css`
    width: 16px;
    height: 16px;
    background: none;
    border-radius: none;
    padding: 0;

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
  `,
}

export const StyledLink = styled.a<StyledLinkProps>`
  width: 40px;
  transition: ${TRANSITION};
  background: ${(props) => props.theme.colors.gray6};
  border-radius: 0.5em;
  padding: 0.4em;
  ${(props) => VARIANTS[props.$variant || 'withBack']};
  margin: ${(props) => props.margin || '0'};
  height: ${(props) => props.height || '16px'};

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
