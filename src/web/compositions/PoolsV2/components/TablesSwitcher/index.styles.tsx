import { BORDER_RADIUS, BREAKPOINTS, FONT_SIZES } from '@variables/variables'
import { rgba } from 'polished'
import styled, { css } from 'styled-components'

import { Button, PADDINGS } from '@sb/components/Button'

type StyledSwitcher = {
  isActive?: boolean
  radius?: string
  $variant?: 'small' | 'huge'
}

export interface RadioContainer {
  checked: boolean
  width?: string
  margin?: string
  backgroundColor?: string
  height?: string
}

type SwitcherContainerType = {
  $variant?: keyof typeof VARIANTS
}

const VARIANTS = {
  huge: {
    container: css`
      padding: 0.2em;
      border-radius: ${BORDER_RADIUS.rg};
      font-size: ${FONT_SIZES.sm};
    `,
    button: css`
      padding: ${PADDINGS.lg};
      border-radius: ${BORDER_RADIUS.md};

      @media (min-width: ${BREAKPOINTS.sm}) {
        width: auto;
      }
    `,
  },
  small: {
    container: css`
      padding: 0.3em;
      border-radius: 10px;
      font-size: ${FONT_SIZES.esm};
    `,
    button: css`
      padding: 3px 5px;
      border-radius: 8px;

      @media (min-width: ${BREAKPOINTS.sm}) {
        width: auto;
      }
    `,
  },
  text: {
    container: css`
      padding: 0.5em 1em;
      border-radius: 7px;
      font-size: ${FONT_SIZES.esm};
      color: ${(props) => props.theme.colors.gray3};
      font-weight: 600;
    `,
    button: css`
      width: 20px;
      height: 20px;
      margin-left: 0.5em;
      border-radius: 5px;
      padding: 0.5em;
      background: ${(props) => rgba(props.theme.colors.white4, 0.25)};
      color: ${(props) => props.theme.colors.gray3};
      min-width: 15px;
      font-weight: 600;
    `,
  },
}

export const Container = styled.div<SwitcherContainerType>`
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  color: ${(props) => props.theme.colors.white3};
  background: ${(props) => props.theme.colors.white6};
  border-radius: ${BORDER_RADIUS.rg};
  font-size: ${FONT_SIZES.md};
  padding: 0.2em;
  ${(props) => VARIANTS[props.$variant || 'huge'].container};
  outline: none;
  border: none;
  cursor: pointer;
  width: 90%;
  justify-content: space-between;

  @media (min-width: ${BREAKPOINTS.sm}) {
    width: auto;
  }
`
export const SwitcherButton = styled(Button)<StyledSwitcher>`
  padding: ${PADDINGS.lg};
  background: ${(props) =>
    props.isActive ? props.theme.colors.white5 : 'transparent'};
  white-space: nowrap;
  color: ${(props) =>
    props.isActive ? props.theme.colors.white1 : props.theme.colors.white3};
  border-radius: ${BORDER_RADIUS.md};
  outline: none;
  border: none;
  cursor: pointer;
  transition: 0.5s;
  ${(props) => VARIANTS[props.$variant || 'huge'].button};
  display: flex;
  justify-content: center;
  align-items: center;
`
