import { BORDER_RADIUS, BREAKPOINTS, FONT_SIZES } from '@variables/variables'
import styled from 'styled-components'

import { Button, PADDINGS } from '@sb/components/Button'

type StyledSwitcher = {
  isActive?: boolean
  radius?: string
}

export interface RadioContainer {
  checked: boolean
  width?: string
  margin?: string
  backgroundColor?: string
  height?: string
}

export const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  color: ${(props) => props.theme.colors.gray0};
  background: ${(props) => props.theme.colors.gray7};
  border-radius: ${BORDER_RADIUS.rg};
  font-size: ${FONT_SIZES.md};
  outline: none;
  border: none;
  border-radius: none;
  cursor: pointer;
  padding: 0.2em;
  width: 90%;
  justify-content: space-between;

  @media (min-width: ${BREAKPOINTS.sm}) {
    width: auto;
    font-size: ${FONT_SIZES.sm};
  }
`
export const SwitcherButton = styled(Button)<StyledSwitcher>`
  padding: ${PADDINGS.lg};
  background: ${(props) =>
    props.isActive ? props.theme.colors.gray5 : 'transparent'};
  white-space: nowrap;
  color: ${(props) =>
    props.isActive ? props.theme.colors.gray0 : props.theme.colors.gray1};
  border-radius: ${BORDER_RADIUS.md};
  outline: none;
  border: none;
  cursor: pointer;
  transition: 0.5s;
  width: 50%;

  @media (min-width: ${BREAKPOINTS.sm}) {
    width: auto;
  }
`
